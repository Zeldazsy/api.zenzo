import type { MongoClient } from "mongodb";
import type { Mongoose } from "mongoose";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  var mongooseCache: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
  var _fastConn: Mongoose | undefined;
  var db: Awaited<ReturnType<MongoClient["connect"]>> | null;
}

export {};
