import {Injectable} from '@angular/core';
import {Http,Headers} from '@angular/http';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';

@Injectable()
export class PostCashService {

  //private link = "https://abonnement.bbstvnet.com/crmbbs/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://abonnement.bbstvnet.com/crmbbs/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://localhost/backup-sb-admin/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://localhost/backup-sb-admin/new-backend-esquise/index.php";
//  private link = "https://sentool.bbstvnet.com/sslayer/index.php";

  private link = "https://mysentool.pro/index.php";

  private headers=new Headers();
  private token : string = "44387df398822d9f4076a390bf3566eb4c1b10606" ;
  public datas:any;


  constructor(private http:Http) {
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
   }

  public rechargementespece(tel_destinataire : string, montant : string): Promise<any>  {
    var reEspParams = {token:this.token, tel_destinataire: tel_destinataire, montant: montant} ;
    let params="params="+JSON.stringify(reEspParams);
    let link=this.link+"/postcash-sen/rechargementespece";
    return new Promise( (resolve, reject) => {
       this.http.post(link,params,{headers:this.headers}).subscribe(data =>{
           resolve(data);
       });
    });
  }

  public achatcodewoyofal(montant : string, compteur : string):Promise<any>{
    var reEspParams = {token:this.token, montant: montant, compteur: compteur} ;
    let params="params="+JSON.stringify(reEspParams);
    let link=this.link+"/postcash-sen/achatcodewoyofal";
    return new Promise( (resolve, reject) => {
        this.http.post(link,params,{headers:this.headers}).pipe(map(res=>res.json())).subscribe(data=>{
             resolve(data);
          }
        );
    });

  }

  public reglementsenelec(police : string, num_facture : string, montant : any): Promise<any>  {
    var reEspParams = {token:this.token, police: police, num_facture: num_facture,  montant : montant} ;
    let link=this.link+"/postcash-sen/reglementsenelec";
    let params="params="+JSON.stringify(reEspParams);
    return new Promise( (resolve, reject) => {
      this.http.post(link,params,{headers:this.headers}).pipe(map(res =>res.json())).subscribe(data =>{
            resolve(data);
      });
    });
  }

  public detailfacturesenelec(police : string, num_facture : string): Promise<any>  {
    var reEspParams = {token:this.token, police: police, num_facture: num_facture} ;
    let link=this.link+"/postcash-sen/detailfacturesenelec";
    let params="params="+JSON.stringify(reEspParams);
    return new Promise( (resolve, reject) => {
      this.http.post(link,params,{headers:this.headers}).pipe(map(res=>res.json())).subscribe(data =>{
             resolve(data);
             console.log(data);
      });
    });
  }

  public achatjula(mt_carte : string, nb_carte : string): Promise<any>  {
    var reEspParams = {token:this.token, mt_carte: mt_carte, nb_carte: nb_carte} ;
    let link=this.link+"/postcash-sen/achatjula";
    let params="params="+JSON.stringify(reEspParams);
    return new Promise( (resolve, reject) => {
      this.http.post(link,params,{headers:this.headers}).pipe(map(res =>res.json())).subscribe(data =>{
             resolve(data);

      })
    });
  }

  public payeroolusolar(tel_destinataire : string, numcompte : string, montant : string): Promise<any>  {
    var reEspParams = {token:this.token, tel: tel_destinataire, numcompte: numcompte, mtt: montant} ;
     let params="params="+JSON.stringify(reEspParams);
     let link=this.link+"/postcash-sen/oolusolar";
    return new Promise( (resolve, reject) => {
      this.http.post(link,params,{headers:this.headers}).pipe(map(res =>res.json())).subscribe(data =>{
             resolve(data);
             console.log(data);
      });
    });
  }

  public retraitespece(tel_destinataire : string, montant : string): Promise<any>  {
    let links = "http://localhost/kheuteuteupeuseu/index.php";
    var reEspParams = {token:this.token, tel_destinataire: tel_destinataire, montant: montant} ;
    let params="params="+JSON.stringify(reEspParams);
    let link= links+"/postcash-sen/retraitespece";
    return new Promise( (resolve, reject) => {
      this.http.post(link,params,{headers:this.headers}).pipe(map(res =>res.json())).subscribe(data =>{
             console.log(data);
             resolve(data);
      });
    });
  }

  public debitercarte(tel_destinataire : string, montant : string,code : string): Promise<any>  {
    let links = "http://localhost/kheuteuteupeuseu/index.php";
    var reEspParams = {token:this.token, tel_destinataire: tel_destinataire, montant: montant} ;
    let params="params="+JSON.stringify(reEspParams);
    let link= links+"/postcash-sen/debitercarte";
    return new Promise( (resolve, reject) => {
      this.http.post(link,params,{headers:this.headers}).pipe(map(res =>res.json())).subscribe(data =>{
             console.log(data);
             resolve(data);
      });
    });
  }

  public codeValidation(tel_destinataire : string, montant : string): Promise<any>  {
    let links = "http://localhost/kheuteuteupeuseu/index.php";
    var reEspParams = {token:this.token, tel_destinataire: tel_destinataire, montant: montant} ;
    let params="params="+JSON.stringify(reEspParams);
    let link= links+"/postcash-sen/codevalidation";
    return new Promise( (resolve, reject) => {
      this.http.post(link,params,{headers:this.headers}).pipe(map(res =>res.json())).subscribe(data =>{
            console.log(data);
            resolve(data);
      });
    });
  }
  

}
