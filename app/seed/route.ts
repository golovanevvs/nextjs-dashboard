import bcrypt from "bcrypt";
import { invoices, customers, revenue, users } from "../lib/placeholder-data";

const { Client } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

async function seedUsers(client: any) {
  await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.query(
        `
        INSERT INTO users (id, name, email, password)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING;
        `,
        [user.id, user.name, user.email, hashedPassword]
      );
    })
  );

  return insertedUsers;
}

async function seedInvoices(client: any) {
  await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  await client.query(`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `);

  const insertedInvoices = await Promise.all(
    invoices.map((invoice) =>
      client.query(
        `
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING;
      `,
        [invoice.customer_id, invoice.amount, invoice.status, invoice.date]
      )
    )
  );

  return insertedInvoices;
}

async function seedCustomers(client: any) {
  await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  await client.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `);

  const insertedCustomers = await Promise.all(
    customers.map((customer) =>
      client.query(
        `
        INSERT INTO customers (id, name, email, image_url)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING;
      `,
        [customer.id, customer.name, customer.email, customer.image_url]
      )
    )
  );

  return insertedCustomers;
}

async function seedRevenue(client: any) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `);

  const insertedRevenue = await Promise.all(
    revenue.map((rev) =>
      client.query(
        `
        INSERT INTO revenue (month, revenue)
        VALUES ($1, $2)
        ON CONFLICT (month) DO NOTHING;
      `,
        [rev.month, rev.revenue]
      )
    )
  );

  return insertedRevenue;
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
    await client.query(`BEGIN`);
    await seedUsers(client);
    await seedCustomers(client);
    await seedInvoices(client);
    await seedRevenue(client);
    await client.query(`COMMIT`);
    const res = await client.query(
      "CREATE TABLE IF NOT EXISTS revenue (month VARCHAR(4) NOT NULL UNIQUE, revenue INT NOT NULL);"
    );
    await client.end();
    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.query(`ROLLBACK`);
    await client.end();
    return Response.json({ error }, { status: 500 });
  }
}
