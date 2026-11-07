'use client';

import { useEffect, useState } from 'react';

type Sale = {
  id: string;
  channel: string;
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

export default function DashboardPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sales')
      .then(r => r.json())
      .then(data => {
        setSales(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalPrimary = sales.reduce((s, x) => s + (x.primary_share || 0), 0);
  const totalGroup = sales.reduce((s, x) => s + (x.group_share || 0), 0);
  const pending = sales.filter(s => s.status === 'pending').length;

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto', fontFamily: 'system-ui', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>YUKIMOTO AI Headquarters</h1>
        <a href="/sales" style={{ padding: '8px 16px', background: '#111', color: '#fff', textDecoration: 'none', borderRadius: 6 }}>
          + 新增销售
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, margin: '24px 0' }}>
        <div style={{ background: '#f8f8f8', padding: 16, borderRadius: 8 }}>
          <div style={{ fontSize: 13, color: '#666' }}>主责佣金合计 (70%)</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>RM {totalPrimary.toFixed(2)}</div>
        </div>
        <div style={{ background: '#f8f8f8', padding: 16, borderRadius: 8 }}>
          <div style={{ fontSize: 13, color: '#666' }}>Group Pool 合计 (30%)</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>RM {totalGroup.toFixed(2)}</div>
        </div>
        <div style={{ background: '#f8f8f8', padding: 16, borderRadius: 8 }}>
          <div style={{ fontSize: 13, color: '#666' }}>待审核</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>{pending}</div>
        </div>
      </div>

      <h2>最近销售</h2>
      {loading ? (
        <p>加载中...</p>
      ) : sales.length === 0 ? (
        <p>暂无数据，先去新增一笔销售。</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
              <th style={{ padding: 8 }}>日期</th>
              <th style={{ padding: 8 }}>顾客</th>
              <th style={{ padding: 8 }}>货号 / 商品</th>
              <th style={{ padding: 8 }}>净额</th>
              <th style={{ padding: 8 }}>主责</th>
              <th style={{ padding: 8 }}>主责佣金</th>
              <th style={{ padding: 8 }}>状态</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 8 }}>{s.sale_date}</td>
                <td style={{ padding: 8 }}>{s.customer_name}</td>
                <td style={{ padding: 8 }}>{s.product_code}<br /><span style={{ color: '#666' }}>{s.product_name}</span></td>
                <td style={{ padding: 8 }}>RM {Number(s.net_amount).toFixed(2)}</td>
                <td style={{ padding: 8 }}>{s.team_members?.name || '-'}</td>
                <td style={{ padding: 8 }}>RM {Number(s.primary_share || 0).toFixed(2)}</td>
                <td style={{ padding: 8 }}>{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}