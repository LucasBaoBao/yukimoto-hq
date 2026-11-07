'use client';

import { useEffect, useState } from 'react';

type Sale = {
  id: string;
  sale_date: string;
  customer_name: string;
  product_code: string;
  product_name: string;
  net_amount: number;
  primary_share: number;
  group_share: number;
  status: string;
  team_members?: { name: string };
};

export default function Commission() {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    fetch('/api/sales')
      .then(r => r.json())
      .then(data => setSales(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const pending = sales.filter(s => s.status === 'pending');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui', background: '#f7f6f3' }}>
      <aside style={{ width: 240, background: '#1e1b2e', color: '#fff', padding: '24px 16px' }}>
        <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: 1, marginBottom: 32 }}>Y YUKIMOTO</div>
        <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 8 }}>WORKSPACE / 内部运营</div>
        <nav style={{ display: 'grid', gap: 4 }}>
          <a href="/" style={nav}>运营总览</a>
          <a href="/sales" style={nav}>销售录入</a>
          <a href="/commission" style={{...nav, background: '#2d2840'}}>佣金审核</a>
          <div style={nav}>SA 轮值</div>
          <div style={nav}>拍摄队列</div>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 32 }}>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>YUKIMOTO / OPERATIONS</div>
        <h1 style={{ fontSize: 32, fontWeight: 500, margin: '0 0 24px' }}>佣金审核</h1>

        {pending.length === 0 ? (
          <p style={{ color: '#666' }}>暂无待审核记录。</p>
        ) : (
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                  <th style={{ padding: 12 }}>日期</th>
                  <th style={{ padding: 12 }}>顾客</th>
                  <th style={{ padding: 12 }}>货号</th>
                  <th style={{ padding: 12 }}>净额</th>
                  <th style={{ padding: 12 }}>主责</th>
                  <th style={{ padding: 12 }}>主责70%</th>
                  <th style={{ padding: 12 }}>Pool30%</th>
                  <th style={{ padding: 12 }}>状态</th>
                </tr>
              </thead>
              <tbody>
                {pending.map(s => (
                  <tr key={s.id} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: 12 }}>{s.sale_date}</td>
                    <td style={{ padding: 12 }}>{s.customer_name}</td>
                    <td style={{ padding: 12 }}>{s.product_code}</td>
                    <td style={{ padding: 12 }}>RM {Number(s.net_amount).toFixed(2)}</td>
                    <td style={{ padding: 12 }}>{s.team_members?.name || '-'}</td>
                    <td style={{ padding: 12 }}>RM {Number(s.primary_share || 0).toFixed(2)}</td>
                    <td style={{ padding: 12 }}>RM {Number(s.group_share || 0).toFixed(2)}</td>
                    <td style={{ padding: 12 }}>{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

const nav = { padding: '10px 12px', borderRadius: 8, textDecoration: 'none', color: '#fff', fontSize: 14, display: 'block' };
