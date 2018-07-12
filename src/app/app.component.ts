import { Component ,TemplateRef} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TntService } from 'src/app/Services/tnt.service';
import { PostCashService } from 'src/app/Services/postcash.service';
import { WizallService } from 'src/app/Services/wizall.service';
import { OrangemoneyService } from 'src/app/Services/orangemoney.service';
import { TigocashService } from 'src/app/Services/tigocash.service';
import { ExpressocashService } from 'src/app/Services/expressocash.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

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
  modalRef: BsModalRef;
  montant:any;
  token = "44387df398822d9f4076a390bf3566eb4c1b10606";
  tntloading =false;

  constructor(private modalService: BsModalService, public tntCaller:TntService,private _postCashService: PostCashService, private _tntService:TntService, private _wizallService : WizallService, private _omService:OrangemoneyService, private _tcService: TigocashService, private expressocashwebservice : ExpressocashService) {}
 
  ngOnInit (){
    this.tntloading = undefined;
    this.externalUrl();
  }

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
    this.numero=undefined;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  //------------------- TNT -----------------------

  infoNumeroTnt(){
     console.log(this.numero);
     this.tntloading = true ;
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
 
         this.tntloading = false ;
     }).catch ( () => {
        this.erreur = "votre  connexion  est instable ou numero incorrecte";
        this.tntloading = false;
     });
  }

  validerpaiementTnt(){
      // this.retirerOM();
      //this.cashOutWizall();
      let operateur = this.OrangeMoneyRadio | this.tigocashRadio | this.postcashRadio | this.wizallRadio | this.emoneyRadio;
      
      console.log(operateur);

      switch(operateur){
            case 0:
                this.erreur = "Vous devez choisir un mode paiement";
                break;
          case 1:
                //OM
                this.retirerOM();
                break;

          case 2:
                //TC
                this.retraitTc();
                break;

          case 3:
                //e-m
                // this.faireretraitsimple();
                break;

          case 4:
                //post
                // this.validationretraitespece();
                break;
                
          case 5:
                //wIZALL
                // this.cashOutWizall();
                break;
      }
  }


  tarifTntAbon (){
    var typedebouquet : number ;
    if(this.typeDeBouquet == "Maanaa")
      typedebouquet=1;
    if(this.typeDeBouquet == "Boul khool")
      typedebouquet=2;
    if(this.typeDeBouquet == "Maanaa + Boul khool")
      typedebouquet=3;

    this.tntloading = true ;

    this.tntCaller.getTarifTntAbon({typedemande:'abonne',typedebouquet:typedebouquet,duree:this.nombreDeMois})
    .subscribe(
        data => {
          this.tntloading = false;

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
        error => {
          console.log(error);
          this.erreur = "votre  connexion  est instable";
          this.tntloading = false;
        }
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
            this.erreur = "votre  connexion  est instable";
            this.tntloading = false;
        }

    }).catch(
      () => {
         this.erreur = "votre  connexion  est instable";
         this.tntloading = false;
       }
    );

    this.reinitialiser();
  }


 //---------------------- les retraits   --------------------------

 nbtour:number = 0;
 
 retraitTc(){
  this.nbtour = 0;
  let requete = "2/"+this.numeroassocie+"/"+ this.montant ;

  this.numeroassocie = undefined;
  this.montant  = undefined;
  this.erreur   = undefined;

  console.log(requete);
  this.tntloading = true;
  this._tcService.requerirControllerTC(requete).then( resp => {
    if (resp.status==200){

      console.log("For this 'retrait', we just say : "+resp._body) ;

      if(resp._body.trim()=='0'){
        this.erreur = this.retrieveOperationInfo(3,'0');

      }else
          if(resp._body.match('-12')){
            this.erreur = this.retrieveOperationInfo(3,'-12');
          }
          else
            this._tcService.verifierReponseTC(resp._body.trim().toString()).then(rep =>{
              let donnee=rep._body.trim().toString();
              console.log("Inside verifier retrait: "+donnee) ;
              if(donnee=='1'){
                this.etapetnt=4;
                this.tntloading = false;
                this.reinitialiser ();
              }
              else{
                if(donnee!='-1'){
                  this.erreur = this.retrieveOperationInfo(3,donnee);
                }else{
                  let periodicVerifierTCRetirer = setInterval(()=>{
                    console.log("periodicVerifierTCRetirer : "+this.nbtour) ;
                    this.nbtour = this.nbtour + 1 ;
                    this._tcService.verifierReponseTC(resp._body.trim().toString()).then(rep =>{
                      let donnee=rep._body.trim().toString();
                      console.log("Inside verifier retrait: "+donnee) ;
                      if(donnee=='1'){
                        this.etapetnt=4;
                        this.tntloading = false;
                        this.reinitialiser ();
                         clearInterval(periodicVerifierTCRetirer) ;
                      }
                      else{
                        if(donnee!='-1'){
                          this.erreur = this.retrieveOperationInfo(3,donnee);
                          this.etapetnt=1;
                          this.tntloading = false;
                          clearInterval(periodicVerifierTCRetirer) ;
                        }
                        if(donnee=='-1' && this.nbtour>=100){
                          this._tcService.demanderAnnulationTC(resp._body.trim().toString()).then(rep =>{
                            console.log("demanderAnnulationTC : "+rep._body.trim().toString()) ;
                            let donnee=rep._body.trim().toString();
                            if(donnee=="c"){
                                this.erreur = this.retrieveOperationInfo(3,donnee);
                                this.etapetnt=1;
                                this.tntloading = false;
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
      this.erreur = "Votre connexion est instable";
      this.tntloading = false
    }
  }).catch(
    () => {
       this.erreur = "Votre connexion est instable";
       this.tntloading = false;
     }
  );
}

 retirerOM(){
    console.log("*******************************");
    this.nbtour = 0;
    let requete = "2/"+this.numeroassocie+"/"+ 1;

    this.numeroassocie = undefined;
    this.montant  = undefined;

    console.log(requete);
    this.tntloading =true;
    this.erreur =  undefined;

    this._omService.requerirControllerOM(requete).then( resp => {
      console.log(resp);
      if (resp.status==200){

        console.log("For this 'retrait', we just say : "+resp._body) ;

        if(resp._body.trim()=='0'){
            this.erreur = this.retrieveOperationInfo(2,'0');
            this.tntloading =  false;
        }else
            if(resp._body.match('-12')){
              this.erreur = this.retrieveOperationInfo(2,'-12');
              this.tntloading =  false;
            }
            else
              this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                let donnee=rep._body.trim().toString();
                console.log("Inside verifier retrait: "+donnee) ;
                if(donnee=='1'){
                  this.etapetnt=4;
                  this.tntloading = false;
                  this.reinitialiser ();
                }
                else{
                  if(donnee!='-1'){
                    this.erreur = this.retrieveOperationInfo(2,donnee);
                    this.tntloading =  false;
                  }else{
                      let periodicVerifierOMRetirer = setInterval(()=>{
                        this.nbtour = this.nbtour + 1 ;
                      this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                        let donnee=rep._body.trim().toString();
                        console.log("Inside verifier retrait: "+donnee) ;
                        if(donnee=='1'){
                          this.etapetnt=4;
                          this.tntloading = false;
                          this.reinitialiser ();
                          clearInterval(periodicVerifierOMRetirer) ;
                        }
                        else{
                          if(donnee!='-1'){
                              this.erreur = this.retrieveOperationInfo(2,donnee);
                              this.tntloading =false;   
                              clearInterval(periodicVerifierOMRetirer) ;
                          }
                            if(donnee=='-1' && this.nbtour>=75){
                              this._omService.demanderAnnulationOM(resp._body.trim().toString()).then(rep =>{
                                let donnee=rep._body.trim().toString();
                                if(donnee=="c"){
                                  this.erreur = this.retrieveOperationInfo(2,donnee);
                                  this.tntloading =false;
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
            this.erreur = "votre  connexion  est instable";
            this.tntloading = false;
        }
    }).catch(
        () => {
            this.erreur = "votre  connexion  est instable";
            this.tntloading = false;
          }
    );

}
//---------------  wizall ---------------
cashOutWizall(){
  console.log('cashOutWizall');
  this.tntloading = true;
  this._wizallService.intouchCashout(this.numeroassocie,this.montant).then( response =>{
    console.log("*************************") ;
    if(typeof response !== 'object') {
      this.erreur = "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client."
    }
    else if(response.commission!=undefined){
      this.erreur = undefined;
      this.etapetnt=4;
      this.tntloading = false;
      this.reinitialiser ();
    }
    else{
      this.erreur = "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client."
    }
    this.tntloading = false;
  }).catch(response => {
    this.erreur = response;
    this.tntloading = false;
  });
}

infoRetraitsimple:any;
//--------------e-money--------------------
public faireretraitsimple(){
  this.tntloading = true;
  this.erreur = undefined;

  this.expressocashwebservice.cashout(this.numeroassocie, this.montant).then(expressocashwebserviceList => {
     console.log(expressocashwebserviceList);
    if(!expressocashwebserviceList.match("cURL Error #:")){
      this.infoRetraitsimple = JSON.parse(JSON.parse(expressocashwebserviceList));
      if(this.infoRetraitsimple.status==0){
        this.erreur = undefined;
        this.etapetnt=4;
        this.tntloading = false;
        this.reinitialiser ();
      }
      else{
        this.erreur = "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client."
      }
    }
    else{
      this.erreur = "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client."
    }
    this.tntloading = false;
  }).catch(
    () => {
       this.erreur = "votre  connexion  est instable";
       this.tntloading = false;
     }
  );
}

//--------------PostCash -----------------

validationretraitespece(){
  console.log("validationretraitespeceaveccarte");
  this.erreur =  undefined;
  this.loading = true ;
  this.erreur = false;
  this._postCashService.retraitespece('00221'+this.numeroassocie+'',''+this.montant).then(postcashwebserviceList => {
    this.loading = false ;
    postcashwebserviceList = JSON.parse(postcashwebserviceList) ;
    console.log(postcashwebserviceList);
    if( (typeof postcashwebserviceList.errorCode != "undefined") && postcashwebserviceList.errorCode == "0" && postcashwebserviceList.errorMessage == ""){

    }else{
      this.erreur = postcashwebserviceList.errorMessage;
    }
  }).catch(
     () => {
        this.erreur = "Votre  connexion  est instable";
        this.tntloading = false;
      }
  );
}

externalUrl(){
    let
    url,
    num,
    regexp;

    url =  window.location.href;
    regexp = /[0-9]{9}/gi;

    num = url.match(regexp);

    if(num!=null){
      this.numero = num[0];
      this.infoNumeroTnt();
    }
}

retrieveOperationInfo(operateur,errorCode) : string{

  /* OM */
       if(operateur==2 ){
  
          if (errorCode=='r')
            return "Vous venez d'effectuer la même opèration sur le même numéro." ;
  
          if (errorCode=='c')
            return "Opèration annulée. La requête n'est pas parvenue au serveur. Veuillez recommencer." ;
  
          if (errorCode=='0')
            return "Vous n'êtes pas autorisé à effectuer cette opèration." ;
  
          if (errorCode=='-2')
            return "Vous avez atteint le nombre maximum de transactions par jour en tant que beneficiaire" ;
          if (errorCode=='-3')
            return "Le solde de votre compte ne vous permet pas d'effectuer cette opèration" ;
          if (errorCode=='-4')
            return "Le beneficiaire a atteint le montant maximum autorisé par mois" ;
          if (errorCode=='-5')
            return "Le montant maximum cumulé de transactions par semaine en tant que beneficiaire a ete atteint par le client" ;
          if (errorCode=='-6')
            return "Le destinataire n'est pas un client orangemoney" ;
          if (errorCode=='-7')
            return "Probléme de connexion ou code IHM invalide. Veuillez réessayer!" ;
          if (errorCode=='-8')
            return "Le client a atteint le nombre maximum de transactions par semaine en tant que beneficiaire" ;
          if (errorCode=='-9')
            return "Le client a atteint le nombre maximum de transactions par mois en tant que beneficiaire" ;
  
  //        if (errorCode=='-10')
   //         return "Votre requête n'a pas pu être traitée. Vérifiez la conformité des informations saisies!" ;
  
          if (errorCode=='-12')
            return "Service actuellement indisponible. Veuillez réessayer plus tard." ;
  
          if (errorCode=='-13')
            return "Le code de retrait saisi est incorrect. Veuillez recommencer!" ;
  
         return "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client." ;
      }
  
  /* TC */
       if(operateur==3 ){
  
          if (errorCode=='r')
            return "Vous venez d'effectuer la même opèration sur le même numéro." ;
  
          if (errorCode=='c')
            return "Opèration annulée. La requête n'est pas parvenue au serveur. Veuillez recommencer." ;
  
          if (errorCode=='0')
            return "Vous n'êtes pas autorisé à effectuer cette opèration." ;
  
          if (errorCode=='-2')
            return "Numéro Invalide." ;
          if (errorCode=='-3')
            return "Le compte de l'utilisateur ne dispose pas de permissions suffisantes pour recevoir un dépot." ;
          if (errorCode=='-4')
            return "Le beneficiaire a atteint le montant maximum autorisé par mois" ;
          if (errorCode=='-5')
            return "Le montant maximum cumulé de transactions par semaine en tant que beneficiaire a ete atteint par le client" ;
          if (errorCode=='-6')
            return "Le destinataire n'est pas un client orangemoney" ;
          if (errorCode=='-7')
            return "Probléme de connexion ou code IHM invalide. Veuillez réessayer!" ;
          if (errorCode=='-8')
            return "Vous avez atteint le nombre maximum de transactions par semaine en tant que beneficiaire" ;
          if (errorCode=='-9')
            return "Vous avez atteint le nombre maximum de transactions par mois en tant que beneficiaire" ;
  
  //        if (errorCode=='-10')
   //         return "Votre requête n'a pas pu être traitée. Vérifiez la conformité des informations saisies!" ;
  
          if (errorCode=='-12')
            return "Service actuellement indisponible. Veuillez réessayer plus tard." ;
  
          if (errorCode=='-13')
            return "Le code de retrait saisi est incorrect. Veuillez recommencer!" ;
  
         return "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client." ;
      }
  
  
       if(operateur==4 ){
  
          if (errorCode=='0')
            return "Vous n'êtes pas autorisé à effectuer cette opèration." ;
         return "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client." ;
      }
  
      /* WIZALL */
      if(operateur==6 ){
        if (errorCode=='-12' || errorCode==-12)
          return "Impossible de se connecter au serveur du partenaire. Merci de contacter le service client.";
        else if (errorCode=='-11' || errorCode==-11)
          return "Opèration annulée. La requête n'est pas parvenue au serveur. Merci de contacter le service client." ;
        else if (errorCode=='-1' || errorCode==-1)
          return "Impossible de se connecter au serveur du partenaire. Merci de réessayer plus tard." ;
        else if (errorCode=='500' || errorCode==500)
          return "Une erreur a empêché le traitement de votre requête. Réessayez plus tard ou contactez le service client." ;
        else if (errorCode=='400' || errorCode==400)
          return "Facture dèja payée." ;
        else if (errorCode && (typeof errorCode == 'string'))
          return errorCode;
        return "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client." ;
      }
  
      /* EXPRESSO */
      if(operateur==7 ){
  
        if (errorCode=='-1' || errorCode=='1')
          return "Impossible de se connecter au serveur du partenaire. Merci de réessayer plus tard." ;
        if (errorCode=='2')
          return "Cette requête n'est pas authorisée" ;
        if (errorCode=='51')
          return "Le numéro du destinataire n'est pas authorisé à recevoir de transfert." ;
        if (errorCode=='3')
          return "Numéro de téléphone invalide." ;
        if (errorCode=='2')
          return "Cette requête n'est pas authorisée" ;
        if (errorCode=='7')
          return "Votre compte a été verrouillé, contactez le service client." ;
        if (errorCode=='9')
          return "Votre compte est à l'état inactif." ;
  
        return "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client." ;
      }
  
      /* FACTURIER */
      if(operateur==8 ){
        if (errorCode=='-12' || errorCode==-12)
          return "Impossible de se connecter au serveur du partenaire. Merci de contacter le service client.";
        else if (errorCode=='-11' || errorCode==-11)
          return "Opèration annulée. La requête n'est pas parvenue au serveur. Merci de contacter le service client." ;
        else if (errorCode=='-1' || errorCode==-1)
          return "Impossible de se connecter au serveur du partenaire. Merci de réessayer plus tard." ;
        else if (errorCode && (typeof errorCode == 'string')) return errorCode;
        return "Votre requête n'a pas pu être traitée correctement. Merci de contacter le service client." ;
      }
  
  
    }
  
    orangeNumberTest(numb:string){
        let  re= new RegExp("^7[7-8]{1}[0-9]{1}[0-9]{1}[0-9]{1}[0-9]{1}[0-9]{1}[0-9]{1}[0-9]{1}$");
        return re.test(numb);
    }

    tigoNumberTest (numb:string){
        let  re= new RegExp("^76[0-9]{1}[0-9]{1}[0-9]{1}[0-9]{1}[0-9]{1}[0-9]{1}[0-9]{1}$");
        return re.test(numb);
    }

    expressoNumberTest (numb:string){
      let  re= new RegExp("^70[0-9]{1}[0-9]{1}[0-9]{1}[0-9]{1}[0-9]{1}[0-9]{1}[0-9]{1}$");
      return re.test(numb);
    }
    numberTest (numb:string){
      let  re= new RegExp("^7[0768]{1}[0-9]{1}[0-9]{1}[0-9]{1}[0-9]{1}[0-9]{1}[0-9]{1}[0-9]{1}$");
      return re.test(numb);
    }
}
