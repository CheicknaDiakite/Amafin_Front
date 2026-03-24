function isNumber(value?: any) {
  return new RegExp('^(?=.*[0-9]).+$').test(value);
}

function isLowercaseChar(value?: any) {
  return new RegExp('^(?=.*[a-z]).+$').test(value);
}

function isUppercaseChar(value?: any) {
  return new RegExp('^(?=.*[A-Z]).+$').test(value);
}

function isSpecialChar(value?: any) {
  return new RegExp('^(?=.*[-+_!@#$%^&*.,?]).+$').test(value);
}

function minLength(value?: any) {
  return value.length > 7;
}

export { isNumber, isLowercaseChar, isUppercaseChar, isSpecialChar, minLength };
