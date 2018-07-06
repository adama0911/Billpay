import { Component ,TemplateRef} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  etapetnt=1;
  numero:any;
  nom:any;
  prenom:any;
  tel:any;
  numeroChip:any;
  numeroCarte:any;
  nombreDeMois:any;
  typeDeBouquet:any;
  numeroassocie:any;
  OrangeMoneyRadio:any;
  tigocashRadio:any;
  emoneyRadio:any;
  postcashRadio:any;
  wizallRadio:any;

  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) {}
 
  reinitialiser (){
    this.numero=undefined;
    this.nom=undefined;
    this.prenom=undefined;
    this.tel=undefined;
    this.numeroChip=undefined;
    this.numeroCarte=undefined;
    this.nombreDeMois=undefined;
    this.typeDeBouquet=undefined;
    this.numeroassocie=undefined;
    this.OrangeMoneyRadio=undefined;
    this.tigocashRadio=undefined;
    this.emoneyRadio=undefined;
    this.postcashRadio=undefined;
    this.wizallRadio=undefined;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  infoNumeroTnt(){
     console.log(this.numero);
     this.etapetnt=2;
  }

  validerpaiementTnt(){
    this.reinitialiser();
  }
}
