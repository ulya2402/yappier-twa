export interface Env {
  DB: D1Database;
  TELEGRAM_BOT_TOKEN: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

async function verifyInitData(initData: string, botToken: string) {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get("hash");
  urlParams.delete("hash");

  const keys = Array.from(urlParams.keys()).sort();
  const dataCheckString = keys.map(key => `${key}=${urlParams.get(key)}`).join("\n");

  const secretKey = await crypto.subtle.importKey("raw", new TextEncoder().encode("WebAppData"), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const secret = await crypto.subtle.sign("HMAC", secretKey, new TextEncoder().encode(botToken));
  const key = await crypto.subtle.importKey("raw", secret, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(dataCheckString));

  const hexSignature = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, "0")).join("");
  if (hexSignature !== hash) throw new Error("Invalid signature");
  return JSON.parse(urlParams.get("user") || "{}");
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
      if (url.pathname === "/api/auth" && request.method === "POST") {
        const { initData } = await request.json() as { initData: string };
        const userData = await verifyInitData(initData, env.TELEGRAM_BOT_TOKEN);
        await env.DB.prepare("INSERT INTO users (telegram_id, username) VALUES (?, ?) ON CONFLICT(telegram_id) DO UPDATE SET username = excluded.username").bind(userData.id.toString(), userData.username || "User").run();
        return new Response(JSON.stringify({ success: true, user: userData }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
      }

      // PERBAIKAN: Sekarang menghitung total komentar (comments) juga!
      if (url.pathname === "/api/posts" && request.method === "GET") {
        let userId = "";
        const authHeader = request.headers.get("Authorization");
        if (authHeader && authHeader.startsWith("tma ")) {
          try { userId = (await verifyInitData(authHeader.slice(4), env.TELEGRAM_BOT_TOKEN)).id.toString(); } catch (e) {}
        }
        const { results } = await env.DB.prepare(`
          SELECT p.*, 
            (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) as likes, 
            (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as comments,
            (SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.telegram_id = ?) as is_liked
          FROM posts p ORDER BY created_at DESC LIMIT 50
        `).bind(userId).all();
        return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json", ...corsHeaders } });
      }

      if (url.pathname === "/api/posts" && request.method === "POST") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("tma ")) return new Response("Unauthorized", { status: 401, headers: corsHeaders });
        const userData = await verifyInitData(authHeader.slice(4), env.TELEGRAM_BOT_TOKEN);
        const body = await request.json() as { content: string; category: string };
        await env.DB.prepare("INSERT INTO posts (telegram_id, username, content, category) VALUES (?, ?, ?, ?)").bind(userData.id.toString(), userData.username || "User", body.content, body.category).run();
        return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
      }

      if (url.pathname === "/api/like" && request.method === "POST") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("tma ")) return new Response("Unauthorized", { status: 401, headers: corsHeaders });
        const userData = await verifyInitData(authHeader.slice(4), env.TELEGRAM_BOT_TOKEN);
        const { postId } = await request.json() as { postId: number };
        const existing = await env.DB.prepare("SELECT * FROM likes WHERE post_id = ? AND telegram_id = ?").bind(postId, userData.id.toString()).first();
        if (existing) {
          await env.DB.prepare("DELETE FROM likes WHERE post_id = ? AND telegram_id = ?").bind(postId, userData.id.toString()).run();
        } else {
          await env.DB.prepare("INSERT INTO likes (post_id, telegram_id) VALUES (?, ?)").bind(postId, userData.id.toString()).run();
        }
        return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
      }

      // ENDPOINT BARU: Ambil Daftar Komentar
      if (url.pathname === "/api/comments" && request.method === "GET") {
        const postId = url.searchParams.get("postId");
        const { results } = await env.DB.prepare(`
          SELECT * FROM comments 
          WHERE post_id = ? 
          ORDER BY created_at ASC
        `).bind(Number(postId)).all();
        return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json", ...corsHeaders } });
      }

      // ENDPOINT: Buat Komentar Baru (Mendukung parent_id)
      if (url.pathname === "/api/comments" && request.method === "POST") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("tma ")) return new Response("Unauthorized", { status: 401, headers: corsHeaders });
        const userData = await verifyInitData(authHeader.slice(4), env.TELEGRAM_BOT_TOKEN);
        const { postId, content, parentId } = await request.json() as { postId: number, content: string, parentId?: number };
        
        await env.DB.prepare(
          "INSERT INTO comments (post_id, telegram_id, username, content, parent_id) VALUES (?, ?, ?, ?, ?)"
        ).bind(postId, userData.id.toString(), userData.username || "User", content, parentId || null).run();

        return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
      }

      if (url.pathname === "/api/profile" && request.method === "GET") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("tma ")) return new Response("Unauthorized", { status: 401, headers: corsHeaders });
        const userData = await verifyInitData(authHeader.slice(4), env.TELEGRAM_BOT_TOKEN);
        const stats: any = await env.DB.prepare("SELECT COUNT(*) as total_posts FROM posts WHERE telegram_id = ?").bind(userData.id.toString()).first();
        return new Response(JSON.stringify({ ...userData, total_posts: stats ? stats.total_posts : 0, total_followers: 0, total_following: 0 }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
      }

      return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders }});
    } catch (error: any) {
      console.error("Worker error:", error);
      return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders }});
    }
  }
};