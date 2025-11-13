import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();

    const response = await fetch('https://admin.sristoree.com/api/createtransaksi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();
console.log(data)
    return NextResponse.json(data, { status: response.status });
}
