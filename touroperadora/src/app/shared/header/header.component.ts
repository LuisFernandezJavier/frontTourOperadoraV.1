import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { faBorderAll, faDoorOpen, faUser } from '@fortawesome/free-solid-svg-icons';
import { NgbRefDirective } from '@ng-bootstrap/ng-bootstrap/accordion/accordion';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { TokenService } from 'src/app/servicios/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  //iconos
  usuario = faUser;
  salir = faDoorOpen;
  control = faBorderAll
  admin = false;

  //RELOJ
  private diaArray = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  private fecha = new Date();
  public hora: any;
  public minuto: any;
  public segundos: any;
  public ampm: any;
  public dia: any;
  //FIN RELOJ

  isLogged = false;
  iniciar = true ;
  inicio = false;

  nombreUsuario:any;
  constructor(
    private tokenservice: TokenService,
    private router: Router,
  
    
  ) { }

  ngOnInit(): void {
    if (this.tokenservice.getAuthorities().includes('ROLE_ADMIN')) {
        console.log("es admin")
        this.admin = true;

    }else {
      console.log(" no es admin")
    }

    if (this.tokenservice.getToken()) {
      this.getUsuarioName();
      this.isLogged = true;
      this.iniciar = false;
    } else {
      this.isLogged = false;
      this.iniciar = true;
    }

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

  getUsuarioName(){
    this.nombreUsuario = this.tokenservice.getUser();
  }

  cerrarSesion(): void {
    this.tokenservice.logout();
    this.router.navigateByUrl('')
    
   
  }
}
