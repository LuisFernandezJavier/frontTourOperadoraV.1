import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TokenService } from "../servicios/token.service";

@Injectable({
    providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{

    constructor(private tokenservice : TokenService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let interceptadaReq = req;
        const token = this.tokenservice.getToken();
        if (token != null) {
            interceptadaReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
        }
        return next.handle(interceptadaReq);
    }
} 

export const interceptorProvider = [{provide: HTTP_INTERCEPTORS, useClass : InterceptorService, multi : true}];