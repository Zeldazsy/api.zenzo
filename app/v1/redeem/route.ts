import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongo.server';

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const discord_id = url.searchParams.get('discord_id');
    const userkey = url.searchParams.get('userkey');

    if (!discord_id || !userkey) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const clientInstance = await clientPromise;
    const db = clientInstance.db('test');
    const collection = db.collection('allmap');

    const alreadyLinked = await collection.findOne({ discord_id });
    if (alreadyLinked) {
      return NextResponse.json({ success: false, message: 'You have already redeemed this key.' });
    }

    const keyRecord = await collection.findOne({ userkey });
    if (!keyRecord) {
      return NextResponse.json({ success: false, message: 'The key is incorrect.' });
    }

    await collection.updateOne({ userkey }, { $set: { discord_id } });
    return NextResponse.json({ success: true, message: 'Key redeemed successfully!' });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'An error occurred.', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
