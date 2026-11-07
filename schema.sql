-- 团队成员
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text check (role in ('member','manager','admin')) default 'member',
  email text unique,
  active boolean default true,
  created_at timestamptz default now()
);

-- 销售记录
create table if not exists sales (
  id uuid primary key default gen_random_uuid(),
  channel text not null,
  sale_date date not null default current_date,
  customer_name text not null,
  sql_customer_id text,
  product_code text not null,
  product_name text,
  net_amount numeric(12,2) not null,
  primary_member_id uuid not null references team_members(id),
  sql_order_no text,
  notes text,
  status text not null default 'pending' check (status in ('draft','pending','approved','rejected')),
  rate numeric(5,4),
  total_commission numeric(12,2),
  primary_share numeric(12,2),
  group_share numeric(12,2),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 共同成交成员
create table if not exists sale_co_members (
  sale_id uuid references sales(id) on delete cascade,
  member_id uuid references team_members(id),
  primary key (sale_id, member_id)
);

-- 示例成员数据（可删）
insert into team_members (name, role) values
  ('Carson', 'member'),
  ('Tong', 'member'),
  ('Michel', 'member'),
  ('Xuan', 'member')
on conflict do nothing;