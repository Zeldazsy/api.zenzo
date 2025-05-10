import { MongoClient } from "mongodb";
  import { ObjectId } from "mongodb";


const client = new MongoClient(process.env.MONGODB_URI!);

async function connectDB() {
    return await client.connect();
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  const dbConnection = await connectDB();

  const paste = await dbConnection.db("filebin").collection("pastes").findOne({ _id: new ObjectId(id) }, { projection: { code: 1 } });

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
