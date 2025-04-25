// lib/webhook.ts
export async function Webhook(title: string, content: string) {
    const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK!;
    const payload = {
      username: "Momoka",
      avatar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREWB31RX73J4ndpnNm1E9MJ766Ht1Qhpt5nvNXszA2au6ByenYv6c-MLRGE-2GoJN6jpI&usqp=CAU",
      content: "@everyone",
      embeds: [
        {
          title: `${title}`,
          description: content.replace(/<br>/g, '\n').replace(/<[^>]+>/g, ''),
          color: 0x3498db,
            timestamp: new Date().toISOString(),
        }
      ]
    };
  
    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }
  