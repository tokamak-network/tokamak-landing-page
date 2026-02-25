/** Parse a display-formatted number string (e.g. "+3,939,114", "+4.9M") into a plain number. */
export function parseNum(s: string): number {
  if (typeof s !== "string" || !s) return 0;
  const cleaned = s.trim().replace(/,/g, "");
  const value = parseFloat(cleaned);
  if (isNaN(value)) return 0;
  const lastChar = cleaned.slice(-1).toUpperCase();
  if (lastChar === "B") return Math.round(value * 1_000_000_000);
  if (lastChar === "M") return Math.round(value * 1_000_000);
  if (lastChar === "K") return Math.round(value * 1_000);
  return Math.round(value);
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
