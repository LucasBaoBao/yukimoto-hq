'use client';

import { useEffect, useState } from 'react';

export default function Overview() {
  const [stats, setStats] = useState({ primary: 0, pool: 0, pending: 0 });

  useEffect(() => {
    fetch('/api/sales')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const primary = data.reduce((s: number, x: any) => s + (x.primary_share || 0), 0);
          const pool = data.reduce((s: number, x: any) => s + (x.group_share || 0), 0);
          const pending = data.filter((x: any) => x.status === 'pending').length;
          setStats({ primary, pool, pending });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui', background: '#f7f6f3' }}>
      <aside style={{ width: 240, background: '#1e1b2e', color: '#fff', padding: '24px 16px' }}>
        <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: 1, marginBottom: 32 }}>Y YUKIMOTO</div>
        <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 8 }}>WORKSPACE / 内部运营</div>
        <nav style={{ display: 'grid', gap: 4 }}>
          <a href="/" style={{...nav, background: '#2d2840'}}>运营总览</a>
          <a href="/sales" style={nav}>销售录入</a>
          <a href="/commission" style={nav}>佣金审核</a>
          <div style={nav}>SA 轮值</div>
          <div style={nav}>拍摄队列</div>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 32 }}>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>YUKIMOTO / OPERATIONS</div>
        <h1 style={{ fontSize: 32, fontWeight: 500, margin: '0 0 8px' }}>运营总览</h1>
        <p style={{ color: '#666', marginTop: 0 }}>让每一笔成交，都有清楚的记录。</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 24 }}>
          <div style={card}>
            <div style={{ fontSize: 13, color: '#888' }}>主责佣金合计 (70%)</div>
            <div style={{ fontSize: 28, marginTop: 8 }}>RM {stats.primary.toFixed(2)}</div>
          </div>
          <div style={card}>
            <div style={{ fontSize: 13, color: '#888' }}>Group Pool 合计 (30%)</div>
            <div style={{ fontSize: 28, marginTop: 8 }}>RM {stats.pool.toFixed(2)}</div>
          </div>
          <div style={card}>
            <div style={{ fontSize: 13, color: '#888' }}>待审核记录</div>
            <div style={{ fontSize: 28, marginTop: 8 }}>{stats.pending}</div>
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <a href="/sales" style={{ background: '#1e1b2e', color: '#fff', padding: '12px 20px', borderRadius: 8, textDecoration: 'none' }}>
            录入销售 →
          </a>
        </div>
      </main>
    </div>
  );
}

const nav = { padding: '10px 12px', borderRadius: 8, textDecoration: 'none', color: '#fff', fontSize: 14, display: 'block' };
const card = { background: '#fff', padding: 20, borderRadius: 12 };
