import { NextResponse } from 'next/server';
import { queryProduct } from '@/lib/sql';

export async function POST(req: Request) {
  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: '缺少货号' }, { status: 400 });

  const product = await queryProduct(code);
  return NextResponse.json({ name: product?.name || null });
}