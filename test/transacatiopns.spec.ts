import { afterAll, beforeAll, beforeEach, it, describe, expect, } from 'vitest'
import request from 'supertest'
import { app } from "../src/app"
import { execSync } from 'node:child_process'

describe('Transactions Routes', () => {

    beforeAll(async () => {
        await app.ready()
    })
    
    afterAll( async () => {
        await app.close()
    })

    beforeEach( () => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })
    
    // teste("user can create a new transaction", async ()=> {
    it("user can create a new transaction", async ()=> {
        await request(app.server)
        .post('/transactions').
        send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit'
        })
        .expect(201)
    })

    it("user can list transactions", async ()=> {
        const createTransactionResponse = await request(app.server)
        .post('/transactions').
        send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit'
        })

        const cookies = createTransactionResponse.get('Set-Cookie')

        const listTransactionsReponse = await request(app.server)
        .get('/transactions')
        .set('Cookie', cookies)
        .expect(200)

        expect(listTransactionsReponse.body.transactions).toEqual([expect.objectContaining({
            id: expect.any(String),
            title: 'New transaction',
            amount: 5000,
        })])
    })


    it("user can list specifict transaction", async ()=> {
        const createTransactionResponse = await request(app.server)
        .post('/transactions').
        send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit'
        })

        const cookies = createTransactionResponse.get('Set-Cookie')

        const listTransactionsReponse = await request(app.server)
        .get('/transactions')
        .set('Cookie', cookies)
        .expect(200)

        const transactionId = listTransactionsReponse.body.transactions[0].id

        const listEspecificTransaction = await request(app.server)
        .get(`/transactions/${transactionId}`)
        .set('Cookie', cookies)
        .expect(200)

        expect(listEspecificTransaction.body.transaction).toEqual(expect.objectContaining({
            id: transactionId,
            title: 'New transaction',
            amount: 5000,
        }))
    })

    it("user can list summary", async ()=> {
        const credit = 5000
            , debit = 3000
        ;

        const createCreditTransactionResponse = await request(app.server)
        .post('/transactions').
        send({
            title: 'Credit transaction',
            amount: credit,
            type: 'credit'
        })

        const cookies = createCreditTransactionResponse.get('Set-Cookie')
        
        const createDebitTransactionResponse = await request(app.server)
        .post('/transactions')
        .set('Cookie', cookies)
        .send({
            title: 'Debit transaction',
            amount: debit,
            type: 'debit'
        })

        const summaryTransactionResponse = await request(app.server)
        .get('/transactions/summary')
        .set('Cookie', cookies)
        .expect(200)

        expect(summaryTransactionResponse.body.summary).toEqual({
            amount: credit-debit
        })

    })
})
