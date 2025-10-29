// app/api/blob/clear/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

import { NextResponse } from "next/server";
import { list, del } from "@vercel/blob";

type Body = { prefix?: string; dryRun?: boolean };

export async function GET() {
    return NextResponse.json({
        ok: true,
        hint: "POST JSON { prefix: 'news/', dryRun: false } to delete blobs under prefix",
    });
}

export async function POST(req: Request) {
    let body: Body = {};
    try {
        body = await req.json();
    } catch {
        // 允许空 body
    }
    const prefix = (body.prefix ?? "news/").toString();
    const dryRun = Boolean(body.dryRun);

    // 预演模式：只返回将要删的前若干个对象，避免误删
    if (dryRun) {
        const firstPage = await list({ prefix, limit: 20 });
        return NextResponse.json({
            ok: true,
            dryRun: true,
            sample: firstPage.blobs.map(b => ({ path: b.pathname, size: b.size })),
            totalPreviewed: firstPage.blobs.length,
            note: "Set dryRun=false to actually delete.",
        });
    }

    let cursor: string | undefined;
    let totalDeleted = 0;

    do {
        const page = await list({ prefix, cursor, limit: 100 }); // 分批删除以避开限速
        const urls = page.blobs.map(b => b.url);
        if (urls.length) {
            await del(urls);
            totalDeleted += urls.length;
        }
        cursor = page.cursor;
    } while (cursor);

    return NextResponse.json({ ok: true, deleted: totalDeleted, prefix });
}