///<reference types="cypress" />

describe('Esperas...', () => {

    before(()=> {
        cy.visit('https://wcaquino.me/cypress/componentes.html')
    })

    beforeEach(()=> {
        cy.reload()
    })

    it('Deve aguardar elemento estar disponivel', ()=>{
        cy.get('#novoCampo').should('not.exist')
        cy.get('#buttonDelay').click()
        cy.get('#novoCampo').should('not.exist')
        cy.get('#novoCampo').should('exist')
        cy.get('#novoCampo').type('funciona')
    })

    it('Deve fazer retrys', ()=>{
        cy.get('#buttonDelay').click()
        cy.get('#novoCampo')
            .should('exist')
            .type('funciona')
    })

    it('Uso do find', ()=> {
        cy.get('#buttonList').click()
        cy.get('#lista li')
            .find('span')
            .should('contain', 'Item 1')
        cy.get('#lista li span')
            .should('contain', 'Item 2')
    })

    it('Uso do timeout', ()=> {

    //  ESPERA NÃO FIXA
    //  cy.get('#buttonDelay').click()
    //  cy.get('#novoCampo', {timeout: 3000}).should('exist')

    //  ESPERA FIXA
    // cy.get('#buttonListDOM').click()
    // cy.wait(5000)
    // cy.get('#lista li span')
    //     .should('contain', 'Item 2')

    cy.get('#buttonListDOM').click()
    cy.get('#lista li span')
        .should('have.length', 1)
    cy.get('#lista li span')
        .should('have.length', 2)

    })

    it('Click retry',()=>{
        cy.get('#buttonCount')
            .click()
            .should('have.value', '1')

    })

    it.only('Should vs Then',()=>{
        cy.get('#buttonListDOM').click()
        cy.get('#lista li span').then($el => {
            expect($el).to.have.length(1)
        })
    })

})
