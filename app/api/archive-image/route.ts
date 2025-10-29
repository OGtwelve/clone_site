export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || "";
    const name = (searchParams.get("name") || "").replace(/^\/+/, "");

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !name) {
        return NextResponse.json({ ok:false, message:"bad params" }, { status:400 });
    }

    const key = `news/${date}/${name}`;
    const { blobs } = await list({ prefix: key });
    const hit = blobs.find(b => b.pathname === key);
    if (!hit) return NextResponse.json({ ok:false, message:"not found" }, { status:404 });

    // 直接 302 跳转到 Blob 公网 URL（浏览器/Next Image 都能用）
    return NextResponse.redirect(hit.url, 302);
}
