
import { NextResponse } from "next/server"

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;
        const id = params.id;
        if (!id) {
            return NextResponse.json(
                {
                    error: "Missing id parameter",
                    diagnostic: {
                        params: params ?? null,
                        requestUrl: request.url,
                    },
                },
                { status: 400 },
            )
        }

        const backendUrl = `https://admin.sristoree..com/api/getproduk/${encodeURIComponent(id)}`
        const response = await fetch(backendUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error("getproduk error:", error)
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }
}
