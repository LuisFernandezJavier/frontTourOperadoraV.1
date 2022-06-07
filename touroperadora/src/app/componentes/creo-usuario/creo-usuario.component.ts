import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NuevoUsuario } from 'src/app/modelos/nuevoUsuario';
import { AuthService } from 'src/app/servicios/auth.service';
@Component({
  selector: 'app-creo-usuario',
  templateUrl: './creo-usuario.component.html',
  styleUrls: ['./creo-usuario.component.css']
})
export class CreoUsuarioComponent implements OnInit {
  
  registroForms: FormGroup;
  errorPass  = false ;
  constructor(
    private vb: FormBuilder,
    private router: Router,
    private authservice: AuthService,

  ) {
    this.registroForms = this.vb.group({
      nombreUsuario: ['', Validators.required],
      passUsuario: ['', Validators.required],
      passUsuario2: ['', Validators.required],
      emailUsuario: ['', Validators.required],
    });
  }


  ngOnInit(): void {
  }

  registroUsuario() {
    this.errorPass = false;
    if (this.registroForms.value.passUsuario === this.registroForms.value.passUsuario2) {

      const nuevoUsuario  = {
        nombreUsuario : this.registroForms.get('nombreUsuario')?.value,
        passUsuario: this.registroForms.get('passUsuario')?.value,
        emailUsuario: this.registroForms.get('emailUsuario')?.value,
        authorities : []
      } 
    let usuario = new NuevoUsuario(nuevoUsuario.nombreUsuario,  nuevoUsuario.emailUsuario,nuevoUsuario.passUsuario, nuevoUsuario.authorities);
    console.log(usuario)
      this.authservice.nuevoUsuario (usuario).subscribe((response :any) =>{

        
        this.router.navigateByUrl('/');

      } , (error :any) =>{
        console.log(error.error)
        swal ("Error" ,`${error.error.mensaje}` , "error")
        
      })
    } else {
      this.errorPass = true;
    }
  }

}
