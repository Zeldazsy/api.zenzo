import { sha256 } from 'js-sha256';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from './mongo';

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const keyInput = url.searchParams.get('key');
  const discord_id = url.searchParams.get('discord_id');

  if (!keyInput || !discord_id) {
    return NextResponse.json({ success: false, message: 'Missing key or Discord ID' }, { status: 400 });
  }

  try {
    const db = await connectDB();
    const collection = db.collection('allmap');

    const keyDoc = await collection.findOne({ userkey: keyInput });
    if (!keyDoc) return NextResponse.json({ success: false, message: 'Key not found.' }, { status: 400 });

    await collection.updateOne({ userkey: keyInput }, { $set: { discord_id } });
    return NextResponse.json({ success: true, message: 'Key redeemed successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const url = new URL(req.url);
  const discord_id = url.searchParams.get('discord_id');

  if (!discord_id) return NextResponse.json({ success: false, message: 'Discord ID not found.' }, { status: 400 });

  const db = await connectDB();
  const collection = db.collection('allmap');
  const user = await collection.findOne({ discord_id });

  if (!user) return NextResponse.json({ success: false, message: 'User not found.' });

  const now = new Date();
  const nowGMT7 = new Date(now.getTime() + 7 * 60 * 60 * 1000);

  if (user.vip === 'False') {
    const lastResetTime = new Date(user.last_reset);
    const cooldown = 5 * 60 * 60 * 1000;
    const nowTime = nowGMT7.getTime();

    if (nowTime - lastResetTime.getTime() < cooldown) {
      const minutesLeft = Math.ceil((cooldown - (nowTime - lastResetTime.getTime())) / 60000);
      return NextResponse.json({ success: false, message: `Wait ${minutesLeft} minutes to reset HWID again.` });
    }
  }

  await collection.updateOne(
    { discord_id },
    {
      $set: { hwids: 'Unknown', last_reset: nowGMT7.toISOString() },
      $inc: { hwid_reset_count: 1 }
    }
  );

  return NextResponse.json({ success: true, message: 'Reset Hwid Successfully.' });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const action = url.searchParams.get('action');
  const keyx = url.searchParams.get('key');
  const kuyheetad = url.searchParams.get('kuyheetad');
  const json = url.searchParams.get('json');

  const db = await connectDB();
  const collection = db.collection('allmap');

  if (action === 'gs') {
    if (!keyx) return new NextResponse('Key not found.', { status: 400 });
    const responseText = `_G.Authorize = "${keyx}";\nloadstring(game:HttpGet("https://api.zenzohub.pro/v4/paste/681885ae435cbb4c6fd94594"))();`;
    return new NextResponse(responseText, { headers: { 'Content-Type': 'text/plain' } });
  }

  if (action === 'gk' && kuyheetad === 'true') {
    const all = await collection.find().toArray();
    const used = all.filter(row => row.discord_id && row.discord_id !== 'Unknown');
    const unused = all.filter(row => !row.discord_id || row.discord_id === 'Unknown');

    if (json === 'true') {
      return NextResponse.json({
        usedKeys: used.map(row => ({ userkey: row.userkey, discord_id: row.discord_id })),
        unusedKeys: unused.map(row => row.userkey),
      });
    }

    let responseText = '--- [[ Unused Keys ]] ---\n';
    responseText += unused.map(r => r.userkey).join('\n') + '\n';
    responseText += '--- [[ Used Keys ]] ---\n';
    responseText += used.map(r => `${r.userkey} (Discord ID: ${r.discord_id})`).join('\n');

    return new NextResponse(responseText, { headers: { 'Content-Type': 'text/plain' } });
  }

  return new NextResponse('Invalid action', { status: 400 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, hwid, action, reason, discordid } = body;

    const db = await connectDB();
    const collection = db.collection('allmap');

    if (action === 'bl') {
      if (!key || !reason) return NextResponse.json({ success: false, message: 'Missing key or reason' });
      const user = await collection.findOne({ userkey: key, discord_id: discordid });
      if (!user) return NextResponse.json({ success: false, message: 'Key not found.' });
      if (user.Blacklisted === 'True') return NextResponse.json({ success: false, message: 'Already blacklisted.' });

      await collection.updateOne({ userkey: key }, { $set: { Blacklisted: 'True', Reason: reason } });
      return NextResponse.json({ success: true, message: `User ${key} has been blacklisted.` });
    }

    if (action === 'aurhorize') {
      if (!key || !hwid) return NextResponse.json({ success: false, message: 'Missing key or HWID' });

      const user = await collection.findOne({ userkey: key });
      if (!user) return NextResponse.json({ success: false, message: 'Invalid Key' });

      const hwidList = user.hwids.split(',');
      if (!hwidList.includes(hwid) && user.hwids !== 'Unknown') {
        return NextResponse.json({ success: false, message: 'Invalid HWID' });
      }

      if (user.Blacklisted === 'True') {
        return NextResponse.json({ success: false, message: 'You Are Blacklisted.' });
      }

      await collection.updateOne({ userkey: key }, {
        $set: { hwids: user.hwids === 'Unknown' ? hwid : user.hwids },
        $inc: { execution_count: 1 }
      });

      const raw = `DH.${user.hwids}_${key.length}_SSS>nahee/La+SamaSoCute!`;
      let response = sha256(raw);
      response = sha256(response + 'Darknesss');

      return NextResponse.json({ success: true, key, hwid, discord_id: user.discord_id, SomeData: response });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' });
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({ success: false, message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
