const checkEmail = email => {
  try {
    return (
      typeof email === 'string' && email.indexOf('@') > 0 && email.indexOf('@') < email.length - 1
    );
  } catch (error) {
    return false;
  }
};

// minValue and maxValue are optional parameters.
const checkInteger = (integer, minValue, maxValue) => {
  try {
    return (
      Number.isInteger(integer) &&
      (!minValue || integer >= minValue) &&
      (!maxValue || integer <= maxValue)
    );
  } catch (error) {
    return false;
  }
};

// minLength and maxLength are optional parameters.
const checkString = (string, minLength, maxLength) => {
  try {
    return (
      typeof string === 'string' &&
      (!minLength || string.length >= minLength) &&
      (!maxLength || string.length <= maxLength)
    );
  } catch (error) {
    return false;
  }
};

const checkPrivateKey = string => {
  try {
    const start = string.includes('BEGIN PRIVATE KEY');
    const end = string.includes('END PRIVATE KEY');
    if (start && end) {
      return true;
    }
  } catch (error) {
    return false;
  }
};

module.exports = {
  checkEmail,
  checkInteger,
  checkString,
  checkPrivateKey
};
