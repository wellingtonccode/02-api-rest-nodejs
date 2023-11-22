import { app } from "./app"
import { env } from "./env"

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
    port: env.PORT,
    host: ("RENDER" in process.env) ? '0.0.0.0' : 'localhost',
  })
  .then(() => {
    console.log('HTTP Server running!')
  })
