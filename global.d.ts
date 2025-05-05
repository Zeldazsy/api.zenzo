// global.d.ts
declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
    var mongooseCache: { conn: Mongoose | null; promise: Promise<Mongoose> | null }
  }
  
  export {};
  