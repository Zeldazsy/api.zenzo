// app/api/encryptLink/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = 'https://be.lootlabs.gg/api/lootlabs/url_encryptor';
const API_TOKEN = '157db1934b3f253285d089d71e8b2f496691ceee8ec903daa3d632a38477e540';

export async function POST(req: NextRequest) {
    const { destination_url } = await req.json();

    if (!destination_url) {
        return NextResponse.json({ error: 'Missing destination_url' }, { status: 400 });
    }

    try {
        const response = await axios.post<{ message: string }>(
            API_URL,
            { destination_url },
            { headers: { Authorization: `Bearer ${API_TOKEN}` } }
        );

        return NextResponse.json({ encryptedLink: response.data.message });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
