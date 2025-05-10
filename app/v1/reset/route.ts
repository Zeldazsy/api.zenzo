// 'use server';
import clientPromise from '@/app/lib/mongo.server'; // Adjust the import path as necessary

export async function POST(request: Request) {
  try {
    const { discord_id } = await request.json();
    const result = await resetHWID(discord_id);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    } else {
      return new Response("An unknown error occurred", { status: 500 });
    }
  }
}

async function resetHWID(discord_id: string) {
  const client = await clientPromise;
  const db = client.db('zenzo');
  const collection = db.collection('allmap');

  const now = new Date(Date.now() + 7 * 60 * 60 * 1000);
  const user = await collection.findOne({ discord_id });
  if (!user) throw new Error('User not found.');

  

  if (user.vip == 'False') {
    const last = new Date(user.last_reset);
    const cooldown = 5 * 60 * 60 * 1000;
    if (now.getTime() - last.getTime() < cooldown) {
      const waitMin = Math.ceil((cooldown - (now.getTime() - last.getTime())) / 60000);
      return { success: false, message: `Wait ${waitMin} minutes before resetting again.` };
    }
  }

  await collection.updateOne(
    { discord_id },
    {
      $set: {
        hwids: 'Unknown',
        last_reset: now.toISOString()
      },
      $inc: { hwid_reset_count: 1 }
    }
  );

  return { success: true };
}
