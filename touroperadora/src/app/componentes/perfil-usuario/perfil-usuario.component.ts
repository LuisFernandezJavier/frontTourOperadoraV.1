import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {

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
        this.itinerarios.push(itinerario)
      };
    })
  }
}
