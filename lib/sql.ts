const SQL_BASE = process.env.SQL_API_URL || 'https://0647a4fe3574486cdf3df1b21f022d71.sql.my/HQ_READONLY';
const SQL_KEY = process.env.SQL_API_KEY || '8aef04a65a313f3f2662105f7d6c47e1688962a14abbdfe0754c8d568f5e08dd';

export async function queryProduct(code: string) {
  try {
    const res = await fetch(`${SQL_BASE}/api/product?code=${encodeURIComponent(code)}`, {
      headers: {
        'Authorization': `Bearer ${SQL_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) return { name: null };
    const data = await res.json();
    return { name: data.name || data.productName || data.Description || null };
  } catch {
    return { name: null };
  }
}
