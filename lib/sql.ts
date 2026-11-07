import crypto from 'crypto';

const SQL_HOST = process.env.SQL_API_URL || 'https://api.sql.my';
const ACCESS_KEY = process.env.SQL_ACCESS_KEY || 'APIUSER';
const SECRET_KEY = process.env.SQL_SECRET_KEY || '4e0fe4f1df907f8e5ae17e3af8c3094f68f12d292d761e3efc88f306fc40e554';
const REGION = 'ap-southeast-1';
const SERVICE = 'execute-api';

function sign(method: string, path: string, query: string = '') {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);

  const canonicalUri = path;
  const canonicalQuerystring = query;
  const canonicalHeaders = `host:${new URL(SQL_HOST).host}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'host;x-amz-date';
  const payloadHash = crypto.createHash('sha256').update('').digest('hex');

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQuerystring,
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join('\n');

  const credentialScope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex')
  ].join('\n');

  const kDate = crypto.createHmac('sha256', `AWS4${SECRET_KEY}`).update(dateStamp).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update(REGION).digest();
  const kService = crypto.createHmac('sha256', kRegion).update(SERVICE).digest();
  const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

  const authorization = `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return {
    Authorization: authorization,
    'x-amz-date': amzDate,
    'Content-Type': 'application/json'
  };
}

export async function queryProduct(code: string) {
  try {
    const path = '/stockitem';
    const query = `code=${encodeURIComponent(code)}`;
    const headers = sign('GET', path, query);

    const res = await fetch(`${SQL_HOST}${path}?${query}`, { headers });

    if (!res.ok) return { name: null };
    const data = await res.json();
    const item = Array.isArray(data) ? data[0] : (data.items?.[0] || data);
    return { name: item?.description || item?.name || item?.Description || null };
  } catch {
    return { name: null };
  }
}
