import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { trxid } = await req.json();

        if (!trxid || typeof trxid !== 'string' || trxid.trim() === '') {
            return NextResponse.json({ error: 'trxid is required' }, { status: 400 });
        }

        const res = await fetch('https://admin.sristoree.com/api/cektrx', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trxid }),
        });
if(!res.ok){
            return NextResponse.json({ message: 'Transaksi Tidak Ditemukan!' }, { status: res.status });
        }
        const data = await res.json();


        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
