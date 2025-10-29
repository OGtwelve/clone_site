// app/api/upload/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import JSON5 from "json5";

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"]);
const TXT_EXTS = new Set([".txt"]);

async function ensureDir(p: string) { await fs.mkdir(p, { recursive: true }); }
async function readJSON<T=any>(p: string, def: T) {
    try { return JSON.parse(await fs.readFile(p, "utf8")) as T; } catch { return def; }
}

// ---- 解析辅助：尽量把“脏文本”转成对象列表 ----
function parseLoose(text: string): any[] {
    const t = (text ?? "").trim();
    if (!t) return [];

    // 1) 严格 JSON
    try { const v = JSON.parse(t); return Array.isArray(v) ? v : [v]; } catch {}

    // 2) JSON5（未加引号字段、尾逗号等）
    try { const v = JSON5.parse(t); return Array.isArray(v) ? v : [v]; } catch {}

    // 3) 形如 …}{… 连接：补数组和逗号
    if (/}\s*{/.test(t) && !/^\s*\[/.test(t)) {
        const bracketed = `[${t.replace(/}\s*{/g, "},{")}]`;
        try { const v = JSON5.parse(bracketed); return Array.isArray(v) ? v : [v]; } catch {}
    }

    // 4) NDJSON：每行一个对象
    const lines = t.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    const out: any[] = [];
    for (const line of lines) {
        let v: any = undefined;
        try { v = JSON.parse(line); } catch { try { v = JSON5.parse(line); } catch {} }
        if (v !== undefined) out.push(v);
    }
    return out;
}

function normalizeRecord(rec: any) {
    if (rec && Array.isArray(rec.images)) {
        rec.images = rec.images.map((x: any) =>
            typeof x === "string" ? x.replace(/^\/+/, "") : x
        );
    }
    return rec;
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

        if (!files?.length) {
            return NextResponse.json({ ok:false, message:"no files" }, { status:400 });
        }

        // 修改路径为云平台支持的临时路径（例如 /tmp）
        const root = path.join(process.env.ARCHIVE_PATH || "/tmp", "archive", date);  // 使用 /tmp/archive
        const filesDir = path.join(root, "files");
        const imagesDir = path.join(filesDir, "images");
        await ensureDir(imagesDir);

        if (metaStr) await fs.writeFile(path.join(root, "meta.json"), metaStr, "utf8");
        if (summaryStr) await fs.writeFile(path.join(root, "summary.json"), summaryStr, "utf8");

        const combinedTxtPath = path.join(root, "combined.txt");
        const combinedJsonPath = path.join(root, "combined.json");
        const combined = await readJSON<any[]>(combinedJsonPath, []);

        let saved = 0;

        for (const file of files) {
            const buf = Buffer.from(await file.arrayBuffer());
            const ext = path.extname(file.name).toLowerCase();

            if (TXT_EXTS.has(ext)) {
                const text = buf.toString("utf8").trim();

                // 追加纯文本日志
                if (text) await fs.appendFile(combinedTxtPath, text + "\n", "utf8");

                // 尝试解析并合并到 combined.json
                const records = parseLoose(text);
                for (const r of records) combined.push(normalizeRecord(r));

                await ensureDir(filesDir);
                await fs.writeFile(path.join(filesDir, file.name), buf);
                saved++;
                continue;
            }

            if (IMAGE_EXTS.has(ext)) {
                await fs.writeFile(path.join(imagesDir, file.name), buf);
                saved++;
                continue;
            }

            await ensureDir(filesDir);
            await fs.writeFile(path.join(filesDir, file.name), buf);
            saved++;
        }

        await fs.writeFile(combinedJsonPath, JSON.stringify(combined, null, 2), "utf8");
        return NextResponse.json({ ok:true, saved, root });
    } catch (e: any) {
        return NextResponse.json({ ok:false, message:e?.message || String(e) }, { status:500 });
    }
}
