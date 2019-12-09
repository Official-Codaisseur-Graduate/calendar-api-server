const characters = 'abcdefghijklmnopqrstuvwxyz346789';
const length = 32;

const randomCode = () => {
  const characterArray = characters.split('');
  const characterLength = characterArray.length;
  let code = '';
  while (code.length < length) {
    code += characterArray[Math.floor(Math.random() * characterLength)];
  }
  return code;
};

module.exports = randomCode;
