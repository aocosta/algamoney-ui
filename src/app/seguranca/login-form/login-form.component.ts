import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ErrorHandlerService } from './../../core/error-handler.service';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {

  constructor(
    public auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) { }

  login(usuario: string, senha: string) {
    // this.auth.login(usuario, senha);
    this.auth.login(usuario, senha)
      .then(() => {
        this.router.navigate(['/lancamentos']);
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
      });
  }

}
