// app/api/news/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type NewsArticle = {
    id: number;
    title: string;
    titleCn: string;
    date: string;       // YYYY-MM-DD
    content: string;
    contentCn: string;
    images: string[];   // 可直接给 <Image src=...> 使用的 URL
};

async function exists(p: string) {
    try { await fs.access(p); return true; } catch { return false; }
}
async function ensureArray<T=any>(v: any): Promise<T[]> { return Array.isArray(v) ? v as T[] : []; }

export async function GET() {
    try {
        const root = path.join(process.cwd(), "archive");
        if (!(await exists(root))) {
            return NextResponse.json({ ok: true, items: [] });
        }

        const dateDirs = (await fs.readdir(root, { withFileTypes: true }))
            .filter(d => d.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(d.name))
            .map(d => d.name)
            .sort((a, b) => b.localeCompare(a)); // 新 -> 旧

        const items: NewsArticle[] = [];
        let idCounter = 1;

        for (const date of dateDirs) {
            const dayDir = path.join(root, date);
            const filesDir = path.join(dayDir, "files");
            const imagesDir = path.join(filesDir, "images");

            // 读取当天图片文件名，生成可被 <Image> 使用的 API URL
            let imageNames: string[] = [];
            if (await exists(imagesDir)) {
                const imgs = await fs.readdir(imagesDir);
                imageNames = imgs.filter(n => /\.(png|jpe?g|webp|bmp|tiff)$/i.test(n));
            }
            const imageUrls = imageNames.map(n => `/api/archive-image?date=${encodeURIComponent(date)}&name=${encodeURIComponent(n)}`);

            // 读取 combined.json（由 /api/upload 维护）
            const combinedPath = path.join(dayDir, "combined.json");
            let combined: any[] = [];
            if (await exists(combinedPath)) {
                try {
                    combined = JSON.parse(await fs.readFile(combinedPath, "utf8"));
                    if (!Array.isArray(combined)) combined = [];
                } catch { combined = []; }
            }

            // 若 combined 有条目：每条生成一篇新闻；否则基于当日图片生成一条占位新闻
            if (combined.length > 0) {
                for (const rec of combined) {
                    // 允许后端 JSON 里自带 images（文件名或完整 URL），没有就用当日全部图片
                    const images = Array.isArray(rec?.images) && rec.images.length
                        ? rec.images.map((x: string) =>
                            x.match(/^https?:\/\//) ? x : `/api/archive-image?date=${encodeURIComponent(date)}&name=${encodeURIComponent(x)}`)
                        : imageUrls;

                    items.push({
                        id: idCounter++,
                        title: String(rec?.title ?? "") || "",
                        titleCn: String(rec?.titleCn ?? "") || "",
                        date,
                        content: String(rec?.content ?? "") || "",
                        contentCn: String(rec?.contentCn ?? "") || "",
                        images,
                    });
                }
            } else if (imageUrls.length > 0) {
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
