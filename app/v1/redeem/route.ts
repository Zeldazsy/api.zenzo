import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongo.server'; // Adjust the import path as necessary


// Handles POST requests
export async function POST(req: Request) {
  try {
    // Parse the request body to get discord_id and userkey
    const { discord_id, userkey } = await req.json();

    // Check if both required fields are provided
    if (!discord_id || !userkey) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields.' },
        { status: 400 }
      );
    }

    // MongoDB interaction logic directly in the route

    const clientInstance = await clientPromise; // Get MongoDB client
    const db = clientInstance.db('test'); // Replace with your database name
    const collection = db.collection('allmap'); // Replace with your collection name

    // Check if the Discord ID has already been linked to a key
    const alreadyLinked = await collection.findOne({ discord_id });
    if (alreadyLinked) {
      return NextResponse.json({ success: false, message: 'You have already redeemed this key.' });
    }

    // Check if the key exists in the database
    const keyRecord = await collection.findOne({ userkey });
    if (!keyRecord) {
      return NextResponse.json({ success: false, message: 'The key is incorrect.' });
    }

    // If the key is valid, update the record with the Discord ID
    await collection.updateOne({ userkey }, { $set: { discord_id } });
    return NextResponse.json({ success: true, message: 'Key redeemed successfully!' });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: 'An error occurred.', error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json({ success: false, message: 'An unknown error occurred.' }, { status: 500 });
    }
  }
}
