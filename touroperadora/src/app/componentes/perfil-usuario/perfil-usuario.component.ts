import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faCalendar, faFileLines, faLocationDot, faPeopleGroup , } from '@fortawesome/free-solid-svg-icons';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
//iconos
 fapeoplegroup = faPeopleGroup;
 facalendar = faCalendar;
 falocationdot = faLocationDot;
 fafilelines = faFileLines;
//iconos

importeActividad: number = 0 ;
  usuarioObj: any;
  itinerarios:any = [];
  constructor(
    private aRouter: ActivatedRoute,
    private usuarioservice: UsuarioService,
  ) {
    this.aRouter.params.subscribe(params => {
      console.log(params['_nombreUsuario']);
    });
  }
  nombreUsuario = this.aRouter.snapshot.paramMap.get('_nombreUsuario')
  ngOnInit(): void {
    this.getUsuario();
  }

  getUsuario() {
    this.usuarioservice.getUsuarioName(this.nombreUsuario).subscribe((objetoUsuario: any) => {
      this.usuarioObj = objetoUsuario
      for(let itinerario of this.usuarioObj.itinerarios){
        this.importeActividad = 0;
        var dia2 = new Date(itinerario.fechaFinal).getTime();
        var dia1 = new Date(itinerario.fechaInicio).getTime();
        let diferencia = Math.abs(dia2-dia1) ;
        var dias = diferencia /(1000 * 3600 * 24)
        let importeEstancia = dias * itinerario.precioNoche ;
        
          for(let actividad of itinerario.actividades){
            this.importeActividad += actividad.precioActividad ;
            console.log(this.importeActividad)
          }
          itinerario.importeEstancia = importeEstancia;
          itinerario.importeActividad = this.importeActividad
          itinerario.importeTotal = (importeEstancia + this.importeActividad) * itinerario.plazasCompradas
        this.itinerarios.push(itinerario)
      };
      console.log(this.itinerarios)
    })
  }
  crearPdf(importeEstancia: string , importeActividad:any , importeTotal:any , fechaInicio:any , fechaFinal:any  , nombreItinerario:any , plazasCompradas:any ){
    fechaInicio = fechaInicio.slice(0,10);
    fechaFinal = fechaFinal.slice(0,10);
    const objetoPdf : any = {
      content:[
        {
          text: `FACTURA ITINERARIO CANARYTRIP.SL
          
          `,
          style: 'header',
          alignment: 'center'
        },

        {
          
          text: `HOTEL DONDE SE HOSPEDA : ${nombreItinerario}

          FECHA INICIO: ${fechaInicio}     FECHA FIN: ${fechaFinal}     

          NUMERO DE PLAZAS : ${plazasCompradas}
          
         
             
            `},
            
            { text:`DATOS DE FACTURACION
            `, style: 'negrita',},{
             
            table:{
              widths: [200, 200,  ] ,
             
              body:[
                
                [
                  ' Importe estancia',
                  `${importeEstancia} € `,
                  
                ],
                [
                  'Importe actividad',
                  `${importeActividad} € `,
                  
                ],
                [
                  ' Importe total',
                  `${importeTotal} € `,	
                  
                ]
              ]
            }
          
        }
        
      ],	styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'justify'
        },
        negrita: {
          bold:true}
        
        }
    }
    const pdf = pdfMake.createPdf(objetoPdf);
    pdf.open();
  }
}
