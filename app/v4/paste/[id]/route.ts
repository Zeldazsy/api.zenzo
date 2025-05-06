import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

export const config = {
  runtime: 'edge', // กำหนดให้ใช้ edge runtime
}

async function connectDB() {
  if (!db) {
    db = await client.connect();
  }
  return db;
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  const dbConnection = await connectDB();
  const paste = await dbConnection.db().collection("pastes").findOne({ _id: id }, { projection: { code: 1 } });

  if (!paste) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(paste.code, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
    }
  });
}
