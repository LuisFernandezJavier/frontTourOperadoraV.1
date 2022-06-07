import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faBars, faTrashCan, faPenToSquare, faCheck } from '@fortawesome/free-solid-svg-icons';
import { NuevoUsuario } from 'src/app/modelos/nuevoUsuario';
import { AuthService } from 'src/app/servicios/auth.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  page = 5
  //iconos
  fabars = faBars;
  fatrashcan = faTrashCan
  fapentosquare = faPenToSquare
  facheck = faCheck;
  //iconos

  nuevoUsuarioForms: FormGroup;
  nuevoUsuario: any;
  errorPass = false;
  arrayUsuarios: any;


  constructor(
    private vb: FormBuilder,
    private authservice: AuthService,
    private usuarioservice: UsuarioService
  ) {

    this.nuevoUsuarioForms = this.vb.group({
      nombreUsuario: ['', Validators.required],
      passUsuario: ['', Validators.required],
      passUsuario2: ['', Validators.required],
      emailUsuario: ['', Validators.required],
      role: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.getUsuarios();
  }

  creoUsuario() {
    this.errorPass = false;
    let rol = this.nuevoUsuarioForms.get('role')?.value;
    console.log(rol)
    if (this.nuevoUsuarioForms.value.passUsuario === this.nuevoUsuarioForms.value.passUsuario2) {
      if (rol === "user") {
        this.nuevoUsuario = {
          nombreUsuario: this.nuevoUsuarioForms.get('nombreUsuario')?.value,
          passUsuario: this.nuevoUsuarioForms.get('passUsuario')?.value,
          emailUsuario: this.nuevoUsuarioForms.get('emailUsuario')?.value,
          authorities: []
        }
      } else {
        this.nuevoUsuario = {
          nombreUsuario: this.nuevoUsuarioForms.get('nombreUsuario')?.value,
          passUsuario: this.nuevoUsuarioForms.get('passUsuario')?.value,
          emailUsuario: this.nuevoUsuarioForms.get('emailUsuario')?.value,
          roles: ["admin"]
        }

      }

      this.authservice.nuevoUsuario(this.nuevoUsuario).subscribe((response: any) => {




      }, (error: any) => {
        console.log(error.error)
        swal("Error", `${error.error.mensaje}`, "error")

      })

    } else {
      this.errorPass = true;
    }


  }

  getUsuarios() {
    this.usuarioservice.usuarios().subscribe((listaUsuarios: any) => {
      this.arrayUsuarios = listaUsuarios;
      console.log(this.arrayUsuarios);
    })
  }
}
