import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { LogoutService } from './../../seguranca/logout.service';
import { ErrorHandlerService } from './../error-handler.service';
import { AuthService } from './../../seguranca/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  exibindoMenu = false;

  // constructor() { }
  constructor(
    public auth: AuthService,
    private logoutService: LogoutService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  // Método provisório para ser chamado no template para criar novo accesses token
  /*
  criarNovoAccessToken() {
    this.auth.obterNovoAccessToken();
  }
  */

  logout() {
    this.logoutService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
