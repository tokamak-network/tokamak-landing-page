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

export const formatInteger = (num: number): string => {
  // 소수점 둘째자리까지 반올림
  const roundedNum = Number(num.toFixed(2));

  const [integerPart, decimalPart] = roundedNum.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // 소수부가 있으면 .xx 형태로, 없으면 정수부만
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};
