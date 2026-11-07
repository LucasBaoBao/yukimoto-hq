'use client';

import { useState, useEffect } from 'react';

function calc(net: number) {
  if (!net || net <= 0) return null;
  const rate = net <= 2000 ? 0.03 : 0.02;
  const total = +(net * rate).toFixed(2);
  const primary = +(total * 0.7).toFixed(2);
  const pool = +(total * 0.3).toFixed(2);
  return { rate, total, primary, pool };
}

const MEMBERS = ['Carson', 'Tong', 'Michel', 'Xuan', 'Ceci', 'Angle'];

export default function SalesRegister() {
  const [form, setForm] = useState({
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
  });
  const [message, setMessage] = useState('');
  const [loadingName, setLoadingName] = useState(false);

  const c = form.amount ? calc(Number(form.amount)) : null;

  useEffect(() => {
    if (form.code.length >= 4) {
      setLoadingName(true);
      fetch('/api/sql/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: form.code })
      })
        .then(r => r.json())
        .then(d => {
          if (d.name) setForm(f => ({ ...f, name: d.name }));
          setLoadingName(false);
        })
        .catch(() => setLoadingName(false));
    }
  }, [form.code]);

  function toggleCo(name: string) {
    setForm(f => ({
      ...f,
      co: f.co.includes(name) ? f.co.filter(x => x !== name) : [...f.co, name]
    }));
  }

  function submit() {
    if (!form.customer || !form.code || !form.amount || !form.primary) {
      setMessage('请填写顾客、货号、净额和主责');
      return;
    }
    setMessage('已提交（演示）。主责 ' + c?.primary + ' / Pool ' + c?.pool);
    setForm(f => ({ ...f, customer: '', code: '', name: '', amount: '', notes: '' }));
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui', background: '#f7f6f3' }}>
      <aside style={{ width: 240, background: '#1e1b2e', color: '#fff', padding: '24px 16px' }}>
        <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: 1, marginBottom: 32 }}>Y YUKIMOTO</div>
        <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 8 }}>WORKSPACE / 内部运营</div>
        <nav style={{ display: 'grid', gap: 4 }}>
          <a href="/" style={nav}>运营总览</a>
          <a href="/sales" style={{...nav, background: '#2d2840'}}>销售录入</a>
          <div style={nav}>SA 轮值</div>
          <div style={nav}>拍摄队列</div>
          <div style={nav}>佣金审核</div>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 32 }}>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>YUKIMOTO / OPERATIONS</div>
        <h1 style={{ fontSize: 32, fontWeight: 500, margin: '0 0 24px' }}>销售录入</h1>

        <div style={{ background: '#fff', borderRadius: 12, padding: 24, maxWidth: 720 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <label>日期<input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={inp} /></label>
            <label>渠道
              <select value={form.channel} onChange={e => setForm({...form, channel: e.target.value})} style={inp}>
                <option>Messenger</option><option>Retail</option><option>Live</option><option>Other</option>
              </select>
            </label>
            <label>顾客姓名<input value={form.customer} onChange={e => setForm({...form, customer: e.target.value})} style={inp} /></label>
            <label>货号<input value={form.code} onChange={e => setForm({...form, code: e.target.value})} style={inp} placeholder="A00222" /></label>
            <label style={{ gridColumn: '1 / -1' }}>
              商品名 {loadingName && <span style={{ fontSize: 12, color: '#888' }}>查询中...</span>}
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inp} placeholder="输入货号后自动带出" />
            </label>
            <label>净销售额 (RM)<input type="number" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} style={inp} /></label>
            <label>主责成员
              <select value={form.primary} onChange={e => setForm({...form, primary: e.target.value})} style={inp}>
                <option value="">请选择</option>
                {MEMBERS.map(m => <option key={m}>{m}</option>)}
              </select>
            </label>
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, marginBottom: 8 }}>共同成交成员（参与月底 Pool）</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {MEMBERS.map(m => (
                <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                  <input type="checkbox" checked={form.co.includes(m)} onChange={() => toggleCo(m)} /> {m}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
            <label>SQL 单号 / Invoice<input value={form.order} onChange={e => setForm({...form, order: e.target.value})} style={inp} /></label>
            <label>备注<input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} style={inp} /></label>
          </div>

          {c && (
            <div style={{ marginTop: 20, background: '#f7f6f3', padding: 16, borderRadius: 8, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              <div><div style={{ fontSize: 12, color: '#888' }}>总佣金池</div><div style={{ fontSize: 20 }}>RM {c.total.toFixed(2)}</div></div>
              <div><div style={{ fontSize: 12, color: '#888' }}>主责 70%</div><div style={{ fontSize: 20 }}>RM {c.primary.toFixed(2)}</div></div>
              <div><div style={{ fontSize: 12, color: '#888' }}>Group Pool 30%</div><div style={{ fontSize: 20 }}>RM {c.pool.toFixed(2)}</div></div>
            </div>
          )}

          <button onClick={submit} style={{ marginTop: 24, background: '#1e1b2e', color: '#fff', border: 0, padding: '12px 24px', borderRadius: 8, cursor: 'pointer' }}>
            提交销售
          </button>
          {message && <p style={{ marginTop: 12, color: '#444' }}>{message}</p>}
        </div>
      </main>
    </div>
  );
}

const nav = { padding: '10px 12px', borderRadius: 8, textDecoration: 'none', color: '#fff', fontSize: 14, display: 'block' };
const inp = { width: '100%', padding: '8px 10px', border: '1px solid #e5e5e5', borderRadius: 6, fontSize: 14, marginTop: 4 };
