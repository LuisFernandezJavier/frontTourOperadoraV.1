import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-admi-control',
  templateUrl: './admi-control.component.html',
  styleUrls: ['./admi-control.component.css']
})

export class AdmiControlComponent implements OnInit {
  usuarioObj: any = [];
  itinerarios: any = [];
  importeActividades: number = 0;
  importeItinerarioTotal: number = 0;
  facturacionTotalUsuario: number = 0;
  Highcharts: typeof Highcharts = Highcharts;
  usuarioChart: any
  usuarioChartArray: any = [];

  data: any = [];

  //highcharts
  chartOptions: any = {
    chart: {
      type: 'column',

    },
    xAxis: {
      categories: [],
      crosshair: true
    },
    yAxis: {
      title: {
        text: 'Euros  €'
      }
    },
    title: {
      text: 'FACTURACION'
    },
    subtitle: {
      text: 'VENTAS TOTALES POR CADA USUARIO'
    },
    tooltip: {
      headerFormat: '<span style="font-size:11px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    series: [{
      name: 'Facturacion en €',
      data: []
    }]
  }

  constructor(
    private aRouter: ActivatedRoute,
    private usuarioservice: UsuarioService,
  ) {

  }

  ngOnInit(): void {

    this.getUsuario();

  }

  getUsuario() {
    this.usuarioservice.usuarios().subscribe((objetoUsuario: any) => {
      this.usuarioObj = objetoUsuario
      console.log(this.usuarioObj)
      for (let usuario of this.usuarioObj) {
        this.facturacionTotalUsuario = 0;
        console.log(usuario.nombreUsuario)

        if (usuario.itinerarios != null) {

          for (let itinerario of usuario.itinerarios) {
            this.importeActividades = 0;
            this.importeItinerarioTotal = 0;
            var dia2 = new Date(itinerario.fechaFinal).getTime();
            var dia1 = new Date(itinerario.fechaInicio).getTime();
            let diferencia = Math.abs(dia2 - dia1);
            var dias = diferencia / (1000 * 3600 * 24);

            let importeEstanciaTotal = (dias * itinerario.precioNoche) * itinerario.plazasCompradas;
            console.log(importeEstanciaTotal)

            if (itinerario.actividades != null) {

              for (let actividades of itinerario.actividades) {
                this.importeActividades += actividades.precioActividad;
                // console.log(this.importeActividades);
              }
            }
            this.importeItinerarioTotal = importeEstanciaTotal + (this.importeActividades * itinerario.plazasCompradas);
            // console.log(this.importeItinerarioTotal)
            this.facturacionTotalUsuario += this.importeItinerarioTotal;
            usuario.importeTotal = this.facturacionTotalUsuario;

          }
        }
        if (usuario.importeTotal != null) {
          this.usuarioChart = {
            name: usuario.nombreUsuario,
            importe: usuario.importeTotal,
          }
          this.usuarioChartArray.push(this.usuarioChart);
        }
      }
      console.log(this.usuarioChartArray)
      this.chartOptions.xAxis["categories"] = this.usuarioChartArray.map((x: any) => x.name)
      this.chartOptions.series[0]["data"] = this.usuarioChartArray.map((x: any) => x.importe)
      Highcharts.chart('miGrafico01', this.chartOptions)

    });

  }

}
