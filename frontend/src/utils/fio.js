export const cleanFIOInput = (value) => (
  value
    .replace(/[^A-Za-zА-Яа-яЁё\s-]/g, '')
    .replace(/\s+/g, ' ')
);

export const normalizeFIO = (value) => cleanFIOInput(value).trim();

export const validateFIO = (fio) => {
  const fioRegex = /^[A-Za-zА-Яа-яЁё\s-]{2,100}$/;
  return fioRegex.test(normalizeFIO(fio));
};
