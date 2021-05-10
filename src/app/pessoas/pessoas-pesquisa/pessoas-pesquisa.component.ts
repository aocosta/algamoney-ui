import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { LazyLoadEvent, MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { PessoaService, PessoaFiltro } from './../pessoa.service';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})

/*
export class PessoasPesquisaComponent {

  pessoas = [
    { nome: 'Manoel Pinheiro', cidade: 'Uberlândia', estado: 'MG', ativo: true },
    { nome: 'Sebastião da Silva', cidade: 'São Paulo', estado: 'SP', ativo: false },
    { nome: 'Carla Souza', cidade: 'Florianópolis', estado: 'SC', ativo: true },
    { nome: 'Luís Pereira', cidade: 'Curitiba', estado: 'PR', ativo: true },
    { nome: 'Vilmar Andrade', cidade: 'Rio de Janeiro', estado: 'RJ', ativo: false },
    { nome: 'Paula Maria', cidade: 'Uberlândia', estado: 'MG', ativo: true }
  ];

}
*/

export class PessoasPesquisaComponent implements OnInit {

  totalRegistros = 0;

  filtro = new PessoaFiltro();

  pessoas = [];
  @ViewChild('tabela') grid: Table;

  constructor(
    private pessoaService: PessoaService,
    private confirmation: ConfirmationService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Pesquisa de pessoas');
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.pessoaService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.pessoas = resultado.pessoas;
      });
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(pessoa: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(pessoa);
      }
    });
  }

  excluir(pessoa: any) {
    this.pessoaService.excluir(pessoa.codigo)
      .then(() => {
        if (this.grid.first === 0) {
          this.pesquisar();
        } else {
          this.grid.reset();
        }

        this.messageService.add({ severity: 'success', detail: 'Lançamento excluído com sucesso!' });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  alternarStatus(pessoa: any): void {
    const novoStatus = !pessoa.ativo;

    this.pessoaService.mudarStatus(pessoa.codigo, novoStatus)
      .then(() => {
        const acao = novoStatus ? 'ativada' : 'desativada';

        pessoa.ativo = novoStatus;
        this.messageService.add({ severity: 'success', detail: `Pessoa ${acao} com sucesso!` });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
