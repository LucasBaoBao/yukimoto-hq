// 占位：请按你们实际的 SQL Accounting API 替换
export async function queryProduct(code: string) {
  const url = process.env.SQL_API_URL;
  const accessKey = process.env.SQL_ACCESS_KEY;
  const secretKey = process.env.SQL_SECRET_KEY;

  if (!url || !accessKey) {
    // 开发时返回模拟数据
    return { name: `模拟商品 - ${code}` };
  }

  // TODO: 按实际 API 文档调用
  // const res = await fetch(`${url}/product?code=${code}`, { headers: { ... } });
  // return res.json();

  return { name: null };
}