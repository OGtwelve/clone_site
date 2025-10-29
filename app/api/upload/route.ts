export const runtime = "nodejs";

import { NextResponse } from "next/server";
import JSON5 from "json5";
import { put, list } from "@vercel/blob"; // ✅ 只有这些：put/list（没有 get）
import path from "path";

// 解析“脏文本”为对象数组
function parseLoose(text: string): any[] {
    const t = (text ?? "").trim();
    if (!t) return [];
    try { const v = JSON.parse(t); return Array.isArray(v) ? v : [v]; } catch {}
    try { const v = JSON5.parse(t); return Array.isArray(v) ? v : [v]; } catch {}
    if (/}\s*{/.test(t) && !/^\s*\[/.test(t)) {
        const bracketed = `[${t.replace(/}\s*{/g, "},{")}]`;
        try { const v = JSON5.parse(bracketed); return Array.isArray(v) ? v : [v]; } catch {}
    }
    const out: any[] = [];
    for (const line of t.split(/\r?\n/).map(s => s.trim()).filter(Boolean)) {
        try { out.push(JSON.parse(line)); } catch { try { out.push(JSON5.parse(line)); } catch {} }
    }
    return out;
}

function normalizeRecord(rec: any) {
    if (rec && Array.isArray(rec.images)) {
        rec.images = rec.images.map((x: any) => typeof x === "string" ? x.replace(/^\/+/, "") : x);
    }
    return rec;
}

async function readBlobTextIfExists(key: string): Promise<string | null> {
    const { blobs } = await list({ prefix: key });
    const hit = blobs.find(b => b.pathname === key);
    if (!hit) return null;
    const r = await fetch(hit.url);
    if (!r.ok) return null;
    return await r.text();
}

export async function GET() {
    return NextResponse.json({ ok: true, hint: "POST multipart/form-data with fields: date, files[], meta, summary" });
}

export async function POST(req: Request) {
    try {
        const form = await req.formData();
        const date = String(form.get("date") ?? new Date().toISOString().slice(0, 10));
        const files = form.getAll("files") as File[];
        const metaStr = form.get("meta") as string | null;
        const summaryStr = form.get("summary") as string | null;

        if (!files?.length) return NextResponse.json({ ok:false, message:"no files" }, { status:400 });

        // 所有内容统一存到 news/<date>/ 前缀下
        const prefix = `news/${date}/`;

        // 读取已有 combined（若不存在返回空）
        const oldTxt = (await readBlobTextIfExists(`${prefix}combined.txt`)) ?? "";
        const oldJson = (await readBlobTextIfExists(`${prefix}combined.json`));
        const combined: any[] = Array.isArray(oldJson ? JSON.parse(oldJson) : []) ? JSON.parse(oldJson || "[]") : [];

        // 记录“本次上传图片文件名 -> Blob URL”的映射，便于替换文本里的 images
        const imgUrlMap = new Map<string, string>();

        let saved = 0;

        // 先处理图片：上传到 Blob，拿到 URL
        for (const file of files) {
            const ext = path.extname(file.name).toLowerCase();
            if (/\.(jpg|jpeg|png|webp|bmp|tiff?)$/i.test(ext)) {
                const buf = Buffer.from(await file.arrayBuffer());
                const { url } = await put(`${prefix}${file.name}`, buf, {
                    access: "public",
                    contentType: file.type || undefined,
                });
                imgUrlMap.set(file.name.replace(/^\/+/, ""), url);
                saved++;
            }
        }

        // 再处理文本与其它文件
        let txtAppend = "";
        for (const file of files) {
            const ext = path.extname(file.name).toLowerCase();
            if (/\.txt$/i.test(ext)) {
                const text = Buffer.from(await file.arrayBuffer()).toString("utf8").trim();
                if (text) {
                    txtAppend += (txtAppend ? "\n" : "") + text;
                    const recs = parseLoose(text).map(normalizeRecord);
                    // 替换 images 为 Blob URL（若匹配到）
                    for (const r of recs) {
                        if (Array.isArray(r.images)) {
                            r.images = r.images.map((x: any) => {
                                if (typeof x === "string") {
                                    const k = x.replace(/^\/+/, "");
                                    return imgUrlMap.get(k) ?? x; // 没有就保持原值（可为完整URL或旧文件名）
                                }
                                return x;
                            });
                        }
                        combined.push(r);
                    }
                }
                saved++;
            } else if (!/\.(jpg|jpeg|png|webp|bmp|tiff?)$/i.test(ext)) {
                // 其它非图片附件也直接上 Blob（可按需）
                const buf = Buffer.from(await file.arrayBuffer());
                await put(`${prefix}${file.name}`, buf, { access: "public", contentType: file.type || undefined });
                saved++;
            }
        }

        // meta / summary 也入 Blob
        if (metaStr) await put(`${prefix}meta.json`, metaStr, { access: "public", contentType: "application/json; charset=utf-8" });
        if (summaryStr) await put(`${prefix}summary.json`, summaryStr, { access: "public", contentType: "application/json; charset=utf-8" });

        // 写回 combined.txt / combined.json
        const newTxt = [oldTxt, txtAppend].filter(Boolean).join(oldTxt && txtAppend ? "\n" : "");
        await put(`${prefix}combined.txt`, newTxt, { access: "public", contentType: "text/plain; charset=utf-8" });
        await put(`${prefix}combined.json`, JSON.stringify(combined, null, 2), {
            access: "public", // 前端读 news 时要用到，设为 public 简化
            contentType: "application/json; charset=utf-8",
        });

        return NextResponse.json({ ok:true, saved, prefix });
    } catch (e: any) {
        return NextResponse.json({ ok:false, message:e?.message || String(e) }, { status:500 });
    }
}
