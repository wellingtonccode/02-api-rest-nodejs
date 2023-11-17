import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()


app.register(transactionsRoutes, {
  prefix: 'transaction'
})


// app.get('/hello', async () => {

//   // const tables = await knex('sqlite_schema').select('*');
//   // return tables;

//   // const transaction = await knex('transactions')
//   //   .insert({
//   //     id: crypto.randomUUID(),
//   //     title: 'Transação de Teste2',
//   //     amount: 1000
//   //   }).returning('*');

//   const transaction = await knex('transactions')
//   .where('amount', 1000)
//   .select('*');

//   return transaction;
// })

app
  .listen({
    port: env.PORT
  })
  .then(() => {
    console.log('HTTP Server running!')
  })
