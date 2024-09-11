/**
 *
 * @param params string
 * @returns datetime string in ISO format if valid date or the same string otherwise
 */
export const transformToISODateTime = (params: { value: string }) => {
  const regex = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
  const { value } = params;
  if (regex.test(value)) {
    return new Date(value).toISOString();
  }

  return value;
};

/**
 *
 * @param obj string
 * @returns return true if obj is empty object ({}), empty array ([]), or empty string
 */
export const isEmptyList = (obj: object | Array<any> | string) => {
  return ['', '[]', '{}'].includes(JSON.stringify(obj));
};
