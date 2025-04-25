// lib/mongox.ts
import { MongoClient, Db, Collection } from "mongodb";

// กำหนดประเภทของการเชื่อมต่อ MongoDB และฐานข้อมูล
const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const dbName = "lootlabs";

export async function connectDB(): Promise<Db> {
  // เชื่อมต่อกับฐานข้อมูล
  const db = await client.connect().then(() => client.db(dbName));
  return db;
}

export async function getUpdates(): Promise<{ title: string, content: string, createdAt: string }[]> {
  const db = await connectDB();
  const collection: Collection = db.collection("updates");  // กำหนดประเภทของคอลเลกชัน
  return collection.find().toArray().then(docs =>
    docs.map(doc => ({
      title: doc.title,
      content: doc.content,
      createdAt: doc.createdAt
    }))
  );
}
