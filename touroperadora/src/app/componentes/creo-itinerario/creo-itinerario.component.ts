import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { faArrowDownWideShort, faBars, faCheck, faPenToSquare, faSquare, faSquareXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { ActividadService } from 'src/app/servicios/actividad.service';
import { ImagenService } from 'src/app/servicios/imagen.service';
import { ItinerarioService } from 'src/app/servicios/itinerario.service';
declare var window: any;

@Component({
  selector: 'app-creo-itinerario',
  templateUrl: './creo-itinerario.component.html',
  styleUrls: ['./creo-itinerario.component.css']
})
export class CreoItinerarioComponent implements OnInit {
  //iconos
  fabars = faBars;
  fatrashcan = faTrashCan
  fapentosquare = faPenToSquare
  fasquarexmark = faSquareXmark
  facheck = faCheck;
  //iconos
  //modales
  modalEditoItinerario: any;
  modalEliminoActividad: any;
  modalEliminoItinerario: any;
  modalEliminoImagen: any;
  //modales
  //paginacion
  page_size: number = 5;
  page_number: number = 1;
  pageSizeOptions = [1, 5, 10, 25, 50];
  //paginacion

  itinerarioEditoId: any;
  toast = false;
  toastVerde: any
  toastAct = false;
  TextoToastAct: any;
  arrayActividades: any;
  arrayItinerario: any = [];
  arrayImagenes: any;
  itinerarioForms: FormGroup;
  relacionForms: FormGroup;
  itinerarioEditForms: FormGroup;
  relacionImagenForms: FormGroup;
  archivo!: File;
  eliminoActividad_actId: any;
  eliminoActividad_itiId: any;
  eliminoItinerarioId: any;
  eliminoImagen_itiId: any;

  constructor(
    private actividadservice: ActividadService,
    private itinerarioservice: ItinerarioService,
    private imagenservice: ImagenService,
    private vb: FormBuilder,

  ) {
    this.itinerarioForms = this.vb.group({
      ciudad: ['', Validators.required],
      cordenadasHotel: ['', Validators.required],
      nombreHotel: ['', Validators.required],
      precioNoche: ['', Validators.required],
      plazas: ['', Validators.required],
    });

    this.itinerarioEditForms = this.vb.group({
      ciudad: ['', Validators.required],
      cordenadasHotel: ['', Validators.required],
      nombreHotel: ['', Validators.required],
      precioNoche: ['', Validators.required],
      plazas: ['', Validators.required],

    });

    this.relacionForms = this.vb.group({
      actividades: ['', Validators.required],
      itinerario: ['', Validators.required],
    });

    this.relacionImagenForms = this.vb.group({
      itinerarioI: ['', Validators.required],
      imagen: ['', Validators.required],
    });
  }


  ngOnInit(): void {
    this.getActividades();
    this.getItinerarios();
    this.getImagenes();
    this.modalEditoItinerario = new window.bootstrap.Modal(document.getElementById('modalEditoItinerario'));
    this.modalEliminoActividad = new window.bootstrap.Modal(document.getElementById('modalEliminoActividad'));
    this.modalEliminoItinerario = new window.bootstrap.Modal(document.getElementById('modalEliminoItinerario'));
    this.modalEliminoImagen = new window.bootstrap.Modal(document.getElementById('modalEliminoImagen'));
  }
  handlePage(e: PageEvent) {
    this.page_number = e.pageIndex + 1;
    this.page_size = e.pageSize;
  }

  getActividades() {
    this.actividadservice.actividades().subscribe((listaactividades: any) => {
      this.arrayActividades = listaactividades;
      console.log(this.arrayActividades);
    })
  }

  getImagenes() {
    this.imagenservice.getTodasImagenes().subscribe((imagenes: any) => {
      this.arrayImagenes = imagenes;
    })
  }

  getItinerarios() {
    this.itinerarioservice.itinerarios().subscribe((listaitinerarios: any) => {

      this.arrayItinerario = listaitinerarios;
      console.log(this.arrayItinerario);
    })
  }

  agregoItinerario() {
    this.toast = false;
    const creoItinerario: any = {
      ciudad: this.itinerarioForms.get('ciudad')?.value,
      cordenadasHotel: this.itinerarioForms.get('cordenadasHotel')?.value,
      nombreHotel: this.itinerarioForms.get('nombreHotel')?.value,
      precioNoche: this.itinerarioForms.get('precioNoche')?.value,
      imagenHotel: this.itinerarioForms.get('imagenHotel')?.value,
      plazas: this.itinerarioForms.get('plazas')?.value,

    }
    this.itinerarioservice.creoItinerario(creoItinerario).subscribe((creoItinerario: any) => {
      this.getItinerarios();
      this.toastVerde = "Itinerario creado correctamente";
      this.toast = true;

    })
  }

  relacionoActividad() {
    this.toastAct = false;
    let actividades: any = this.relacionForms.get('actividades')?.value
    let itinerario: any = this.relacionForms.get('itinerario')?.value

    actividades.forEach((element: any) => {
      this.itinerarioservice.addActividad(itinerario, element).subscribe((addActividad: any) => {
        console.log(addActividad);
        this.TextoToastAct = "Actividad agregada al itinerario";
        this.toastAct = true;
        this.getItinerarios();
      }, (error: any) => {
        swal("Error", "Esta actividad ya esta asignada a este itinerario", "error")
      }
      );
    });
  }

  getArchivo(event: any) {
    //Select File
    this.archivo = event.target.files[0];
    console.log("q carajo es " + this.archivo);
  }

  suboImagen() {
    this.toast = false
    console.log('envio' + this.archivo + this.archivo.name);
    this.imagenservice.postImagen(this.archivo, this.archivo.name);
    this.toastVerde = "Imagen subida correctamente"
    this.toast = true;

  }

  addImageItinerario() {
    this.toast = false
    let imagen: any = this.relacionImagenForms.get('imagen')?.value
    console.log('imagen' + imagen)
    let itinerarioid: any = this.relacionImagenForms.get('itinerarioI')?.value
    let okey: any
    let arrayIti: any = []
    let arrayIti2: any = []

    this.itinerarioservice.itinerarios().subscribe((listaitinerarios: any) => {
      for (let itinerario of listaitinerarios) {

        if (itinerario.imagen != null) {   //array de itinerarios con imagenes asignadas
          arrayIti2.push(itinerario)

        }
      }
      console.log(arrayIti2)
      for (let itinerario of arrayIti2) {

        if (itinerario.imagen.imagenId == imagen) {//añado a un array los itinerarios que tengas la imagen elegida en el select
          arrayIti.push(itinerario)
        }
      }
      console.log(arrayIti)
      if (arrayIti.length > 0) {
        swal("Error", "Esta imagen ya esta asignada a otro itinerario", "error")
      } else {
        this.itinerarioservice.addImagen(itinerarioid, imagen).subscribe((addImagen: any) => {
          console.log(addImagen);
          this.toastVerde = "Imagen asignada al itinerario correctamente"
          this.toast = true;
          this.getItinerarios();
        })
      }
    })

  }

  eliminoItinerario(itinerarioId: any) {
    this.toast = false;
    this.itinerarioservice.eliminoItinerario(itinerarioId).subscribe((eliminoItinerario: any) => {
      console.log(eliminoItinerario);
      this.toastVerde = "Itinerario eliminado correctamente"
      this.toast = true;

      this.getItinerarios();
    })
  }
  window() {
    location.reload()
  }

  // MODALES ################################################## MODALES ####################################################### MODALES

  abroModal(itinerarioId: any) {
    this.modalEditoItinerario.show();
    this.posteditoItinerario(itinerarioId);
    this.itinerarioEditoId = itinerarioId;
  }

  abroModalIti(itinerarioId: any) {
    this.eliminoItinerarioId = itinerarioId;
    this.modalEliminoItinerario.show();
  }

  abroModalImg(itinerarioId: any) {
    this.eliminoImagen_itiId = itinerarioId;
    this.modalEliminoImagen.show();
  }

  abroModalAct(itinerarioId: any, actividadId: any) {
    this.modalEliminoActividad.show();
    this.eliminoActividad_actId = actividadId;
    this.eliminoActividad_itiId = itinerarioId;
  }

  cierroModal() {
    this.modalEditoItinerario.hide();
  }

  // MODALES ################################################## MODALES ####################################################### MODALES


  posteditoItinerario(itinerarioId: any) {
    this.itinerarioservice.unItinerario(itinerarioId).subscribe((itinerarioObj: any) => {
      this.itinerarioEditForms.patchValue({
        itinerarioId: itinerarioObj.itinerarioId,
        ciudad: itinerarioObj.ciudad,
        cordenadasHotel: itinerarioObj.cordenadasHotel,
        nombreHotel: itinerarioObj.nombreHotel,
        precioNoche: itinerarioObj.precioNoche,
        plazas: itinerarioObj.plazas,
      })
    })
  }

  editoItinerario() {
    this.toast = false
    const editoItinerario: any = {

      ciudad: this.itinerarioEditForms.get('ciudad')?.value,
      cordenadasHotel: this.itinerarioEditForms.get('cordenadasHotel')?.value,
      nombreHotel: this.itinerarioEditForms.get('nombreHotel')?.value,
      precioNoche: this.itinerarioEditForms.get('precioNoche')?.value,
      plazas: this.itinerarioEditForms.get('plazas')?.value,
    }
    this.itinerarioservice.editoItinerario(this.itinerarioEditoId, editoItinerario).subscribe((data: any) => {
      this.toastVerde = "Itinerario editado correctamente"
      this.toast = true;
      this.getItinerarios();
    });
  }

  eliminoActividad(EliminoActividadId: any, EliminoActividadItinerarioId: any) {
    this.toastAct = false;
    let actividadId = EliminoActividadId;
    let itinerarioId = EliminoActividadItinerarioId;
    this.itinerarioservice.removeActividad(itinerarioId, actividadId).subscribe((eliminoActividad: any) => {
      this.TextoToastAct = "Actividad eliminada del itinerario";
      this.toastAct = true;
      this.getItinerarios();
    });
  }
  eliminoImagen(itinerarioId: any) {
    this.itinerarioservice.removeImagen(itinerarioId).subscribe((eliminoImagen: any) => {
      this.toastVerde = "Imagen eliminada del itinerario correctamente"
      this.toast = true;
      this.getItinerarios();
    });
  }

}
