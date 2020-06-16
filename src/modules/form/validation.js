import isEmail from 'validator/lib/isEmail';


export function email(value) {
  return value && !isEmail(value.trim()) ? 'Invalid email' : null;
}


export function passwords_match(value1, value2) {
  return value1 && value1 !== value2 ? 'Passwords do not match' : null;
}


function isDirty(value) {
  return value || value === 0;
}

export function required(requiredFields, values) {
  return requiredFields.reduce(
    (fields, field) => ({
      ...fields,
      ...(isDirty(values[field]) ? undefined : { [field]: 'Required' }),
    }),
    {},
  );
}