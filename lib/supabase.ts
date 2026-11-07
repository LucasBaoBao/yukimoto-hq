import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 构建时如果还是占位符，返回一个空客户端，避免 build 失败
export const supabase = (url && key && !url.includes('placeholder'))
  ? createClient(url, key)
  : null as any;
