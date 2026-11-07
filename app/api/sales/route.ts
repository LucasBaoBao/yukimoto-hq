import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calcCommission } from '@/lib/commission';

export async function POST(req: Request) {
  const body = await req.json();
  const {
    channel, sale_date, customer_name, product_code, product_name,
    net_amount, primary_member_id, co_member_ids = [], sql_order_no, notes
  } = body;

  if (!primary_member_id || !product_code || !net_amount) {
    return NextResponse.json({ error: '缺少必填字段' }, { status: 400 });
  }

  const amount = Number(net_amount);
  const { rate, total, primaryShare, groupShare } = calcCommission(amount);

  const { data: sale, error } = await supabase.from('sales').insert({
    channel,
    sale_date,
    customer_name,
    product_code,
    product_name,
    net_amount: amount,
    primary_member_id,
    sql_order_no,
    notes,
    rate,
    total_commission: total,
    primary_share: primaryShare,
    group_share: groupShare,
    status: 'pending'
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (co_member_ids.length > 0) {
    await supabase.from('sale_co_members').insert(
      co_member_ids.map((id: string) => ({ sale_id: sale.id, member_id: id }))
    );
  }

  return NextResponse.json(sale);
}

export async function GET() {
  const { data, error } = await supabase
    .from('sales')
    .select('*, team_members!primary_member_id(name)')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}