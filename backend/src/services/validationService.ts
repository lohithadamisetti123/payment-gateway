export function isValidVPA(vpa: string): boolean {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
  return regex.test(vpa);
}

export function isValidCardNumberLuhn(raw: string): boolean {
  const num = raw.replace(/[\s-]/g, '');
  if (!/^\d{13,19}$/.test(num)) return false;

  let sum = 0;
  let shouldDouble = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export function detectCardNetwork(raw: string): string {
  const num = raw.replace(/[\s-]/g, '');
  if (num.startsWith('4')) return 'visa';
  const two = num.slice(0, 2);
  if (['51', '52', '53', '54', '55'].includes(two)) return 'mastercard';
  if (['34', '37'].includes(two)) return 'amex';
  const twoNum = parseInt(two, 10);
  if (['60', '65'].includes(two) || (twoNum >= 81 && twoNum <= 89)) return 'rupay';
  return 'unknown';
}

export function isExpiryValid(monthStr: string, yearStr: string): boolean {
  const month = parseInt(monthStr, 10);
  if (month < 1 || month > 12) return false;

  let year = parseInt(yearStr, 10);
  if (yearStr.length === 2) {
    year = 2000 + year;
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
}
