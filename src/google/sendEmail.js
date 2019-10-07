const baseUrl = process.env.BASEURL || "http://localhost:3000"
const nodemailer = require('nodemailer')

const sendEmail = async (gmail, email, subject, text, html) => {
  try {

    const mail = `Content-Type: text/plain; charset="UTF-8"\n` +
      `MIME-Version: 1.0\n` +
      `Content-Transfer-Encoding: 7bit\n` +
      `to: ${email}\n` +
      `subject: ${subject}\n\n` +
      text

    const buffedMail = Buffer.from(mail)

    const encodedMail = buffedMail.toString("base64")
      .replace(/\+/g, '-').replace(/\//g, '_')

    gmail.users.messages.send({
      userId: 'me',
      resource: {
        raw: encodedMail,
      }
    },

      (error, result) => {
        if (error) {
          console.error(error)
        }

        console.log("GOOD!")
      }
    )

  } catch (error) {
    console.error(error)
    return res.status(500).send({
      message: "Internal server error.",
    })
  }

  // let smtpTransport = await nodemailer.createTransport({
  //   service: "Gmail",
  //   auth: {
  //     user: "thelscalendar@gmail.com",
  //     pass: "=2*DeeFNzG@J@j2%"
  //   }
  // });
  // let mailOptions

  // mailOptions = {
  //   to: email,
  //   subject: title,
  //   text: bodyText,
  //   html: bodyHtml,
  // }

  // await smtpTransport.sendMail(mailOptions, function (error, response) {
  //   if (error) {
  //     console.log(error);

  //   } else {
  //     console.log("Message sent:");

  //   }
  // })
}

const sendRegisterEmail = async (gmail, email, code) => {
  try {
    const subject = `Codaisseur Calendar account registration.`
    const text = `Hello,\n\n` +
      `A new account has been registered with email address: ` +
      `${email}\n\n` +
      `You can continue the registration process at: ` +
      `${baseUrl}/validate/${code}\n\n` +
      `Thank you for registering.`
    const html = `<h3>Hello,</h3>
    <p>A new account has been registered with email address:</p>
    <p>${email}</p>
    <p>You can continue the registration process at: </p>
    <a href="${baseUrl}/validate/${code}">Click here to verify your mail</a>
    <p>Thank you for registering.</p>`
    await sendEmail(gmail, email, subject, text, html)


  } catch (error) {
    console.error(error)
    return res.status(500).send({
      message: "Internal server error.",
    })
  }
}

const alreadyRegisteredEmail = async (gmail, email) => {
  const subject = `Codaisseur Calendar account registration.`
  const text = `Hello,\n\n` +
    `An attempt was made to register a new account with ` +
    `email address: ${email}\n\n` +
    `However, an account with this email address already exist.` +
    `If you have forgotten your password, you can reset your ` +
    `password at: ${baseUrl}/resetpassword\n\n`
  const html = `<p>${text}</p>`
  await sendEmail(gmail, email, subject, text, html)
}

module.exports = {
  sendRegisterEmail,
  alreadyRegisteredEmail,
}