// global.d.ts
declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
    var mongooseCache: { conn: Mongoose | null; promise: Promise<Mongoose> | null }
    let cached = (global as any)._fastConn
    var _fastConn: Mongoose | undefined; // Use Mongoose type instead of any
    let db: any;


  }
  
  export {};
  