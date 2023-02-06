const { nameSchema } = require('./schemas');

module.exports = (data) => {
  const { error } = nameSchema.validate(data);
  if (error && error.details[0].type === 'string.base') {
    return { type: 'BAD_REQUEST_STATUS', message: error.details[0].message };
  }
  if (error && error.details[0].type === 'string.min') {
    return { type: 'UNPROCESSABLE_ENTITY', message: error.details[0].message };
  }
  return { type: null, message: '' };
};