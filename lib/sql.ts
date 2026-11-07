const SQL_HOST = process.env.SQL_API_URL || 'https://0647a4fe3574486cdf3df1b21f022d71.sql.my';
const SQL_ACCESS = process.env.SQL_ACCESS_KEY || 'APIUSER';
const SQL_SECRET = process.env.SQL_SECRET_KEY || '4e0fe4f1df907f8e5ae17e3af8c3094f68f12d292d761e3efc88f306fc40e554';

export async function queryProduct(code: string) {
  try {
    const res = await fetch(`${SQL_HOST}/stockitem?code=${encodeURIComponent(code)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SQL_SECRET}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) return { name: null };
    const data = await res.json();
    const item = Array.isArray(data) ? data[0] : data;
    return { name: item?.name || item?.Description || item?.productName || null };
  } catch {
    return { name: null };
  }
}
