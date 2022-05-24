export const convertToTitleCase = function (str: string) {
  console.log(
    `reached:  ${str[0].toUpperCase()}${str.substring(1).toLowerCase()}`
  );
  return `${str[0].toUpperCase()}${str.substring(1).toLowerCase()}`;
};
