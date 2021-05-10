import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../../environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class LogoutService {

  // tokensRevokeUrl = 'http://localhost:8080/tokens/revoke';
  tokensRevokeUrl: string;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {
      this.tokensRevokeUrl = `${environment.apiUrl}/tokens/revoke`;
  }

  logout() {
    return this.http.delete(this.tokensRevokeUrl, { withCredentials: true })
      .toPromise()
      .then(() => {
        this.auth.limparAccessToken();
      });
  }

}
