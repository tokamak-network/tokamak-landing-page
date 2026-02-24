/** Parse a display-formatted number string (e.g. "+3,939,114") into a plain number. */
export function parseNum(s: string): number {
  return parseInt(s.replace(/[^0-9-]/g, ""), 10) || 0;
}

export const formatNumber = (num?: number | string): string => {
  if (!num) return "";
  return num.toLocaleString("en-US");
};

/** Validate a CSS hex color string. Returns the color if valid, fallback otherwise. */
export function sanitizeColor(color: string, fallback = "#888"): string {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(color) ? color : fallback;
}

export const formatCurrencyString = (value?: number | string): string => {
  if (!value) return "";
  // 숫자 타입인 경우 바로 포맷팅
  if (typeof value === "number") {
    return formatNumber(value);
  }

  // 문자열인 경우 숫자만 추출하여 포맷팅
  const number = value.match(/\d+\.?\d*/)?.[0];
  if (!number) return value;

  return value.replace(number, formatNumber(parseFloat(number)));
};

export const formatInteger = (num?: number): string => {
  if (num === undefined) return "-";
  // 소수점 둘째자리까지 반올림
  const roundedNum = Number(num.toFixed(2));

  const [integerPart, decimalPart] = roundedNum.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // 소수부가 있으면 .xx 형태로, 없으면 정수부만
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};
