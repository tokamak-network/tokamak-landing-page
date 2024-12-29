export const formatNumber = (num: number | string): string => {
  return num.toLocaleString("en-US");
};

export const formatCurrencyString = (value: number | string): string => {
  // 숫자 타입인 경우 바로 포맷팅
  if (typeof value === "number") {
    return formatNumber(value);
  }

  // 문자열인 경우 숫자만 추출하여 포맷팅
  const number = value.match(/\d+\.?\d*/)?.[0];
  if (!number) return value;

  return value.replace(number, formatNumber(parseFloat(number)));
};
