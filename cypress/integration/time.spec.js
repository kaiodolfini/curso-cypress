///<reference types="cypress" />

describe('Dynamic test', () => {
    beforeEach(()=> {
        cy.visit('https://wcaquino.me/cypress/componentes.html')
    })

    it('Voltando ao passado', () => {
        // cy.get('#buttonNow').click()
        // cy.get('#resultado > span').should('contain', '04/01/2021')
        
        // cy.clock()
        // cy.get('#buttonNow').click()
        // cy.get('#resultado > span').should('contain', '31/12/1969')

        const dt = new Date(2012, 3, 10, 15, 23, 50)
        cy.clock(dt.getTime())
        cy.get('#buttonNow').click()
        cy.get('#resultado > span').should('contain', '10/04/2012')
    })

    it('Vai para o futuro', () => {
        cy.get('#buttonTimePassed').click()
        cy.get('#resultado > span').invoke('text').should('gt', '1334082230000')

        cy.clock()
        cy.get('#buttonTimePassed').click()
        cy.get('#resultado > span').invoke('text').should('lte', '0')
        cy.wait(1000)
        cy.get('#resultado > span').invoke('text').should('l    te', '1000')

        cy.tick(5000)
        cy.get('#buttonTimePassed').click()
        cy.get('#resultado > span').invoke('text').should('gte', '5000')
    })

})