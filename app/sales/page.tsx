'use client';

import { useState, useEffect } from 'react';
import { calcCommission } from '@/lib/commission';

export default function SalesPage() {
  const [members, setMembers] = useState<{id:string; name:string}[]>([]);
  const [form, setForm] = useState({
    channel: 'messenger',
    sale_date: new Date().toISOString().slice(0, 10),
    customer_name: '',
    product_code: '',
    product_name: '',
    net_amount: '',
    primary_member_id: '',
    co_member_ids: [] as string[],
    sql_order_no: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMembers([
      { id: '1', name: 'Carson' },
      { id: '2', name: 'Tong' },
      { id: '3', name: 'Michel' },
      { id: '4', name: 'Xuan' }
    ]);
  }, []);

  useEffect(() => {
    if (form.product_code.length >= 3) {
      fetch('/api/sql/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: form.product_code })
      })
        .then(r => r.json())
        .then(d => setForm(f => ({ ...f, product_name: d.name || '' })))
        .catch(() => {});
    }
  }, [form.product_code]);

  const preview = form.net_amount ? calcCommission(Number(form.net_amount)) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const res = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setMessage('提交成功，已进入待审核');
      setForm(f => ({ ...f, customer_name: '', product_code: '', product_name: '', net_amount: '', notes: '' }));
    } else {
      setMessage(data.error || '提交失败');
    }
  }

  function toggleCoMember(id: string) {
    setForm(f => ({
      ...f,
      co_member_ids: f.co_member_ids.includes(id)
        ? f.co_member_ids.filter(x => x !== id)
        : [...f.co_member_ids, id]
    }));
  }

  return (
    <div style={{ maxWidth: 640, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h1>销售录入</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>渠道
          <select value={form.channel} onChange={e => setForm({...form, channel: e.target.value})}>
            <option value="messenger">Messenger</option>
            <option value="retail">Retail</option>
            <option value="live">Live</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label>日期
          <input type="date" value={form.sale_date} onChange={e => setForm({...form, sale_date: e.target.value})} />
        </label>

        <label>顾客姓名
          <input value={form.customer_name} onChange={e => setForm({...form, customer_name: e.target.value})} required />
        </label>

        <label>货号
          <input value={form.product_code} onChange={e => setForm({...form, product_code: e.target.value})} required />
        </label>

        <label>商品名
          <input value={form.product_name} readOnly placeholder="输入货号后自动带出" />
        </label>

        <label>净销售额 (RM)
          <input type="number" step="0.01" value={form.net_amount} onChange={e => setForm({...form, net_amount: e.target.value})} required />
        </label>

        {preview && (
          <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 8 }}>
            <div>费率：{(preview.rate * 100).toFixed(0)}%</div>
            <div>总佣金池：RM {preview.total.toFixed(2)}</div>
            <div>主责 (70%)：RM {preview.primaryShare.toFixed(2)}</div>
            <div>Group Pool (30%)：RM {preview.groupShare.toFixed(2)}</div>
          </div>
        )}

        <label>主责成员（拿 70%）
          <select value={form.primary_member_id} onChange={e => setForm({...form, primary_member_id: e.target.value})} required>
            <option value="">请选择</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </label>

        <div>
          <div>共同成交成员（参与月底 Pool）</div>
          {members.map(m => (
            <label key={m.id} style={{ marginRight: 12 }}>
              <input
                type="checkbox"
                checked={form.co_member_ids.includes(m.id)}
                onChange={() => toggleCoMember(m.id)}
              /> {m.name}
            </label>
          ))}
        </div>

        <label>SQL 单号 / Invoice
          <input value={form.sql_order_no} onChange={e => setForm({...form, sql_order_no: e.target.value})} />
        </label>

        <label>备注
          <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? '提交中...' : '提交审核'}
        </button>
      </form>

      {message && <p style={{ marginTop: 16 }}>{message}</p>}
    </div>
  );
}