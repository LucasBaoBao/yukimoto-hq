export function calcCommission(netAmount: number) {
  const rate = netAmount <= 2000 ? 0.03 : 0.02;
  const total = +(netAmount * rate).toFixed(2);
  const primaryShare = +(total * 0.7).toFixed(2);
  const groupShare = +(total * 0.3).toFixed(2);
  return { rate, total, primaryShare, groupShare };
}