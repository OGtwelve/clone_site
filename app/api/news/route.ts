export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

type NewsArticle = {
    id: number;
    title: string;
    titleCn: string;
    date: string;       // YYYY-MM-DD
    content: string;
    contentCn: string;
    images: string[];   // 直接是可用的公网 URL
};

export async function GET() {
    try {
        // 拉取所有 news/ 前缀的对象
        const { blobs } = await list({ prefix: "news/" });

        // 提取所有日期
        const dateSet = new Set<string>();
        for (const b of blobs) {
            // pathname 形如 "news/2025-01-15/xxx"
            const m = b.pathname.match(/^news\/(\d{4}-\d{2}-\d{2})\//);
            if (m) dateSet.add(m[1]);
        }
        const dates = Array.from(dateSet).sort((a,b) => b.localeCompare(a)); // 新->旧

        const items: NewsArticle[] = [];
        let idCounter = 1;

        for (const date of dates) {
            const prefix = `news/${date}/`;

            // 找 combined.json
            const combined = blobs.find(b => b.pathname === `${prefix}combined.json`);
            let recs: any[] = [];
            if (combined) {
                const r = await fetch(combined.url);
                if (r.ok) {
                    try { recs = await r.json(); if (!Array.isArray(recs)) recs = []; } catch { recs = []; }
                }
            }

            // 收集该日期下所有图片 URL
            const imageUrls = blobs
                .filter(b => b.pathname.startsWith(prefix) && /\.(png|jpe?g|webp|bmp|tiff?)$/i.test(b.pathname))
                .map(b => b.url);

            if (recs.length) {
                for (const rec of recs) {
                    const imgs = Array.isArray(rec?.images) && rec.images.length
                        ? rec.images.map((x: any) => (typeof x === "string" && /^https?:\/\//.test(x)) ? x : x)
                        : imageUrls;
                    items.push({
                        id: idCounter++,
                        title: String(rec?.title ?? ""),
                        titleCn: String(rec?.titleCn ?? ""),
                        date,
                        content: String(rec?.content ?? ""),
                        contentCn: String(rec?.contentCn ?? ""),
                        images: imgs,
                    });
                }
            } else if (imageUrls.length) {
                // 没有 combined.json 就给一条占位新闻（只带图片）
                items.push({
                    id: idCounter++,
                    title: "",
                    titleCn: "",
                    date,
                    content: "",
                    contentCn: "",
                    images: imageUrls,
                });
            }
        }

        return NextResponse.json({ ok: true, items });
    } catch (e: any) {
        return NextResponse.json({ ok: false, message: e?.message || String(e) }, { status: 500 });
    }
}
