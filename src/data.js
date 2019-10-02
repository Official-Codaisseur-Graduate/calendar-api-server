const checkDate = date => {
  try {
    return new Date(date.trim()) && true
  } catch (error) {
    return false
  }
}

const checkInteger = integer => {
  try {
    return Number.isInteger(integer) && integer > 0
  } catch (error) {
    return false
  }
}

const checkString = (string, minLength, maxLength) => {
  try {
    return typeof string === "string" &&
      (!minLength || string.trim().length >= minLength) &&
      (!maxLength || string.trim().length <= maxLength)
  } catch (error) {
    return false
  }
}

const checkUrl = url => {
  try {
    return new URL(url.trim()) && true
  } catch (error) {
    return false
  }
}

module.exports = { checkDate, checkInteger, checkString, checkUrl }