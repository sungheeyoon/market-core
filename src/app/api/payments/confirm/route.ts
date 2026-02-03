import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { paymentKey, orderId, amount } = await req.json();

    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
        return NextResponse.json({ message: 'Toss Secret Key is missing' }, { status: 500 });
    }

    // 토스 페이먼츠 승인 API 호출을 위한 인증 헤더 설정
    const basicAuth = Buffer.from(`${secretKey}:`).toString('base64');

    try {
        const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${basicAuth}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                paymentKey,
                orderId,
                amount,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            // 결제 승인 성공
            // TODO: 여기서 데이터베이스(Supabase 등)에 주문 정보를 영구 저장하는 로직을 추가할 수 있습니다.
            return NextResponse.json({ success: true, data });
        } else {
            // 결제 승인 실패
            return NextResponse.json({ success: false, message: data.message || 'Payment confirmation failed' }, { status: response.status });
        }
    } catch (error) {
        console.error('Toss Confirmation Error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
