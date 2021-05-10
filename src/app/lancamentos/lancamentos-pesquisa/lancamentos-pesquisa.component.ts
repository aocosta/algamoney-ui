import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { LazyLoadEvent, MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { LancamentoService, LancamentoFiltro } from './../lancamento.service';
import { AuthService } from './../../seguranca/auth.service';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
/*
export class LancamentosPesquisaComponent {
  lancamentos = [
    { tipo: 'DESPESA', descricao: 'Compra de pão', dataVencimento: new Date(2017, 5, 30),
      dataPagamento: null, valor: 4.55, pessoa: 'Padaria do José' },
    { tipo: 'RECEITA', descricao: 'Venda de software', dataVencimento: new Date(2017, 5, 10),
      dataPagamento: new Date(2017, 5, 30), valor: 80000, pessoa: 'Atacado Brasil' },
    { tipo: 'DESPESA', descricao: 'Impostos', dataVencimento: new Date(2017, 6, 20),
      dataPagamento: null, valor: 14312, pessoa: 'Ministério da Fazenda' },
    { tipo: 'DESPESA', descricao: 'Mensalidade de escola', dataVencimento: new Date(2017, 5, 5),
      dataPagamento: new Date(2017, 4, 30), valor: 800, pessoa: 'Escola Abelha Rainha' },
    { tipo: 'RECEITA', descricao: 'Venda de carro', dataVencimento: new Date(2017, 7, 18),
      dataPagamento: null, valor: 55000, pessoa: 'Sebastião Souza' },
    { tipo: 'DESPESA', descricao: 'Aluguel', dataVencimento: new Date(2017, 6, 10),
      dataPagamento: new Date(2017, 6, 9), valor: 1750, pessoa: 'Casa Nova Imóveis' },
    { tipo: 'DESPESA', descricao: 'Mensalidade musculação', dataVencimento: new Date(2017, 6, 13),
      dataPagamento: null, valor: 180, pessoa: 'Academia Top' }
  ];
}
*/

export class LancamentosPesquisaComponent implements OnInit {

  totalRegistros = 0;

  /*
  descricao: string;
  dataVencimentoInicio: Date;
  dataVencimentoFim: Date;
  */
  filtro = new LancamentoFiltro();

  lancamentos = [];
  @ViewChild('tabela') grid: Table;

  constructor(
    private lancamentoService: LancamentoService,
    public auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private title: Title
  ) {}

  ngOnInit() {
    // this.pesquisar();

    this.title.setTitle('Pesquisa de lançamentos');
  }

  /*
  pesquisar() {
    // this.lancamentoService.pesquisar().then(() => null);
    // this.lancamentoService.pesquisar().then(lancamentos => this.lancamentos = lancamentos);
    this.lancamentoService.pesquisar({ descricao: this.descricao }).then(lancamentos => this.lancamentos = lancamentos);
  }
  */

  /*
  pesquisar() {

    const filtro: LancamentoFiltro = {
      descricao: this.descricao,
      dataVencimentoInicio: this.dataVencimentoInicio,
      dataVencimentoFim: this.dataVencimentoFim
    };

    this.lancamentoService.pesquisar(filtro).then(lancamentos => this.lancamentos = lancamentos);
  }
  */

  /*
  pesquisar() {
    this.lancamentoService.pesquisar(this.filtro).then(resultado => {this.lancamentos = resultado.lancamentos;});
  }
  */

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.lancamentoService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.lancamentos = resultado.lancamentos;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    // console.log(event);
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(lancamento: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(lancamento);
      }
    });
  }

  /*
  excluir(lancamento: any) {
    this.lancamentoService.excluir(lancamento.codigo)
      .then(() => {
        this.grid.reset();
      });
  }
  */
  excluir(lancamento: any) {
    this.lancamentoService.excluir(lancamento.codigo)
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

}
