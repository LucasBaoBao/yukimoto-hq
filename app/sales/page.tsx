'use client';

import { useState } from 'react';

function calc(net: number) {
  const rate = net <= 2000 ? 0.03 : 0.02;
  const total = +(net * rate).toFixed(2);
  const primary = +(total * 0.7).toFixed(2);
  const pool = +(total * 0.3).toFixed(2);
  return { rate, total, primary, pool };
}

const MEMBERS = ['Carson', 'Tong', 'Michel', 'Xuan', 'Ceci', 'Angle'];

export default function SalesForm() {
  const [rows, setRows] = useState([
    {
      date: new Date().toISOString().slice(0, 10),
      channel: 'Messenger',
      customer: '',
      code: '',
      name: '',
      amount: '',
      primary: '',
      co: [] as string[],
      order: '',
      notes: ''
    }
  ]);

  const update = (i: number, field: string, value: any) => {
    const next = [...rows];
    next[i] = { ...next[i], [field]: value };
    setRows(next);
  };

  const addRow = () => {
    setRows([...rows, {
      date: new Date().toISOString().slice(0, 10),
      channel: 'Messenger',
      customer: '',
      code: '',
      name: '',
      amount: '',
      primary: '',
      co: [],
      order: '',
      notes: ''
    }]);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'system-ui', background: '#fafafa', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: 8 }}>销售录入</h1>
      <p style={{ color: '#666', marginTop: 0 }}>填完自动计算 70/30，提交后可导出或保存</p>

      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
              <th style={th}>日期</th>
              <th style={th}>渠道</th>
              <th style={th}>顾客</th>
              <th style={th}>货号</th>
              <th style={th}>商品名</th>
              <th style={th}>净额</th>
              <th style={th}>主责</th>
              <th style={th}>共同成交</th>
              <th style={th}>总佣金</th>
              <th style={th}>主责70%</th>
              <th style={th}>Pool30%</th>
              <th style={th}>单号</th>
              <th style={th}>备注</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const c = r.amount ? calc(Number(r.amount)) : null;
              return (
                <tr key={i} style={{ borderTop: '1px solid #eee' }}>
                  <td style={td}><input type="date" value={r.date} onChange={e => update(i, 'date', e.target.value)} style={inp} /></td>
                  <td style={td}>
                    <select value={r.channel} onChange={e => update(i, 'channel', e.target.value)} style={inp}>
                      <option>Messenger</option>
                      <option>Retail</option>
                      <option>Live</option>
                      <option>Other</option>
                    </select>
                  </td>
                  <td style={td}><input value={r.customer} onChange={e => update(i, 'customer', e.target.value)} style={inp} /></td>
                  <td style={td}><input value={r.code} onChange={e => update(i, 'code', e.target.value)} style={inp} placeholder="A00222" /></td>
                  <td style={td}><input value={r.name} onChange={e => update(i, 'name', e.target.value)} style={inp} placeholder="自动或手填" /></td>
                  <td style={td}><input type="number" step="0.01" value={r.amount} onChange={e => update(i, 'amount', e.target.value)} style={inp} /></td>
                  <td style={td}>
                    <select value={r.primary} onChange={e => update(i, 'primary', e.target.value)} style={inp}>
                      <option value="">选择</option>
                      {MEMBERS.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </td>
                  <td style={td}>
                    <select multiple value={r.co} onChange={e => update(i, 'co', Array.from(e.target.selectedOptions, o => o.value))} style={{...inp, height: 32}}>
                      {MEMBERS.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </td>
                  <td style={td}>{c ? c.total.toFixed(2) : '-'}</td>
                  <td style={td}>{c ? c.primary.toFixed(2) : '-'}</td>
                  <td style={td}>{c ? c.pool.toFixed(2) : '-'}</td>
                  <td style={td}><input value={r.order} onChange={e => update(i, 'order', e.target.value)} style={inp} /></td>
                  <td style={td}><input value={r.notes} onChange={e => update(i, 'notes', e.target.value)} style={inp} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button onClick={addRow} style={btn}>+ 加一行</button>
        <button onClick={() => alert('已计算完成（可再接保存）')} style={{...btn, background: '#111', color: '#fff'}}>提交</button>
      </div>
    </div>
  );
}

const th = { padding: '10px 8px', fontWeight: 600, whiteSpace: 'nowrap' as const };
const td = { padding: '6px 8px' };
const inp = { width: '100%', border: '1px solid #ddd', borderRadius: 4, padding: '4px 6px', fontSize: 13 };
const btn = { padding: '8px 16px', borderRadius: 6, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' };
