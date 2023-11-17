import { FastifyInstance } from "fastify";
import z, { string } from "zod";
import { knex } from "../database";
import { randomUUID } from "crypto";



export async function transactionsRoutes(app: FastifyInstance){

    app.post('/', async (request, reply) => {
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })

        const {title, amount, type} = createTransactionBodySchema.parse(request.body);

        await knex('transactions').insert({
            id: randomUUID(),
            title: title,
            amount: type === 'credit' ? amount : amount * -1,
        })

        return reply.status(201).send();
    })

    app.get('/', async () => {
        // const tables = await knex('sqlite_schema').select('*');
        // return tables;

        // const transaction = await knex('transactions')
        //   .insert({
        //     id: crypto.randomUUID(),
        //     title: 'Transação de Teste2',
        //     amount: 1000
        //   }).returning('*');

        const transactions = await knex('transactions')
            .select('*');

        return {
            transactions
        }
    })

    app.get('/:id', async (request) => {
        const reqBodyParamsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = reqBodyParamsSchema.parse(request.params)

        const transaction = await knex('transactions').where('id', id).first();

        return {
            transaction
        }
    })

}