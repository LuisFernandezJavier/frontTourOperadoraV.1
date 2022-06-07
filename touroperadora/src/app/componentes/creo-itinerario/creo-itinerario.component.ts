import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  toast = false;
  toastAct = false;
  TextoToastAct: any;
  arrayActividades: any;
  arrayItinerario: any;
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
      itinerarioId: ['', Validators.required],
      ciudad: ['', Validators.required],
      cordenadasHotel: ['', Validators.required],
      nombreHotel: ['', Validators.required],
      precioNoche: ['', Validators.required],
      actividades: ['', Validators.required],
      imagenHotel: ['', Validators.required],

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
      for (let i = 0; i < listaitinerarios.length; i++) {
        const itinerario = {

        }
      }
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
      plazas : this.itinerarioForms.get('plazas')?.value,

    }
    console.log(creoItinerario);
    this.itinerarioservice.creoItinerario(creoItinerario).subscribe((creoItinerario: any) => {
      console.log(creoItinerario);
      this.getItinerarios();
      this.toast = true;

    })
  }

  relacionoActividad() {
    this.toastAct = false;
    let actividades: any = this.relacionForms.get('actividades')?.value
    let itinerario: any = this.relacionForms.get('itinerario')?.value

    console.log(actividades)
    actividades.forEach((element: any) => {
      this.itinerarioservice.addActividad(itinerario, element).subscribe((addActividad: any) => {
        console.log(addActividad);
        this.TextoToastAct ="Actividad agregada al itinerario";
        this.toastAct = true;
        this.getItinerarios();
      });
    });
  }

  getArchivo(event: any) {
    //Select File
    this.archivo = event.target.files[0];
    console.log("q carajo es " + this.archivo);
  }

  suboImagen() {
    console.log('envio' + this.archivo + this.archivo.name);
    this.imagenservice.postImagen(this.archivo, this.archivo.name);


  }

  addImageItinerario() {
    let imagen: any = this.relacionImagenForms.get('imagen')?.value
    let itinerario: any = this.relacionImagenForms.get('itinerarioI')?.value
    this.itinerarioservice.addImagen(itinerario, imagen).subscribe((addImagen: any) => {
      console.log(addImagen);
      this.getItinerarios();
    })
  }



  eliminoItinerario(itinerarioId: any) {
    
    this.itinerarioservice.eliminoItinerario(itinerarioId).subscribe((eliminoItinerario: any) => {
      console.log(eliminoItinerario);
      
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
      })
    })

  }

  editoItinerario() {
    let itinerarioId = this.itinerarioEditForms.get('itinerarioId')?.value
    console.log('id edito ' + itinerarioId);
    const editoItinerario: any = {
      ciudad: this.itinerarioEditForms.get('ciudad')?.value,
      cordenadasHotel: this.itinerarioEditForms.get('cordenadasHotel')?.value,
      nombreHotel: this.itinerarioEditForms.get('nombreHotel')?.value,
      precioNoche: this.itinerarioEditForms.get('precioNoche')?.value,
    }
    this.itinerarioservice.editoItinerario(itinerarioId, editoItinerario).subscribe((editoItinerario: any) => {

      this.getItinerarios();
    });

  }

  eliminoActividad(EliminoActividadId: any, EliminoActividadItinerarioId: any) {
    this.toastAct = false;
    let actividadId = EliminoActividadId;
    let itinerarioId = EliminoActividadItinerarioId;

    console.log('id actividad ' + actividadId + ' id itinerario ' + itinerarioId);

    this.itinerarioservice.removeActividad(itinerarioId, actividadId).subscribe((eliminoActividad: any) => {
      this.TextoToastAct ="Actividad eliminada del itinerario";
        this.toastAct = true;
      this.getItinerarios();
    });


  }

  eliminoImagen(itinerarioId: any) {
    this.itinerarioservice.removeImagen(itinerarioId).subscribe((eliminoImagen: any) => {
      this.getItinerarios();
    });
  }


}
