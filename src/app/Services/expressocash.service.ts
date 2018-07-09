import {Injectable} from '@angular/core';
import {Http,Headers} from "@angular/http";
import { map, filter, catchError, mergeMap } from 'rxjs/operators';


@Injectable()
export class ExpressocashService {


  //private link = "https://abonnement.bbstvnet.com/crmbbs/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://abonnement.bbstvnet.com/crmbbs/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://localhost/backup-sb-admin/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://localhost/backup-sb-admin/new-backend-esquise/index.php";
//  private link = "https://sentool.bbstvnet.com/sslayer/index.php";

  private link = "https://mysentool.pro/index.php";

  private headers = new Headers();
  private token : "44387df398822d9f4076a390bf3566eb4c1b10606" ;

  constructor(private http:Http) {
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
  }


  public cashin(destination: string, amount: string): Promise<any>  {
    let reEspParams = {token:this.token, destination: "221"+""+destination, amount: amount};
    let url=this.link+"/expressocash-sen/cashin";
    let params="params="+JSON.stringify(reEspParams);
    return new Promise( (resolve, reject) => {
      this.http.post(url,params,{headers:this.headers}).pipe(map(res =>res.json())).subscribe(data =>{
        resolve(data);
      });
    });
  }

  public cashout(customer: string, amount: string): Promise<any>  {
    let reEspParams = {token:this.token, customer: "221"+""+customer, amount: amount};
    let url=this.link+"/expressocash-sen/cashout";
    let params="params="+JSON.stringify(reEspParams);
    return new Promise( (resolve, reject) => {
      this.http.post(url,params,{headers:this.headers}).pipe(map(res =>res.json())).subscribe(data =>{
        resolve(data);
      });
    });
  }

  public confirmCashout(transactionReference: string, OTP: string,montant:number,tel:string): Promise<any>  {
    let reEspParams = {token:this.token,montant:montant,tel:tel, transactionReference: transactionReference, OTP: OTP};
    let url=this.link+"/expressocash-sen/confirmCashout";
    let params="params="+JSON.stringify(reEspParams);
    console.log(params);
    return new Promise( (resolve, reject) => {
      this.http.post(url,params,{headers:this.headers}).pipe(map(res =>res.json())).subscribe(data =>{
        resolve(data);
      });
    });
  }

  public pinCashoutCheck(pin: string): Promise<any>  {
    let reEspParams = {token:this.token, pin: pin};
    let url=this.link+"/expressocash-sen/pinCashoutCheck";
    let params="params="+JSON.stringify(reEspParams);
    return new Promise( (resolve, reject) => {
      this.http.post(url,params,{headers:this.headers}).pipe(map(res =>res.json())).subscribe(data =>{
        resolve(data);
      });
    });
  }

  public pinCashout(pin: string, receiverIDNumber: string,Montant:number,Tel:string): Promise<any>  {
    let reEspParams = {token:this.token, pin: pin, receiverIDNumber: receiverIDNumber,montant:Montant,tel:Tel};
    let url=this.link+"/expressocash-sen/pinCashout";
    let params="params="+JSON.stringify(reEspParams);
    return new Promise( (resolve, reject) => {
      this.http.post(url,params,{headers:this.headers}).pipe(map(res =>res.json())).subscribe(data =>{
          resolve(data);
      });
    });
  }
  public customerRegistration(Msisdn:string,Id:string,Firstname:string,Lastname:string):Promise<any>{
    let reEspParams={token:this.token,msisdn:Msisdn,id:Id,firstname:Firstname,lastname:Lastname};
   // let url=this.link+"/expressocash-sen/customerRegistration";
    let url="http://127.0.0.1/kheuteuteupeuseu/index.php/expressocash-sen/customerRegistration";
    let params="params="+JSON.stringify(reEspParams);
    return new Promise((resolve,reject) =>{
        this.http.post(url,params,{headers:this.headers}).pipe(map(res => res.json())).subscribe(data =>{
           resolve(data);
        });
       
    });
  }


  private envelopeBuilder(requestBody:string):string {
    return '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body>'+requestBody+'</soap:Body></soap:Envelope>' ;
  }


}
