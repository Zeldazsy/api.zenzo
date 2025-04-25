import clientPromise from '@/app/lib/mongo.server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const discord_id = url.searchParams.get('discord_id');

  if (!discord_id) {
    return new Response(JSON.stringify({ error: 'Missing discord_id' }), { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("test");
    const user = await db.collection("allmap").findOne({ discord_id });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
