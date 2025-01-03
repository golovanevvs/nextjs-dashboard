const { Client } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

async function listInvoices(client: any) {
  const data = await client.query(`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;
  `);

  return data.rows;
}

export async function GET() {
  const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });
  try {
    await client.connect();
    const li = await listInvoices(client);
    await client.end();
    return Response.json(li);
  } catch (error) {
    await client.end();
    return Response.json({ error }, { status: 500 });
  }
}
