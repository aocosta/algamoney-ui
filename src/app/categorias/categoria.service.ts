import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from './../../environments/environment';

@Injectable()
export class CategoriaService {

  // categoriasUrl = 'http://localhost:8080/categorias';
  categoriasUrl: string;

  constructor(private http: HttpClient) {
    this.categoriasUrl = `${environment.apiUrl}/categorias`;
  }

  listarTodas(): Promise<any> {
    // const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    // return this.http.get(this.categoriasUrl, { headers })
    return this.http.get(this.categoriasUrl)
      .toPromise();
  }

}
