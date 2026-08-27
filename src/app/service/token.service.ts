import { Injectable } from '@angular/core';

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUsername';
const AUTHORITIES_KEY = 'AuthAuthorities';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  roles: Array<string> = [];
  constructor() { }

  public setToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY) || '';
  }

  public setUserName(userName: string): void {
    window.sessionStorage.removeItem(USERNAME_KEY);
    window.sessionStorage.setItem(USERNAME_KEY, userName);
  }

  public getUserName(): string {
    return sessionStorage.getItem(USERNAME_KEY) || '';
  }

  public setAuthorities(authorities: any[]): void {
    window.sessionStorage.removeItem(AUTHORITIES_KEY);
    if (authorities) {
      window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
    }
  }

  public getAuthorities(): string[] {
    this.roles = [];
    const authStored = sessionStorage.getItem(AUTHORITIES_KEY);
    if (authStored) {
      try {
        const parsed = JSON.parse(authStored);
        if (Array.isArray(parsed)) {
          parsed.forEach((authority: any) => {
            if (typeof authority === 'string') {
              this.roles.push(authority);
            } else if (authority && authority.authority) {
              this.roles.push(authority.authority);
            }
          });
        }
      } catch (e) {
        console.error('Error al parsear authorities', e);
      }
    }
    return this.roles;
  }

  public logOut(): void {
    window.sessionStorage.clear();
  }
}
