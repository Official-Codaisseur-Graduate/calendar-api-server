const checkDate = date => {
  try {
    return new Date(date) && true
  } catch (error) {
    return false
  }
}

const checkEmail = email => {
  try {
    return typeof email === "string" &&
      email.indexOf("@") > 0 && email.indexOf("@") < email.length - 1
  } catch (error) {
    return false
  }
}

// minValue and maxValue are optional parameters.
const checkInteger = (integer, minValue, maxValue) => {
  try {
    return Number.isInteger(integer) &&
      (!minValue || integer >= minValue) &&
      (!maxValue || integer <= maxValue)
  } catch (error) {
    return false
  }
}

// minLength and maxLength are optional parameters.
const checkString = (string, minLength, maxLength) => {
  try {
    return typeof string === "string" &&
      (!minLength || string.length >= minLength) &&
      (!maxLength || string.length <= maxLength)
  } catch (error) {
    return false
  }
}

const checkUrl = url => {
  try {
    return new URL(url) && true
  } catch (error) {
    return false
  }
}

module.exports = {
  checkDate,
  checkEmail,
  checkInteger,
  checkString,
  checkUrl,
}