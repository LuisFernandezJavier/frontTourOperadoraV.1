import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginUsuario } from 'src/app/modelos/login';
import { AuthService } from 'src/app/servicios/auth.service';
import { TokenService } from 'src/app/servicios/token.service';
declare var window: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  modalLogin: any;
  loginForms: FormGroup;

  error: boolean = false;
  logeado = false;
  falloLogin = false;
  loginusuario!: LoginUsuario;
  roles!: string[];

  constructor(
    private vb: FormBuilder,
    private router: Router,
    private aRouter: ActivatedRoute,
    private authservice: AuthService,
    private tokenservice: TokenService,
  ) {
    

    this.loginForms = this.vb.group({
      nombreUsuario: ['', Validators.required],
      passUsuario: ['', Validators.required],
    })
  }

  ngOnInit(): void {

    

    this.modalLogin = new window.bootstrap.Modal(document.getElementById('modalInicio'));
    if (this.tokenservice.getToken()) {
      this.logeado = true;
      this.falloLogin = false;
      this.roles = this.tokenservice.getAuthorities();
    }
    this.abroModal();
  }

  onLogin(): void {
    this.loginusuario = new LoginUsuario(this.loginForms.get('nombreUsuario')?.value, this.loginForms.get('passUsuario')?.value);
    this.authservice.login(this.loginusuario).subscribe(data => {
      this.logeado = true;
      this.falloLogin = false;
      this.tokenservice.setToken(data.token);
      this.tokenservice.setUser(data.nombreUsuario);
      this.tokenservice.setAuthorities(data.authorities);
      this.roles = data.authorities;
      console.log("los roles:" + this.roles);
      console.log(data.authorities);
      console.log(data.token);
      console.log(data.nombreUsuario);
      //this.router.navigateByUrl('/itinerario/1');


      setTimeout(() => {
        location.reload();

      }, 900)


    }, (error: any) => {
      this.logeado = false;
      this.falloLogin = true;
      this.error = true;
    })
  }


  abroModal() {
    this.modalLogin.show();
  }
  cierroModal() {
    this.modalLogin.hide();
  }
  window() {
    location.reload()
  }
}

