const dotenv = require("dotenv");
dotenv.config();
import {client} from '@/app/dashboard/(overview)/page'

async function listInvoices() {
  const data = await client.query(`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;
  `);

  return data.rows;
}

export async function GET() {
  try {
    return Response.json(await listInvoices());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
