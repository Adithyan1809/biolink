// Cloudflare Pages Function: GET & POST /api/messages
function stripHtml(str) {
  if (!str) return '';
  return String(str).replace(/<[^>]*>?/gm, '').trim();
}

let memoryMessages = [
  {
    id: 'msg_welcome',
    name: 'Cloudflare Edge',
    message: 'Welcome to Adithyan\'s biolink hosted globally on Cloudflare Pages!',
    contact: '(cloudflare)',
    createdAt: new Date().toISOString()
  }
];

export async function onRequestGet(context) {
  const kv = context.env.BIOLINK_KV;
  let messages = memoryMessages;

  if (kv) {
    try {
      const stored = await kv.get('messages', { type: 'json' });
      if (Array.isArray(stored) && stored.length > 0) {
        messages = stored;
      }
    } catch (_) {}
  }

  return new Response(JSON.stringify({
    success: true,
    count: messages.length,
    messages
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store'
    }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const kv = env.BIOLINK_KV;

  let body;
  try {
    body = await request.json();
  } catch (_) {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  const { name, message, contact } = body;
  const cleanMessage = stripHtml(message?.trim()?.slice(0, 500));
  if (!cleanMessage) {
    return new Response(JSON.stringify({ success: false, error: 'Message cannot be empty.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  const cleanName = stripHtml(name?.trim()?.slice(0, 50)) || 'Anonymous Visitor';
  const cleanContact = contact ? stripHtml(contact.trim().slice(0, 100)) : null;

  const newMsg = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: cleanName,
    message: cleanMessage,
    contact: cleanContact ? '(provided)' : null,
    createdAt: new Date().toISOString()
  };

  memoryMessages.unshift(newMsg);
  if (memoryMessages.length > 50) memoryMessages = memoryMessages.slice(0, 50);

  if (kv) {
    try {
      let stored = await kv.get('messages', { type: 'json' }) || [];
      stored.unshift(newMsg);
      if (stored.length > 50) stored = stored.slice(0, 50);
      await kv.put('messages', JSON.stringify(stored));
    } catch (_) {}
  }

  return new Response(JSON.stringify({
    success: true,
    message: 'Message sent successfully!',
    item: newMsg
  }), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
