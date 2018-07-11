import { Component ,TemplateRef} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TntService } from 'src/app/Services/tnt.service';
import { PostCashService } from 'src/app/Services/postcash.service';
import { WizallService } from 'src/app/Services/wizall.service';
import { OrangemoneyService } from 'src/app/Services/orangemoney.service';
import { TigocashService } from 'src/app/Services/tigocash.service';
import { ExpressocashService } from 'src/app/Services/expressocash.service';

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
  cni:any;
  singleTntWS:any;
  loading=false;
  erreur:any;
  success:any;
  modalRef: BsModalRef;
  montant:any;
  token = "44387df398822d9f4076a390bf3566eb4c1b10606";

  constructor(private modalService: BsModalService, public tntCaller:TntService,private _postCashService: PostCashService, private _tntService:TntService, private _wizallService : WizallService, private _omService:OrangemoneyService, private _tcService: TigocashService, private expressocashwebservice : ExpressocashService) {}
 
  reinitialiser (){
    this.montant=undefined;
    this.cni=undefined;
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

  //------------------- TNT -----------------------

  infoNumeroTnt(){
     console.log(this.numero);
     this.loading = true ;
     this.erreur = false ;
     this.tntCaller.checkNumber(this.token, this.numero.toString()).then( response => {
         this.singleTntWS = response ;
         console.log(this.singleTntWS);
         this.nom = this.singleTntWS.nom ;
         this.prenom = this.singleTntWS.prenom ;
         this.tel = Number(this.singleTntWS.tel);
         this.numeroChip = Number(this.singleTntWS.n_chip) ;
         this.numeroCarte = Number(this.singleTntWS.n_carte) ;
         this.cni = this.singleTntWS.cni;
 
         if (this.singleTntWS.id_typeabonnement=="1")
           this.singleTntWS = "Maanaa";
         if (this.singleTntWS.id_typeabonnement=="2")
           this.singleTntWS = "Boul Khool";
         if (this.singleTntWS.id_typeabonnement=="3")
           this.singleTntWS = "Maanaa + Boul Khool";
 
         this.etapetnt=2;
 
         this.loading = false ;
     });
  }

  validerpaiementTnt(){
      this.retirerOM();
      //this.cashOutWizall();
      //let operateur = this.OrangeMoneyRadio || this.tigocashRadio || this.postcashRadio || this.wizallRadio || this.emoneyRadio;
      
      // console.log(operateur);

      // switch(operateur){
      //     case 1:
      //           //OM
      //           this.retirerOM();
      //           break;

      //     case 2:
      //           break;

      //     case 3:
      //           //e-m
      //           break;

      //     case 4:
      //           //post
      //           break;
                
      //     case 5:
      //           //wIZALL
      //           break;
      // }
  }


  tarifTntAbon (){
    var typedebouquet : number ;
    if(this.typeDeBouquet == "Maanaa")
      typedebouquet=1;
    if(this.typeDeBouquet == "Boul khool")
      typedebouquet=2;
    if(this.typeDeBouquet == "Maanaa + Boul khool")
      typedebouquet=3;

    this.loading = true ;
    this.erreur = false ;

    this.tntCaller.getTarifTntAbon({typedemande:'abonne',typedebouquet:typedebouquet,duree:this.nombreDeMois})
    .subscribe(
        data => {
          this.loading = false;

          this.etapetnt=3;
          console.log(data);
          if(data.errorCode){
            typedebouquet = data.message.typedebouquetLetter;
            this.montant = data.message.montant
          }
          else{
            typedebouquet = data.errorMessage;
          }
        },
        error => console.log(error)
    );
  }

  validnabon(){
    var typedebouquet : number ;
    if(this.typeDeBouquet == "Maanaa")
      typedebouquet=1;
    if(this.typeDeBouquet == "Boul khool")
      typedebouquet=2;
    if(this.typeDeBouquet == "Maanaa + Boul khool")
      typedebouquet=3;

    this.loading = true ;
    this.erreur = false ;

    this.tntCaller.abonner(this.token, this.prenom,this.nom, this.tel,this.cni, this.numeroChip, this.numeroCarte, this.nombreDeMois, this.typeDeBouquet).then( response =>
      {
        this.loading = false;
        let montant:number = 0;
        let typedebouquet = "" ;

        if(response != undefined){
            response = JSON.parse(response) ;
            if(response.response=="ok"){
    
            }else{
              //  this..etat=true;
              //  this..load='terminated';
              //  this..color='red';
              //  this..errorCode='0';
          }
        }
        else{
            console.log("variable de retoure 'response' indefinie !");
        }

    });

    this.reinitialiser();
  }


 //---------------------- les retraits   --------------------------

 nbtour:number = 0;
 
 retraitTc(){
  let requete = "2/"+this.numeroassocie+"/"+ this.montant ;
  console.log(requete);
  this.loading = true;
  this._tcService.requerirControllerTC(requete).then( resp => {
    if (resp.status==200){

      console.log("For this 'retrait', we just say : "+resp._body) ;

      if(resp._body.trim()=='0'){
        this.erreur = "Erreur lors de l'operationde de retrait";
        this.success = undefined;
        this.loading = false;
      }else
          if(resp._body.match('-12')){
            this.erreur = "Erreur lors de l'operationde de retrait";
            this.success = undefined;
            this.loading = false;
          }
          else
            this._tcService.verifierReponseTC(resp._body.trim().toString()).then(rep =>{
              let donnee=rep._body.trim().toString();
              console.log("Inside verifier retrait: "+donnee) ;
              if(donnee=='1'){
                  this.success = "operation réussi !";
                  this.erreur = undefined;
                  this.loading = false;
              }
              else{
                if(donnee!='-1'){
                    this.erreur = "Erreur lors de l'operationde de retrait";
                    this.success = undefined;
                    this.loading = false;
                }else{
                  let periodicVerifierTCRetirer = setInterval(()=>{
                    console.log("periodicVerifierTCRetirer : "+this.nbtour) ;
                    this.nbtour = this.nbtour + 1 ;
                    this._tcService.verifierReponseTC(resp._body.trim().toString()).then(rep =>{
                      let donnee=rep._body.trim().toString();
                      console.log("Inside verifier retrait: "+donnee) ;
                      if(donnee=='1'){
                        this.success = "operation réussi !";
                        this.erreur = undefined;
                        this.loading = false;
                         clearInterval(periodicVerifierTCRetirer) ;
                      }
                      else{
                        if(donnee!='-1'){
                          this.erreur = "Erreur lors de l'operationde de retrait";
                          this.success = undefined;
                          this.loading = false;
                          clearInterval(periodicVerifierTCRetirer) ;
                        }
                        if(donnee=='-1' && this.nbtour>=100){
                          this._tcService.demanderAnnulationTC(resp._body.trim().toString()).then(rep =>{
                            console.log("demanderAnnulationTC : "+rep._body.trim().toString()) ;
                            let donnee=rep._body.trim().toString();
                            if(donnee=="c"){
                                this.erreur = "Erreur lors de l'operationde de retrait";
                                this.success = undefined;
                                this.loading = false;
                              clearInterval(periodicVerifierTCRetirer) ;
                            }
                          }) ;
                        }
                      }
                    });
                  },2000);
                }
              }
            });
    }
    else{
      console.log("error") ;

      }
  });
}

 retirerOM(){
  console.log("*******************************")
 let requete = "2/"+this.numeroassocie+"/"+ 2;
 console.log(requete);
 this.loading = true ;
 this.erreur = false ;

 this._omService.requerirControllerOM(requete).then( resp => {
   console.log(resp);
   if (resp.status==200){

     console.log("For this 'retrait', we just say : "+resp._body) ;

     if(resp._body.trim()=='0'){
          this.erreur = "Erreur lors de l'operationde de retrait";
          this.success = undefined;
     }else
         if(resp._body.match('-12')){
            this.erreur = "Erreur lors de l'operationde de retrait";
            this.success = undefined;
         }
         else
           this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
             let donnee=rep._body.trim().toString();
             console.log("Inside verifier retrait: "+donnee) ;
             if(donnee=='1'){
                this.erreur = undefined;
                this.success = "operation réussi !";
             }
             else{
               if(donnee!='-1'){
                  this.erreur = "Erreur lors de l'operationde de retrait";
                  this.success = undefined;
               }else{
                   let periodicVerifierOMRetirer = setInterval(()=>{
                     this.nbtour = this.nbtour + 1 ;
                   this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                     let donnee=rep._body.trim().toString();
                     console.log("Inside verifier retrait: "+donnee) ;
                     if(donnee=='1'){
                            this.success = "operation réussi !";
                            this.erreur = undefined;
                     }
                     else{
                       if(donnee!='-1'){
                            this.erreur = "Erreur lors de l'operationde de retrait";
                            this.success = undefined;
                            this.loading = false;
                            clearInterval(periodicVerifierOMRetirer) ;
                       }
                         if(donnee=='-1' && this.nbtour>=75){
                           this._omService.demanderAnnulationOM(resp._body.trim().toString()).then(rep =>{
                             let donnee=rep._body.trim().toString();
                              if(donnee=="c"){
                                this.erreur = "Erreur lors de l'operationde de retrait";
                                this.success = undefined;
                                this.loading = false;
                                clearInterval(periodicVerifierOMRetirer) ;
                              }
                           });
                         }
                     }
                   });
                   },2000);
               }
             }
           });
   }
   else{
     console.log("error") ;
     }
 });

}
//---------------  wizall ---------------
cashOutWizall(){
  console.log('cashOutWizall');
  this._wizallService.intouchCashout(this.numeroassocie,this.montant).then( response =>{
    console.log("*************************") ;
    if(typeof response !== 'object') {
      this.erreur = "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client."
      this.success = undefined;
    }
    else if(response.commission!=undefined){
      this.erreur = undefined;
      this.success = 'operation reussi avec success !';
    }
    else{
      this.erreur = "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client."
      this.success = undefined;
    }
  }).catch(response => {
    this.erreur = response;
    this.success = undefined;
  });
}

infoRetraitsimple:any;
//--------------e-money--------------------
public faireretraitsimple(){
  this.expressocashwebservice.cashout(this.numeroassocie, this.montant).then(expressocashwebserviceList => {
     console.log(expressocashwebserviceList);
    if(!expressocashwebserviceList.match("cURL Error #:")){
      this.infoRetraitsimple = JSON.parse(JSON.parse(expressocashwebserviceList));
      if(this.infoRetraitsimple.status==0){
        this.erreur = undefined;
        this.success = 'operation reussi avec success !';
      }
      else{
        this.erreur = "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client."
        this.success = undefined;
      }
    }
    else{
      this.erreur = "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client."
      this.success = undefined;
    }
  });
}

}
