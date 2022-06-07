import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from 'express';
import { Observable } from 'rxjs';

const TOKEN_KEY = 'AuthToken';

const USER_KEY = 'AuthUser';

const AUTHORITIES_KEY = 'AuthAuthorities' ;
@Injectable({
    providedIn: 'root'
})
export class TokenService {
    roles: Array<string> = [];

    constructor() { }

    //TOKEN
    public setToken(token: string): void {
        window.sessionStorage.removeItem(TOKEN_KEY);
        window.sessionStorage.setItem(TOKEN_KEY, token);
    }

    public getToken(): string | null {
        return sessionStorage.getItem(TOKEN_KEY);
    }

    // NOMBRE USUARIO
    public setUser(userName: string): void {
        window.sessionStorage.removeItem(USER_KEY);
        window.sessionStorage.setItem(USER_KEY, userName);
    }

    public getUser(): string  {
        return sessionStorage.getItem(USER_KEY)!;
    }

    // AUTHORITIES
    public getAuthorities(): string[]  {
        this.roles = [];
        if (sessionStorage.getItem(AUTHORITIES_KEY)) {
            JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY)!).forEach((authority: { authority: string; }) => {
                this.roles.push(authority.authority);
            });
        }
        return this.roles;
    }

    public setAuthorities(authorities: string[]): void {
        {
            window.sessionStorage.getItem(AUTHORITIES_KEY);
            window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
        }

    }
// ELIMINO TODO
    public logout(): void {
        window.sessionStorage.clear();
        

    }
}