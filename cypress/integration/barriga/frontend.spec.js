///<reference types="cypress" />

import loc from '../../support/locators'
import '../../support/commandsContas'
import buildEnv from '../../support/buildEnv'

describe('Deve testar o nivel funcional', () => {

    beforeEach(() => {
        buildEnv()
        cy.login('kaio.com', 'kaio123 errado')
        cy.get(loc.MENU.HOME)
        cy.resetApp()
    })

    after(() => {
        cy.clearLocalStorage()
    })

    it('Deve inserir uma conta', () => {

        cy.intercept('POST', '/contas', {
            statusCode: 200,
            body: {
                id: 3,
                nome: 'Conta Teste',
                visivel: true,
                usuario_id: 1
            }
        }).as('saveConta')

        cy.acessarMenuConta()

        cy.intercept('GET', '/contas', {
            statusCode: 200,
            body: [{
                id: 1,
                nome: 'Carteira',
                visivel: true,
                usuario_id: 1
            },
            {
                id: 2,
                nome: 'Banco',
                visivel: true,
                usuario_id: 1
            },
            {
                id: 3,
                nome: 'Conta Teste',
                visivel: true,
                usuario_id: 1
            }]
        }).as('contaSave')



        cy.inserirConta('Conta Teste')
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso!')

    })

    it('Deve alterar uma conta', () => {

        cy.intercept('PUT', '/contas/**', {
            statusCode: 200,
            body: {
                id: 1,
                nome: 'Conta Alterada',
                visivel: true,
                usuario_id: 1
            }
        }).as('alterarConta')

        cy.acessarMenuConta()
        cy.xpath(loc.CONTAS.FN_XP_BTN_ALTERAR('Carteira')).click()
        cy.get(loc.CONTAS.NOME).clear().type('Conta Atualizada')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso!')

    })

    it('Não deve criar conta com mesmo nome', () => {

        cy.intercept('POST', '/contas', {
            statusCode: 400,
            body: {
                error: 'Já existe uma conta com esse nome!'
            }
        }).as('contaMesmoNome')
        cy.acessarMenuConta()
        cy.inserirConta('Conta mesmo nome')
        cy.get(loc.MESSAGE).should('contain', 'code 400')

    })

    it('Deve inserir uma movimentacao', () => {

        cy.intercept('POST', '/transacoes', {
            statusCode: 200,
            body: [
                {"conta":"Conta para extrato","id":337719,"descricao":"Descricao","envolvido":"FFF","observacao":null,"tipo":"DESP","data_transacao":"2021-01-08T03:00:00.000Z","data_pagamento":"2021-01-08T03:00:00.000Z","valor":"100.00","status":true,"conta_id":369949,"usuario_id":12862,"transferencia_id":null,"parcelamento_id":null}]
        }).as('transacoes')

        cy.intercept('GET', '/extrato/**', {
            statusCode: 200,
            body:'fixture:movimentacaoSalva'            
        }).as('extrato')

        cy.get(loc.MENU.MOVIMENTACAO).click()

        cy.get(loc.MOVIMENTACAO.DESCRICAO).type('Descricao')
        cy.get(loc.MOVIMENTACAO.VALOR).type('100')
        cy.get(loc.MOVIMENTACAO.INTERESSADO).type('Interessado')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.CONTA).select('Banco')
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'sucesso')
        cy.get(loc.EXTRATO.LINHAS).should('have.length', 5)
        cy.xpath(loc.EXTRATO.FN_XP_BUSCA_ELEMENTO('Descricao', '100')).should('exist')

    })

    it('Deve consultar o saldo', () => {

        cy.intercept('GET', '/transacoes/**' , {
            statusCode: 200,
            body: {
                "conta": "Conta para saldo",
                "id": 337716,
                "descricao": "Movimentacao 1, calculo saldo",
                "envolvido": "CCC",
                "observacao": null,
                "tipo": "REC",
                "data_transacao": "2021-01-08T03:00:00.000Z",
                "data_pagamento": "2021-01-08T03:00:00.000Z",
                "valor": "3500.00",
                "status": false,
                "conta_id": 369948,
                "usuario_id": 12862,
                "transferencia_id": null,
                "parcelamento_id": null
            }
        })

        cy.intercept('PUT', '/transacoes/**' , {
            statusCode: 200,
            body: {
                "conta": "Conta para saldo",
                "id": 337716,
                "descricao": "Movimentacao 1, calculo saldo",
                "envolvido": "CCC",
                "observacao": null,
                "tipo": "REC",
                "data_transacao": "2021-01-08T03:00:00.000Z",
                "data_pagamento": "2021-01-08T03:00:00.000Z",
                "valor": "4034.00",
                "status": false,
                "conta_id": 369948,
                "usuario_id": 12862,
                "transferencia_id": null,
                "parcelamento_id": null
            }
        })

        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Carteira')).should('contain', '120,00')

        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_ALTERAR_ELEMENTO('Movimentacao 1, calculo saldo')).click()
        cy.get(loc.MOVIMENTACAO.DESCRICAO).should('have.value', 'Movimentacao 1, calculo saldo')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'sucesso')

        cy.intercept('GET', '/saldo', {
            statusCode: 200,
            body: [{
                conta_id: 1000,
                conta: 'Carteira',
                saldo: '4034.00'
            },
            {
                conta_id: 1001,
                conta: 'Banco',
                saldo: '120000.00'
            }]
        }).as('saldo')

        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Carteira')).should('contain', '4.034,00')
    })

    it('Deve remover uma movimentacao', () => {

        cy.intercept('DELETE', '/transacoes/**', {
            statusCode: 204,
            body: {}
        }).as('delete')
        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_REMOVER_ELEMENTO('Movimentacao para exclusao')).click()
        cy.get(loc.MESSAGE).should('contain', 'sucesso')
    })
   
    it('Deve validar os dados para inserir uma conta', () => {

        cy.intercept('POST', '/contas', {
            statusCode: 200,
            body: {
                id: 3,
                nome: 'Conta Teste',
                visivel: true,
                usuario_id: 1
            }
        }).as('saveConta')

        cy.acessarMenuConta()

        cy.intercept('GET', '/contas', {
            statusCode: 200,
            body: [{
                id: 1,
                nome: 'Carteira',
                visivel: true,
                usuario_id: 1
            },
            {
                id: 2,
                nome: 'Banco',
                visivel: true,
                usuario_id: 1
            },
            {
                id: 3,
                nome: 'Conta Teste',
                visivel: true,
                usuario_id: 1
            }]
        }).as('contaSave')



        cy.inserirConta('{CONTROL}')
        //cy.wait('@saveConta').its('request.body.nome').should('not.be.empty')
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso!')

    })

    it('Deve testar as cores', () => {

        cy.intercept('GET', '/extrato/**', {

            statusCode: 200,
            body: [
                {"conta":"Conta com movimentacao","id":337715,"descricao":"Receita paga","envolvido":"BBB","observacao":null,"tipo":"REC","data_transacao":"2021-01-08T03:00:00.000Z","data_pagamento":"2021-01-08T03:00:00.000Z","valor":"-1500.00","status":true,"conta_id":369947,"usuario_id":12862,"transferencia_id":null,"parcelamento_id":null},
                {"conta":"Conta para saldo","id":337716,"descricao":"Receita pendente, calculo saldo","envolvido":"CCC","observacao":null,"tipo":"REC","data_transacao":"2021-01-08T03:00:00.000Z","data_pagamento":"2021-01-08T03:00:00.000Z","valor":"3500.00","status":false,"conta_id":369948,"usuario_id":12862,"transferencia_id":null,"parcelamento_id":null},
                {"conta":"Conta para saldo","id":337717,"descricao":"Despesa Paga, calculo saldo","envolvido":"DDD","observacao":null,"tipo":"DESP","data_transacao":"2021-01-08T03:00:00.000Z","data_pagamento":"2021-01-08T03:00:00.000Z","valor":"-1000.00","status":true,"conta_id":369948,"usuario_id":12862,"transferencia_id":null,"parcelamento_id":null},
                {"conta":"Conta para saldo","id":337718,"descricao":"Despesa pendente, calculo saldo","envolvido":"EEE","observacao":null,"tipo":"DESP","data_transacao":"2021-01-08T03:00:00.000Z","data_pagamento":"2021-01-08T03:00:00.000Z","valor":"1534.00","status":false,"conta_id":369948,"usuario_id":12862,"transferencia_id":null,"parcelamento_id":null}]
        }).as('extrato')

        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Receita paga')).should('have.class', 'receitaPaga')
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Receita pendente')).should('have.class', 'receitaPendente')
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Despesa paga')).should('have.class', 'despesaPaga')
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Desoesa pendente')).should('have.class', 'despesaPendente')

    
    })

    it('Deve testar responsividade', () => {
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.visible')
        cy.viewport(500, 700)
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.not.visible')
        cy.viewport('iphone-5')
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.not.visible')
        cy.viewport('ipad-2')
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.visible')
    })

})