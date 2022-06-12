import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { faBars, faTrashCan, faPenToSquare, faCheck } from '@fortawesome/free-solid-svg-icons';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { NuevoUsuario } from 'src/app/modelos/nuevoUsuario';
import { AuthService } from 'src/app/servicios/auth.service';
import { TokenService } from 'src/app/servicios/token.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
declare var window: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  page_size: number = 5;
  page_number: number = 1;
  pageSizeOptions = [1, 5, 10, 25, 50];
  //iconos
  fabars = faBars;
  fatrashcan = faTrashCan
  fapentosquare = faPenToSquare
  facheck = faCheck;
  //iconos

  //modlaes
  modalEliminoUsuario: any;
  modalEditoUsuario: any;
  //modales

  nuevoUsuarioForms: FormGroup;
  editoUsuarioForms: FormGroup;
  nuevoUsuario: any;
  errorPass = false;
  arrayUsuarios: any = [];
  eliminoUsuarioId: any;
  editoUsuarioId: any;


  constructor(
    private vb: FormBuilder,
    private authservice: AuthService,
    private usuarioservice: UsuarioService,
    private tokenservice: TokenService

  ) {

    this.nuevoUsuarioForms = this.vb.group({
      nombreUsuario: ['', Validators.required],
      passUsuario: ['', Validators.required],
      passUsuario2: ['', Validators.required],
      emailUsuario: ['', Validators.required],
      role: ['', Validators.required]
    });

    this.editoUsuarioForms = this.vb.group({
      nombreUsuario: ['', Validators.required],
      emailUsuario: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getUsuarios();
    this.modalEliminoUsuario = new window.bootstrap.Modal(document.getElementById('modalEliminoUsuario'));
    this.modalEditoUsuario = new window.bootstrap.Modal(document.getElementById('modalEditoUsuario'));
  }

  handlePage(e: PageEvent) {
    this.page_number = e.pageIndex + 1;
    this.page_size = e.pageSize;
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
        this.window();
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

  eliminoUsuario(usuarioId: any) {
    let usuario = this.tokenservice.getUser();
    this.usuarioservice.getUsuarioName(usuario).subscribe((usuarioObj: any) => {
      if (usuarioObj.usuarioId === usuarioId) { swal("Error", "No se puede eliminar el usuario de la sesion", "error") } else {
        this.usuarioservice.eliminoUsuario(usuarioId).subscribe((response: any) => { this.getUsuarios(); }
          , (error: any) => {
            swal("Error", "Este usuario no se puede eliminar tiene itinerarios asignados", "error")
          });
      }
    });
  }

  posteditoUsuario(usuarioId: any) {
    let rol: any
    this.usuarioservice.unUsuario(usuarioId).subscribe((usuarioObj: any) => {
      if (usuarioObj.roles.length < 2) {
        rol = "user"
      } else {
        rol = "admin"
      }
      this.editoUsuarioForms.patchValue({

        nombreUsuario: usuarioObj.nombreUsuario,
        emailUsuario: usuarioObj.emailUsuario,
        role: rol

      })

    })

  }

  editoUsuario() {
    const editoUsuario: any = {
      nombreUsuario: this.editoUsuarioForms.get('nombreUsuario')?.value,
      emailUsuario: this.editoUsuarioForms.get('emailUsuario')?.value,
      roles: [this.editoUsuarioForms.get('role')?.value]
    }
    let usuario = this.tokenservice.getUser();
    this.usuarioservice.getUsuarioName(usuario).subscribe((usuarioObj: any) => {
      if (usuarioObj.usuarioId === this.editoUsuarioId) { swal("Error", "No se puede editar el usuario de la sesion", "error") } else {
        this.usuarioservice.editoUsuario(this.editoUsuarioId, editoUsuario).subscribe((response: any) => {
          this.getUsuarios();
        }, (error: any) => {
          console.log(error.error)
          swal("Error", `${error.error.mensaje}`, "error")
        });
      }
    });
  }
  //  MODALES ----------------------------------------------------------------------------------------------------------------------
  abroModalEliminoUsu(usuarioId: any) {
    this.eliminoUsuarioId = usuarioId;
    this.modalEliminoUsuario.show();
  }
  abroModalEditarUsu(usuarioId: any) {
    this.posteditoUsuario(usuarioId);
    this.modalEditoUsuario.show();
    this.editoUsuarioId = usuarioId;
  }
  //  MODALES ----------------------------------------------------------------------------------------------------------------------

  window() {
    window.location.reload();
  }
}
