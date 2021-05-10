import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputMaskModule } from 'primeng/inputmask';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { SharedModule } from './../shared/shared.module';
// import { PessoasGridComponent } from './pessoas-grid/pessoas-grid.component';
import { PessoasPesquisaComponent } from './pessoas-pesquisa/pessoas-pesquisa.component';
import { PessoaCadastroComponent } from './pessoa-cadastro/pessoa-cadastro.component';
import { PessoasRoutingModule } from './pessoas-routing.module';

@NgModule({
  declarations: [
    // PessoasGridComponent,
    PessoasPesquisaComponent,
    PessoaCadastroComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    TableModule,
    TooltipModule,
    InputMaskModule,
    InputTextModule,
    ButtonModule,

    SharedModule,
    PessoasRoutingModule
  ],
  exports: [
    // Necessário apenas quando as páginas estavam sendo chamadas direto dentro do app.component.html
    /*
    PessoasPesquisaComponent,
    PessoaCadastroComponent
    */
  ]
})
export class PessoasModule { }
