// ./app/api/hello/route.ts
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

export const runtime = "edge";

export async function GET(request: Request) {
  const quote = await prisma.quote.findFirst({});

  // Check if a quote was found
  if (!quote) {
    return new Response(JSON.stringify({ error: "No quote found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Respond with the quote in JSON format
  return new Response(JSON.stringify({ quote: quote.text }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
