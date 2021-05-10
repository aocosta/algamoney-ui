import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { MessageService } from 'primeng/api';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { CategoriaService } from './../../categorias/categoria.service';
import { PessoaService } from './../../pessoas/pessoa.service';
import { Lancamento } from './../../core/model';
import { LancamentoService } from './../lancamento.service';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' },
  ];


  /*
  categorias = [
    { label: 'Alimentação', value: 1 },
    { label: 'Transporte', value: 2 },
  ];
  */
  categorias = [];

  /*
  pessoas = [
    { label: 'João da Silva', value: 4 },
    { label: 'Sebastião Souza', value: 9 },
    { label: 'Maria Abadia', value: 3 },
  ];
  */
  pessoas = [];

  lancamento = new Lancamento();

  constructor(
    private categoriaService: CategoriaService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) {}

  ngOnInit() {
    // Obtem o código do lançamento passado por parâmetro na chamada da página de cadastro (caso tenha sido passado)
    // console.log(this.route.snapshot.params['codigo']);
    const codigoLancamento = this.route.snapshot.params['codigo'];

    this.title.setTitle('Novo lançamento');

    if (codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
    }

    this.carregarCategorias();
    this.carregarPessoas();
  }

  // Método usado no template para alterar o título da página
  get editando() {
    return Boolean(this.lancamento.codigo);
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo)
      .then(lancamento => {
        this.lancamento = lancamento;
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  /*
  salvar(form: FormControl) {
    console.log(this.lancamento);
  }
  */
  /*
  salvar(form: FormControl) {
    this.lancamentoService.adicionar(this.lancamento)
      .then(() => {
        this.messageService.add({ severity: 'success', detail: 'Lançamento adicionado com sucesso!' });

        form.reset();
        this.lancamento = new Lancamento();
      })
      .catch(erro => this.errorHandler.handle(erro));
  */
  /*
  salvar(form: FormControl) {
    if (this.editando) {
      this.atualizarLancamento(form);
    } else {
      this.adicionarLancamento(form);
    }
  }
  */

  /* Por causa de problema no meu angular tive que tirar a tipagem do argumento */
  salvar(form) {
    if (this.editando) {
      this.atualizarLancamento(form);
    } else {
      this.adicionarLancamento(form);
    }
  }

  adicionarLancamento(form: FormControl) {
    this.lancamentoService.adicionar(this.lancamento)
      // .then(() => {
      .then(lancamentoAdicionado => {
        this.messageService.add({ severity: 'success', detail: 'Lançamento adicionado com sucesso!' });

        // form.reset();
        // this.lancamento = new Lancamento();
        // this.router.navigate(['/lancamentos']);
        this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarLancamento(form: FormControl) {
    this.lancamentoService.atualizar(this.lancamento)
      .then(lancamento => {
        this.lancamento = lancamento;

        this.messageService.add({ severity: 'success', detail: 'Lançamento alterado com sucesso!' });
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarCategorias() {
    return this.categoriaService.listarTodas()
      .then(categorias => {
        // this.categorias = categorias.map(c => { return { label: c.nome, value: c.codigo } });
        this.categorias = categorias.map(c => ({ label: c.nome, value: c.codigo }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarPessoas() {
    return this.pessoaService.listarTodas()
      .then(pessoas => {
        this.pessoas = pessoas.map(p => ({ label: p.nome, value: p.codigo }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  /*
  novo(form: FormControl) {
    form.reset();

    // Código para contornar um bug do angular
    setTimeout(function() {
      this.lancamento = new Lancamento();
    }.bind(this), 1);

    this.router.navigate(['/lancamentos/novo']);
  }
  */

  /* Por causa de problema no meu angular tive que tirar a tipagem do argumento */
  novo(form) {
    form.reset();

    // Código para contornar um bug do angular
    setTimeout(function() {
      this.lancamento = new Lancamento();
    }.bind(this), 1);

    this.router.navigate(['/lancamentos/novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de lançamento: ${this.lancamento.descricao}`);
  }

}
