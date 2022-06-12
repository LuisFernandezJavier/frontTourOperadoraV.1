import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { faDoorOpen, faPeopleGroup, faUser } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { TokenService } from 'src/app/servicios/token.service';
import { ItinerarioService } from 'src/app/servicios/itinerario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Itinerario } from 'src/app/modelos/itinerario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { CompraService } from 'src/app/servicios/compra.service';
import { ImagenService } from 'src/app/servicios/imagen.service';
import swal from 'sweetalert';
import { ActividadService } from 'src/app/servicios/actividad.service';

declare var window: any;

@Component({
  selector: 'app-itinerario',
  templateUrl: './itinerario.component.html',
  styleUrls: ['./itinerario.component.css']
})
export class ItinerarioComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  //iconos
  usuario = faUser;
  salir = faDoorOpen;
  fapeoplegroup = faPeopleGroup;
  //cierro iconos

  //RELOJ
  private diaArray = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  private fecha = new Date();
  public hora: any;
  public minuto: any;
  public segundos: any;
  public ampm: any;
  public dia: any;
  //FIN RELOJ

  imagenRecibo: any;
  imagenId: any;
  modalCompra: any;
  usuarioenvio: any;
  objetoItinerario: any = [];
  objItinerarioCompra: any;
  objItinerarioToCompra: any
  ID_ItinerarioCompra: any
  mapa!: mapboxgl.Map;
  mapContainer!: HTMLElement;
  inicio = false;
  iniciocontratar = false;
  contratar = false;
  actividadesForms: FormGroup;
  plazasForms: FormGroup;
  actividadesForms1 = new FormControl();
  usuarioObj: any
  TextoPlazas: any
  cordenadas: any;
  cordenadasMapa: [number, number];
  cord0: number;
  cord1: number;


  constructor(
    private tokenservice: TokenService,
    private itinerarioservice: ItinerarioService,
    private usuarioservice: UsuarioService,
    private compraservice: CompraService,
    private actividadservice: ActividadService,
    private imagenservice: ImagenService,
    private router: Router,
    private aRouter: ActivatedRoute,
    private vb: FormBuilder
  ) {
    this.aRouter.params.subscribe(params => {
      console.log(params['_itinerarioId']);
    });

    this.actividadesForms = this.vb.group({
      actividades: ['', Validators.required]
    });

    this.plazasForms = this.vb.group({
      plazasContrato: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFinal: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {

    this.mapContainer = (<HTMLElement>document.getElementById('mapbox'));
    this.mapa = new mapboxgl.Map({
      accessToken: environment.mapboxKEY,
      container: this.mapContainer,
      style: 'mapbox://styles/jluifer361/cl2dpniq5000f14o6swp5qou8',
      center: this.cordenadasMapa,
      zoom: 8,
    });
    // Set marker options.
    const marker = new mapboxgl.Marker({
      color: "rgb(64, 110, 235)",
      draggable: true
    }).setLngLat(this.cordenadasMapa)
      .addTo(this.mapa);

  }
  itinerarioId = this.aRouter.snapshot.paramMap.get('_itinerarioId');
  coordenadas = this.aRouter.snapshot.paramMap.get('_coordenadas')

  ngOnInit(): void {
    this.cordenadas = this.coordenadas.split(',')
    console.log(this.cordenadas[0])
    this.cord0 = parseFloat(this.cordenadas[1]);
    this.cord1 = parseFloat(this.cordenadas[0]);
    this.cordenadasMapa = [this.cord0, this.cord1]
    console.log(this.cordenadasMapa)

    console.log('amano' + this.cordenadasMapa)
    this.modalCompra = new window.bootstrap.Modal(document.getElementById('modalCompra'));

    this.getUnItinerario();
    this.getUsuarioName();
    if (this.tokenservice.getToken()) {
      this.contratar = true;
    } else {
      this.iniciocontratar = true;
    }
    this.inicio = false;
    setInterval(() => {
      const fecha = new Date();
      this.updateFecha(fecha)
    }, 1000); //esto es el intervalo con el que vamos a llamar el metodo update fecha
    this.dia = this.diaArray[this.fecha.getDay()];
  }

  private updateFecha(fecha: Date): void {
    const horas = fecha.getHours();
    this.ampm = horas >= 12 ? 'PM' : 'AM';
    this.hora = horas % 12;
    this.hora = this.hora ? this.hora : 12; //cuando la hora es 00 asigno 12
    this.hora = this.hora < 10 ? '0' + this.hora : this.hora;

    const minutos = fecha.getMinutes();
    this.minuto = minutos < 10 ? '0' + minutos : minutos.toString();

    const segundos = fecha.getSeconds();
    this.segundos = segundos < 10 ? '0' + segundos : segundos.toString();
  }

  getUnItinerario() {
    this.itinerarioservice.unItinerario(this.itinerarioId).subscribe((objetoitinerario: any) => {
      this.objetoItinerario = objetoitinerario

      this.imagenId = this.objetoItinerario.imagen["imagenId"];
      this.imagenservice.getImage(this.imagenId).subscribe((imagen: any) => {
        this.imagenRecibo = 'data:image/jpeg;base64,' + imagen.imagenByte;
      });
    });
  }

  contrato() {

    // creo el itinerario de compra ###################################################
    let plazas = this.plazasForms.get('plazasContrato')?.value;
    console.log('id' + this.objetoItinerario.itinerarioId)
    this.itinerarioservice.unItinerario(this.objetoItinerario.itinerarioId).subscribe((itinerarioObj: any) => {
      console.log('plazas que elijo' + plazas)
      if (itinerarioObj.plazas >= plazas) {
        this.updatePlazas(this.objetoItinerario.itinerarioId);
        const creoItinerario: any = {
          ciudad: this.objetoItinerario.ciudad,
          cordenadasHotel: this.objetoItinerario.cordenadasHotel,
          nombreHotel: this.objetoItinerario.nombreHotel,
          precioNoche: this.objetoItinerario.precioNoche,
          fechaInicio: this.plazasForms.get('fechaInicio')?.value,
          fechaFinal: this.plazasForms.get('fechaFinal')?.value,
          plazasCompradas: plazas,
        }
        //guardo el itinerario de compra en la bd 
        this.compraservice.creoItinerario(creoItinerario).subscribe((objetoitinerario: any) => {
          this.ID_ItinerarioCompra = objetoitinerario.itinerarioId;
          if (this.actividadesForms1.value != null) {    //si no hay actividades se salta el paso de añadirlas
            let actividades: any = this.actividadesForms1.value
            actividades.forEach((element: any) => { //  recorro array de actividades elegidas y añado actividad al itinerarioCompra
              this.compraservice.addActividad(this.ID_ItinerarioCompra, element).subscribe((addActividad: any) => {
              });
            })
          };
          // obtengo el usuario 
          let Nombreusuario = this.tokenservice.getUser();
          this.usuarioservice.getUsuarioName(Nombreusuario).subscribe((objetoUsuario: any) => {
            this.usuarioObj = objetoUsuario
            // asigno itinerario al usuario
            this.usuarioservice.addItinerario(this.ID_ItinerarioCompra, this.usuarioObj.usuarioId).subscribe((
              addItinerario: any) => {
              swal("Correcto", `ITINERARIO ADQUIRIDO`, "success")
              this.router.navigateByUrl('/miPerfil/' + this.usuarioenvio);
            });
          });
        });
      } else {
        swal("Error", `No puede contratar ${plazas} plazas . Hay ${itinerarioObj.plazas} plazas disponibles`, "error")
        this.router.navigate(['/']);
      }
    });
    this.cierroModal();
  }

  abroModal() {
    this.modalCompra.show();
  }

  cierroModal() {
    this.modalCompra.hide();
  }
  getUsuarioName() {
    this.usuarioenvio = this.tokenservice.getUser();
  }
  updatePlazas(itinerarioId: any) {
    let plazas = this.plazasForms.get('plazasContrato')?.value;
    this.itinerarioservice.unItinerario(itinerarioId).subscribe((itinerarioObj: any) => {
      itinerarioObj.plazas = itinerarioObj.plazas - plazas;
      const plazasEnvio = {
        plazas: itinerarioObj.plazas
      }
      this.itinerarioservice.updatePlazas(itinerarioId, plazasEnvio).subscribe((respuesta: any) => { });
    });
  }
}



