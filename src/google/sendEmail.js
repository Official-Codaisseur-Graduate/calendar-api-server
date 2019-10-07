const baseUrl = process.env.BASEURL || "http://localhost:3000"
const nodemailer = require('nodemailer')

const sendEmail = async (email, title, bodyText, bodyHtml) => {

  let smtpTransport = await nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "thelscalendar@gmail.com",
      pass: "=2*DeeFNzG@J@j2%"
    }
  });
  let mailOptions

  mailOptions = {
    to: email,
    subject: title,
    text: bodyText,
    html: bodyHtml,
  }

  await smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);

    } else {
      console.log("Message sent:");

    }
  })
}

const sendRegisterEmail = async (email, code) => {
  const title = `Codaisseur Calendar account registration.`
  const bodyText = `Hello,\n\n` +
    `A new account has been registered with email address: ` +
    `${email}\n\n` +
    `You can continue the registration process at: ` +
    `${baseUrl}/validate/${code}\n\n` +
    `Thank you for registering.`
  const bodyHtml = `<h3>Hello,</h3>
    <p>A new account has been registered with email address:</p>
    <p>${email}</p>
    <p>You can continue the registration process at: </p>
    <a href="${baseUrl}/validate/${code}">Click here to verify your mail</a>
    <p>Thank you for registering.</p>`
  await sendEmail(email, title, bodyText, bodyHtml)
}

const alreadyRegisteredEmail = async (email) => {
  const title = `Codaisseur Calendar account registration.`
  const body = `Hello,\n\n` +
    `An attempt was made to register a new account with ` +
    `email address: ${email}\n\n` +
    `However, an account with this email address already exist.` +
    `If you have forgotten your password, you can reset your ` +
    `password at: ${baseUrl}/resetpassword\n\n`
  await sendEmail(email, title, body)
}

module.exports = {
  sendRegisterEmail,
  alreadyRegisteredEmail,
}