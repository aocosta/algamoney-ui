import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // oauthTokenUrl = 'http://localhost:8080/oauth/token';
  oauthTokenUrl: string;

  jwtPayload: any;    // propriedade que vai armazenar o token decodificado

  // constructor(private http: HttpClient) { }
  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    this.oauthTokenUrl = `${environment.apiUrl}/oauth/token`;
    this.carregarToken();
  }

  login(usuario: string, senha: string): Promise<void> {
    // Cria o header da requisição
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA=='); // angular:@ngul@r0: ClientID da aplicação angular em base 64

    // Cria o body da requisição
    const body = `username=${usuario}&password=${senha}&grant_type=password`;

    // Faz a requisição para o back-end
    // withCredentials: true
    //    - parâmetro necessário devido a referência cruzada (origem da requisição diferente do local do backend)
    //      para que o cookie com o refresh token não seja ignorado pelo navegador
    // return this.http.post(this.oauthTokenUrl, body, { headers })
    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
      .toPromise()
      .then(response => {
        // console.log(response);
        this.armazenarToken(response['access_token']);

        // Armazena automaticamente o Cookie com o refresh token no navegador
      })
      /*
      .catch(response => {
        console.log(response);
      });
      */
      .catch(response => {
        if (response.status === 400) {
          if (response.error.error === 'invalid_grant') {
            return Promise.reject('Usuário ou senha inválida!');
          }
        }

        return Promise.reject(response);
      });
  }

  obterNovoAccessToken(): Promise<void> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');

    const body = 'grant_type=refresh_token';

    // Navegador inclui automáticamente o cookie com o refresh token na requisição
    // withCredentials: true
    //    - parâmetro necessário devido a referência cruzada (origem da requisição diferente do local do backend)
    //      para que o cookie com o refresh token não seja ignorado pelo navegador
    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
      .toPromise()
      .then(response => {
        this.armazenarToken(response['access_token']);

        // Armazena automaticamente o Cookie com o refresh token no navegador

        console.log('Novo access token criado!');

        return Promise.resolve(null);
      })
      .catch(response => {
        console.error('Erro ao renovar token.', response);
        return Promise.resolve(null);
      });
  }

  limparAccessToken() {
    localStorage.removeItem('token');
    this.jwtPayload = null;
  }

  // Método utilizado no componente money-http-interceptor.ts, que intercepta as requisições http
  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');

    // Retorna false se não existir um token ou se ele já estiver expirado
    return !token || this.jwtHelper.isTokenExpired(token);
  }

  temPermissao(permissao: string) {
    // O atributo authorities é um array com as permissões do usuário
    // Só pegar o token e decodificar no site https://jwt.io/ que ele mostra todos os atributos do token
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }

  temQualquerPermissao(roles) {
    for (const role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }

    return false;
  }

  private armazenarToken(token: string) {
    // Decodifica o token
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    // Armazena o token no Local Storage do navegador (propriedade implícita) com o nome token
    localStorage.setItem('token', token);
  }

  private carregarToken() {
    const token = localStorage.getItem('token');

    if (token) {
      this.armazenarToken(token);
    }
  }
}
