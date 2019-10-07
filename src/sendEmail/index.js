const baseUrl = process.env.BASEURL || "http://localhost:3000"

const sendEmail = async (transport, to, subject, text, html) => {

  await transport.sendMail({ to, subject, text, html },
    function (error, result) {
      if (error) {
        console.error(error)
        throw "An error occurred trying to send an email."
      }
    }
  )
}

const sendRegisterEmail = async (transport, to, validation) => {
  const subject = `Codaisseur Calendar account registration.`

  const text = `Hello,

    A new account has been registered with email address:
    ${to}

    To continue the registration process, follow the link below:
    ${baseUrl}/validate/${validation}

    Thank you for registering.`

  const html = `<h3>Hello,</h3>

    <p>A new account has been registered with email address:</p>
    <p>${to}</p>

    <p>To continue the registration process, follow the link below:</p>
    <a href="${baseUrl}/validate/${validation}">Continue registration</a>
      
    <p>Thank you for registering.</p>`

  await sendEmail(transport, to, subject, text, html)
}

const alreadyRegisteredEmail = async (transport, to) => {
  const subject = `Codaisseur Calendar account registration.`

  const text = `Hello,

    An attempt was made to register an account with email address:
    ${to}

    However, an account with this email address already exists.

    If you have forgotten your password, reset it with the link below:
    ${baseUrl}/resetpassword

    Thank you.`

  const html = `<h3>Hello,</h3>

    <p>An attempt was made to register an account with email address:</p>
    <p>${to}</p>

    <p>However, an account with this email address already exists.</p>

    <p>If you forgot your password, reset it with the link below:</p>
    <a href="${baseUrl}/resetpassword">Reset your password</a>
  
    <p>Thank you.</p>`

  await sendEmail(transport, to, subject, text, html)
}

module.exports = {
  sendRegisterEmail,
  alreadyRegisteredEmail,
}