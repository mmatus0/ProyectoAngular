import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FaqService {

  private http = inject(HttpClient);
  private url  = 'http://localhost:3000/api/faq';

  private headers() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getFaqs() {
    return this.http.get<any>(this.url, this.headers());
  }
}