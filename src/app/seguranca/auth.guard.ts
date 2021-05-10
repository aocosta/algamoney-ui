import { Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

// Uma guarda retorna um valor que controla um comportamento
// Usado para melhorar a usabilidade do sistema
// Se retorna true, a navegação continua
// Se retorna false, para a navegação

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // Teste
    /*
    if (state.url === '/lancamentos/novo') {
      return false;
    }
    */

    // Condição para redirecionar o usuário para a página de login caso seu token e refresh token estiverem inválidos
    if (this.auth.isAccessTokenInvalido()) {
      console.log('Navegação com access token inválido. Obtendo novo token...');

      return this.auth.obterNovoAccessToken()
        .then(() => {
          // Se não conseguiu obter novo token é porque o refresh token também expirou
          if (this.auth.isAccessTokenInvalido()) {
            this.router.navigate(['/login']);
            return false;
          }

          return true;
        });
    }
    // next: próxima rota (para onde a navegação está indo)
    // data: propriedade de route que está dentro do componente RoutingModule de cada módulo
    // roles: propriedade da propriedade data (array de strings com o nome das permissões: ex: ROLE_CADASTRAR_...)
    // Se existe roles e o usuário não tem nenhuma das permissões
    else if (next.data.roles && !this.auth.temQualquerPermissao(next.data.roles)) {
      this.router.navigate(['/nao-autorizado']);
      return false;
    }

    return true;
  }

}
