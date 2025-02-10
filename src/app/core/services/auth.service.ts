import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class AuthService {

  private userApiUrl = 'http://192.168.1.57:8082/api';
  private tokenKey = 'authKey';
  private userData = 'userData';

  constructor(
    private httpClient: HttpClient, 
    private router: Router
  ) { }

  login(email: string, password: string): Observable<any> {
    console.log('email:', email);
    console.log('password:', password);
    return this.httpClient.post<any>(`${this.userApiUrl}/auth/login`, { email, password }).pipe(
      tap(response => {
        console.log('Token:', response.token);
        this.setToken(response.token);
      })
    );
  }



  searchByEmail(email: string): Observable<any> {
    console.log('Searching user by email:', email);
    const headers = this.createAuthorizationHeader(); 
    return this.httpClient.post<any>(`${this.userApiUrl}/users/email`, { email }, { headers }).pipe(
      tap(response => {
        console.log('Search response:', response);
        if (response.status === 200) {
          this.setUser(response.data); // Guardamos el objeto 'data' en el almacenamiento local
        }
      })
    );
  }
  
  searchByName(email: string): Observable<any> {
    console.log('Searching user by email:', email);
    const headers = this.createAuthorizationHeader(); 
    return this.httpClient.post<any>(`${this.userApiUrl}/users/search`, { email }, { headers }).pipe(
      tap(response => {
        console.log('Search response:', response);
        if (response.status === 200) {
          this.setUser(response.data); // Guardamos el objeto 'data' en el almacenamiento local
        }
      })
    );
  }

  updateUser(id: string, userData: { 
    name: string; 
    photo: string; 
    address: string; 
    email: string; 
    password: string; 
    rolId: number;
  }): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.httpClient.put<any>(
      `${this.userApiUrl}/users/${id}`,
      userData, { headers }
    ).pipe(
      tap(response => {
        if (response.token) {
        }
      })
    );
  }


  createUser(userData: { 
    name: string; 
    photo: string; 
    address: string; 
    email: string; 
    password: string; 
    rolId: number;
  }): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.httpClient.post<any>(
      `${this.userApiUrl}/users`,
      userData, { headers }
    ).pipe(
      tap(response => {
        if (response.token) {
        }
      })
    );
  }

  getAllUser(): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.httpClient.get<any>(`${this.userApiUrl}/users`, { headers }).pipe(
      tap(response => {
        console.log('Response:', response);
      })
    );
  }

  deleteUser(id: string): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.httpClient.delete<any>(`${this.userApiUrl}/users/${id}`, { headers });
  }
  


  private createAuthorizationHeader(): HttpHeaders {
    const token = this.getToken();
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem(this.tokenKey) : null;
  }

  private setUser(userData: any): void {
    localStorage.setItem(this.userData, JSON.stringify(userData));
  }

  getUserStorage(): any {
    const userData = localStorage.getItem(this.userData);
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }

  getEmailbyToken(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    const email = payload.email
    return email
  }


  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/sign-in']);
  }
}
