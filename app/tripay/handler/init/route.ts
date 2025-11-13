import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const privateKey = 'mVD1y-Isr5P-iyjzc-dByeZ-WtdMV';

export async function POST(req: NextRequest) {
    const body = await req.json();

    // Generate HMAC signature
    const signature = crypto.createHmac('sha256', privateKey)
        .update(JSON.stringify(body))
        .digest('hex');

    console.log(signature);
    console.log(body);

    const response = await fetch('https://admin.sristoree.com/api/tripay/callback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Signature': signature,
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
        return NextResponse.json({ success: true }, { status: 200 });
    } else {
        return NextResponse.json({ success: false }, { status: response.status });
    }
}
