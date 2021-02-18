///<reference types="cypress" />

describe('Deve testar o backend', () => {

    //let token
    const dayjs = require('dayjs')
    const todaysDate = dayjs().format('DD/MM/YYYY')

    before(() => {
        cy.getToken('kaio.com', 'kaio123')
            // .then(tkn => {
            //     token = tkn
            // })
    })

    beforeEach(() => {
        cy.resetRest()
    })

    it('Deve inserir uma conta', () => {
        cy.request({
            method: 'POST',
            // headers: { Authorization: `JWT ${token}` },
            url: '/contas',
            body: {
                nome: 'Conta via rest'
            }
        }).as('response')

        cy.get('@response').then(res => {
            expect(res.status).to.be.equal(201)
            expect(res.body).to.have.property('id')
            expect(res.body).to.have.property('nome', 'Conta via rest')
        })
    })

    it('Deve alterar uma conta', () => {
        cy.getContaByName('Conta para alterar')
            .then(contaId => {
                cy.request({
                    method: 'PUT',
                    // headers: { Authorization: `JWT ${token}` },
                    url: `/contas/${contaId}`,
                    body: {
                        nome: 'Conta alterada via rest'
                    }
                }).as('response')

            })

        cy.get('@response').its('status').should('be.equal', 200)

    })

    it('Não deve criar conta com mesmo nome', () => {
        cy.request({
            method: 'POST',
            // headers: { Authorization: `JWT ${token}` },
            url: '/contas',
            body: {
                nome: 'Conta mesmo nome'
            },
            failOnStatusCode: false
        }).as('response')

        cy.get('@response').then(res => {
            expect(res.status).to.be.equal(400)
            expect(res.body).to.have.property('error', 'Já existe uma conta com esse nome!')
        })
    })

    it('Deve inserir uma movimentacao', () => {
        cy.getContaByName('Conta para movimentacoes')
            .then(contaId => {
                cy.request({
                    method: 'POST',
                    url: '/transacoes',
                    // headers: { Authorization: `JWT ${token}` },
                    body: {
                        conta_id: contaId,
                        data_pagamento: todaysDate,
                        data_transacao: todaysDate,
                        descricao: 'Descricao',
                        envolvido: 'Interessado',
                        status: true,
                        tipo: 'REC',
                        valor: '100',
                    }
                }).as('response')
            })
        cy.get('@response').its('status').should('be.equal', 201)
        cy.get('@response').its('body.id').should('exist')
    })

    it('Deve consultar o saldo', () => {
        cy.request({
            method: 'GET',
            // headers: { Authorization: `JWT ${token}` },
            url: '/saldo',
        }).then(res => {
            let saldoConta = null
            res.body.forEach(c => {
                if (c.conta == 'Conta para saldo') saldoConta = c.saldo
            })
            expect(saldoConta).to.be.equal('534.00')
        })

        cy.request({
            method: 'GET',
            url: '/transacoes',
            // headers: { Authorization: `JWT ${token}` },
            qs: { descricao: 'Movimentacao 1, calculo saldo' }
        }).then(res => {
            cy.request({
                url: `/transacoes/${res.body[0].id}`,
                method: 'PUT',
                // headers: { Authorization: `JWT ${token}` },
                body: {
                    status: true,
                    data_transacao: dayjs(res.body[0].data_transacao).format('DD/MM/YYYY'),
                    data_pagamento: dayjs(res.body[0].data_pagamento).format('DD/MM/YYYY'),
                    descricao: res.body[0].descricao,
                    envolvido: res.body[0].envolvido,
                    valor: res.body[0].valor,
                    conta_id: res.body[0].conta_id
                }
            }).its('status').should('be.equal', 200)
        })

        cy.request({
            method: 'GET',
            // headers: { Authorization: `JWT ${token}` },
            url: '/saldo',
        }).then(res => {
            let saldoConta = null
            res.body.forEach(c => {
                if (c.conta == 'Conta para saldo') saldoConta = c.saldo
            })
            expect(saldoConta).to.be.equal('4034.00')
        })

    })


    it('Deve remover uma movimentacao', () => {
        cy.request({
            method: 'GET',
            url: '/transacoes',
            // headers: { Authorization: `JWT ${token}` },
            qs: { descricao: 'Movimentacao para exclusao' }
        }).then(res => {
            cy.request({
                method: 'DELETE',
                url: `/transacoes/${res.body[0].id}`,
                // headers: { Authorization: `JWT ${token}` },
            }).its('status').should('be.equal', 204)
        })
    })
}) 