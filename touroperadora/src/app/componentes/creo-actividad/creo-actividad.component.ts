import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faBars, faTrashCan, faPenToSquare, faCheck } from '@fortawesome/free-solid-svg-icons';
import { ActividadService } from 'src/app/servicios/actividad.service';
import { ItinerarioService } from 'src/app/servicios/itinerario.service';
declare var window: any;

@Component({
  selector: 'app-creo-actividad',
  templateUrl: './creo-actividad.component.html',
  styleUrls: ['./creo-actividad.component.css']
})
export class CreoActividadComponent implements OnInit {

  //iconos
  fabars = faBars;
  fatrashcan = faTrashCan
  fapentosquare = faPenToSquare
  facheck = faCheck;
  //iconos

  //modales
  modalEliminoActividad2: any;
  modalEditoActividad: any;

  //modales

  toastAct = false;
  toastVerde = false;
  TextoToastVerde: any;
  toastEliminar = false;
  arrayActividades: any;
  actividadForms: FormGroup;
  actividadEditForms: FormGroup;
  eliminoActividad_actId: any;
  editoActividad_actId: any;

  constructor(
    private actividadservice: ActividadService,
    private itinerarioservice: ItinerarioService,
    private vb: FormBuilder,
  ) {
    this.actividadForms = this.vb.group({
      nombreActividad: ['', Validators.required],
      precioActividad: ['', Validators.required],
      descripcionActividad: ['', Validators.required],
    })
    this.actividadEditForms = this.vb.group({
      nombreActividad: ['', Validators.required],
      precioActividad: ['', Validators.required],
      descripcionActividad: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.modalEliminoActividad2 = new window.bootstrap.Modal(document.getElementById('modalEliminoActividad2'));
    this.modalEditoActividad = new window.bootstrap.Modal(document.getElementById('modalEditoActividad'));
    this.getActividades();
  }


  getActividades() {
    this.actividadservice.actividades().subscribe((listaactividades: any) => {
      this.arrayActividades = listaactividades;
      console.log(this.arrayActividades);
    })
  }

  agregoActividad() {
    this.toastVerde = false;
    console.log(this.actividadForms.value)
    const creoActividad: any = {
      nombreActividad: this.actividadForms.get('nombreActividad')?.value,
      precioActividad: this.actividadForms.get('precioActividad')?.value,
      descripcionActividad: this.actividadForms.get('descripcionActividad')?.value
    }
    console.log(creoActividad);
    this.actividadservice.creoActividad(creoActividad).subscribe((creoActividad: any) => {
      console.log(creoActividad);
      this.TextoToastVerde="Se agrego la actividad correctamente";
      this.toastVerde = true;
      
      this.getActividades();
    })
  }

  eliminoActividad(id: any) {
    this.toastEliminar = false;
    this.toastVerde = false;
    let post = false;
    this.itinerarioservice.itinerarios().subscribe((listaitinerarios: any) => {

      for (let itinerario of listaitinerarios) {
        
        for (let actividades of itinerario.actividades) {
          if (actividades.actividadId == id) {
            this.toastEliminar = true;
            post = true;
            console.log("No se puede eliminar la actividad porque esta asociada a un itinerario");
            break;

          }
        }
      }
      if (post == false) {
        this.actividadservice.eliminoActividad(id).subscribe((eliminoActividad: any) => {
          this.TextoToastVerde="Se eliminó la actividad correctamente";
          this.toastVerde = true;
          this.getActividades();

        });
      }
    });



  }

  //Modales #####################################################################################################################################################

  abroModalEditoAct(actividadId: any) {
    this.modalEditoActividad.show();
    this.editoActividad_actId = actividadId;
    this.posteditoActividad(actividadId);
  }

  abroModalAct(actividadId: any) {
    this.eliminoActividad_actId = actividadId;

    this.modalEliminoActividad2.show();
  }

  //Modales #####################################################################################################################################################


  posteditoActividad(actividadId: any) {

    this.actividadservice.una_actividad(actividadId).subscribe((actividadObj: any) => {
      this.actividadEditForms.patchValue({
        //actividadId: actividadObj.actividadId,
        nombreActividad : actividadObj.nombreActividad,
        precioActividad : actividadObj.precioActividad,
        descripcionActividad: actividadObj.descripcionActividad
      })
      
    })

  }

  editoItinerario() {
    //let actividadId = this.actividadEditForms.get('actividadId')?.value
    //console.log('id edito ' + actividadId);
    const editoActividad: any = {
      nombreActividad: this.actividadEditForms.get('nombreActividad')?.value,
      precioActividad: this.actividadEditForms.get('precioActividad')?.value,
      descripcionActividad: this.actividadEditForms.get('descripcionActividad')?.value,
      
    }
    this.actividadservice.editoActividad(this.editoActividad_actId, editoActividad).subscribe((editoItinerario: any) => {

      this.getActividades();
    });

  }
}
