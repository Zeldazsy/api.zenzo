import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cachedDb: Db | null = null;

export default async function connectDB(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("test");
  console.log('Connected to MongoDB:', "test");
  cachedDb = db;

  return db;
}
