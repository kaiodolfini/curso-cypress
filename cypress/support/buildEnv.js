const buildEnv = () => {
    cy.intercept('POST', '/signin', {
        statusCode: 200,
        body: {
            id: 1000,
            nome: 'nome user',
            token: 'string mto grande'
        }
    }).as('signin')

    cy.intercept('GET', '/saldo', {
        statusCode: 200,
        body: [{
            conta_id: 1000,
            conta: 'Carteira',
            saldo: '120.00'
        },
        {
            conta_id: 1001,
            conta: 'Banco',
            saldo: '120000.00'
        }]
    }).as('saldo')

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
        }]
    }).as('contas')

    cy.intercept('GET', '/extrato/**', {
        statusCode: 200,
        body: [
            {"conta":"Conta com movimentacao","id":337715,"descricao":"Movimentacao de conta","envolvido":"BBB","observacao":null,"tipo":"DESP","data_transacao":"2021-01-08T03:00:00.000Z","data_pagamento":"2021-01-08T03:00:00.000Z","valor":"-1500.00","status":true,"conta_id":369947,"usuario_id":12862,"transferencia_id":null,"parcelamento_id":null},
            {"conta":"Conta para saldo","id":337716,"descricao":"Movimentacao 1, calculo saldo","envolvido":"CCC","observacao":null,"tipo":"REC","data_transacao":"2021-01-08T03:00:00.000Z","data_pagamento":"2021-01-08T03:00:00.000Z","valor":"3500.00","status":false,"conta_id":369948,"usuario_id":12862,"transferencia_id":null,"parcelamento_id":null},
            {"conta":"Conta para saldo","id":337717,"descricao":"Movimentacao 2, calculo saldo","envolvido":"DDD","observacao":null,"tipo":"DESP","data_transacao":"2021-01-08T03:00:00.000Z","data_pagamento":"2021-01-08T03:00:00.000Z","valor":"-1000.00","status":true,"conta_id":369948,"usuario_id":12862,"transferencia_id":null,"parcelamento_id":null},
            {"conta":"Conta para saldo","id":337718,"descricao":"Movimentacao 3, calculo saldo","envolvido":"EEE","observacao":null,"tipo":"REC","data_transacao":"2021-01-08T03:00:00.000Z","data_pagamento":"2021-01-08T03:00:00.000Z","valor":"1534.00","status":true,"conta_id":369948,"usuario_id":12862,"transferencia_id":null,"parcelamento_id":null},
            {"conta":"Conta para extrato","id":337719,"descricao":"Movimentacao para extrato","envolvido":"FFF","observacao":null,"tipo":"DESP","data_transacao":"2021-01-08T03:00:00.000Z","data_pagamento":"2021-01-08T03:00:00.000Z","valor":"-220.00","status":true,"conta_id":369949,"usuario_id":12862,"transferencia_id":null,"parcelamento_id":null}]            
    }).as('extrato')
}

export default buildEnv