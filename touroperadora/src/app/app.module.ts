import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './componentes/home/home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ItinerarioComponent } from './componentes/itinerario/itinerario.component';
import { HeaderComponent } from './shared/header/header.component';
import { CreoUsuarioComponent } from './componentes/creo-usuario/creo-usuario.component';
import { LoginComponent } from './shared/login/login.component';
import { CreoItinerarioComponent } from './componentes/creo-itinerario/creo-itinerario.component';
import { CreoActividadComponent } from './componentes/creo-actividad/creo-actividad.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//      ANGULAR MATERIAL ----------------------------------------------------------------------------------------------------------
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';

//      ANGULAR MATERIAL ----------------------------------------------------------------------------------------------------------

//highcharts
import { ChartModule } from 'angular-highcharts';

import { HighchartsChartModule } from 'highcharts-angular';



import { PerfilUsuarioComponent } from './componentes/perfil-usuario/perfil-usuario.component';
import { interceptorProvider } from './interceptors/interceptor.service';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';

import { PaginatePipe } from './pipes/paginate.pipe';
import { CustomMatPaginatorIntl } from './componentes/paginator-es';
import { FooterComponent } from './shared/footer/footer.component';
import { AdmiControlComponent } from './componentes/admi-control/admi-control.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ItinerarioComponent,
    HeaderComponent,
    CreoUsuarioComponent,
    LoginComponent,
    CreoItinerarioComponent,
    CreoActividadComponent,
    PerfilUsuarioComponent,
    UsuariosComponent,
    PaginatePipe,
    FooterComponent,
    AdmiControlComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatCardModule,
    MatMenuModule,
    MatPaginatorModule,
    ChartModule,
    HighchartsChartModule



  ],
  providers: [
    interceptorProvider,
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
