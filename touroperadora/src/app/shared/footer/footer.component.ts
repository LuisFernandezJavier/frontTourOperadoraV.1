import { Component, OnInit } from '@angular/core';
import { faLocationDot, faPhone, faEnvelope, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

    //iconos
    falocationdot = faLocationDot;
    faphone = faPhone;
    faenvelope = faEnvelope;
    faquestions = faQuestionCircle;
    //cierro iconos

  constructor() { }

  ngOnInit(): void {
  }

}
