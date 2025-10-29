// app/api/archive-image/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

function guessContentType(name: string) {
    const ext = name.toLowerCase();
    if (ext.endsWith(".jpg") || ext.endsWith(".jpeg")) return "image/jpeg";
    if (ext.endsWith(".png")) return "image/png";
    if (ext.endsWith(".webp")) return "image/webp";
    if (ext.endsWith(".bmp")) return "image/bmp";
    if (ext.endsWith(".tiff") || ext.endsWith(".tif")) return "image/tiff";
    return "application/octet-stream";
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || "";
    const name = searchParams.get("name") || "";

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !name) {
        return NextResponse.json({ ok: false, message: "bad params" }, { status: 400 });
    }

    try {
        const p = path.join(process.cwd(), "archive", date, "files", "images", name);
        const buf = await fs.readFile(p);
        return new NextResponse(buf, {
            headers: { "Content-Type": guessContentType(name), "Cache-Control": "public, max-age=3600" },
        });
    } catch (e: any) {
        return NextResponse.json({ ok: false, message: e?.message || "not found" }, { status: 404 });
    }
}
