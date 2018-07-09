import { Injectable }    from '@angular/core';
import {Http, Headers} from "@angular/http";
import { map, filter, catchError, mergeMap } from 'rxjs/operators';

@Injectable()
export class OrangemoneyService {

  //private link = "https://abonnement.bbstvnet.com/crmbbs/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://abonnement.bbstvnet.com/crmbbs/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://localhost/backup-sb-admin/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://localhost/backup-sb-admin/new-backend-esquise/index.php";
//  private link = "https://sentool.bbstvnet.com/sslayer/index.php";

  private link = "https://mysentool.pro/index.php";

  private headers=new Headers();
  private token : "4e903c83bedf44f1c4662e1f65cc5e6fdc1d5b52a" ;
  public datas:any;


  constructor(private http:Http) {
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
  }

  public requerirControllerOM(requete:any): Promise<any>{
    let params="requestParam="+JSON.stringify({requestParam : requete, tokenParam : this.token});
    let link=this.link+"/om-sen/requerirControllerOM";
    return this.http.post(link,params,{headers:this.headers}).toPromise().then( res => { console.log(res);return res} ).catch(error => {return 'bad' });
  }

  public verifierReponseOM(requete:any): Promise<any>{
    let params="requestParam="+JSON.stringify({requestParam : requete, tokenParam : this.token, cacheDisabler : Date.now()});
    
    let link=this.link+"/om-sen/verifierReponseOM";
    return this.http.post(link,params,{headers:this.headers}).toPromise().then( res => {return res} ).catch(error => {return 'bad' });
  }

  public demanderAnnulationOM(requete:any): Promise<any>{
    let params="requestParam="+JSON.stringify({requestParam : requete, tokenParam : this.token});
    let link=this.link+"/om-sen/demanderAnnulationOM";
    return this.http.post(link,params,{headers:this.headers}).toPromise().then( res => {return res} ).catch(error => {return 'bad' });
  }

  public isDepotCheckAuthorized(): Promise<any>{
    let params="requestParam="+JSON.stringify({token : this.token});
    let link=this.link+"/om-sen/isDepotCheckAuthorized";
    return this.http.post(link,params,{headers:this.headers}).toPromise().then( res => {return res} ).catch(error => {return 'bad' });
  }


}
