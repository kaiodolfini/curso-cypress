///<reference types="cypress" />

import loc from '../../support/locators'
import '../../support/commandsContas'

describe('Deve testar o nivel funcional', () => {
    before(()=> {
        cy.login('kaio.com','kaio123')
    })

    beforeEach(() => {
        cy.get(loc.MENU.HOME)
        cy.resetApp()
    })

    after(() => {
        cy.clearLocalStorage()
    })

    it('Deve inserir uma conta', () => {
        cy.acessarMenuConta()
        cy.inserirConta('Conta Teste')
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso!')
       
    })

    it('Deve alterar uma conta', () => {

        cy.acessarMenuConta()
        cy.xpath(loc.CONTAS.FN_XP_BTN_ALTERAR('Conta para alterar')).click()
        cy.get(loc.CONTAS.NOME).clear().type('Conta Atualizada')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso!')
       
    })

    it('Não deve criar conta com mesmo nome', () => {

        cy.acessarMenuConta()
        cy.inserirConta('Conta mesmo nome')
        cy.get(loc.MESSAGE).should('contain', 'code 400')
       
    })

    it('Deve inserir uma movimentacao', () => {

    cy.get(loc.MENU.MOVIMENTACAO).click()
    cy.get(loc.MOVIMENTACAO.DESCRICAO).type('Descricao')
    cy.get(loc.MOVIMENTACAO.VALOR).type('100')
    cy.get(loc.MOVIMENTACAO.INTERESSADO).type('Interessado')
    cy.get(loc.MOVIMENTACAO.STATUS).click()
    cy.get(loc.MOVIMENTACAO.CONTA).select('Conta para movimentacoes')
    cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
    cy.get(loc.MESSAGE).should('contain', 'sucesso')

    cy.get(loc.EXTRATO.LINHAS).should('have.length', 7)
    cy.xpath(loc.EXTRATO.FN_XP_BUSCA_ELEMENTO('Descricao', '100')).should('exist')

    })

    it('Deve consultar o saldo', () => {
        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '534,00')

        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_ALTERAR_ELEMENTO('Movimentacao 1, calculo saldo')).click()
        cy.get(loc.MOVIMENTACAO.DESCRICAO).should('have.value','Movimentacao 1, calculo saldo')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'sucesso')

        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '4.034,00')
    })

    it('Deve remover uma movimentacao', () => {
        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_REMOVER_ELEMENTO('Movimentacao para exclusao')).click()
        cy.get(loc.MESSAGE).should('contain', 'sucesso')
    })


})