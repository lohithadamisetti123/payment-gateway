const ALPHANUM = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateOrderId(): string {
  return 'order_' + generateRandomString(16);
}

export function generatePaymentId(): string {
  return 'pay_' + generateRandomString(16);
}

function generateRandomString(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += ALPHANUM.charAt(Math.floor(Math.random() * ALPHANUM.length));
  }
  return result;
}
