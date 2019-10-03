const baseUrl = "http://localhost:3000"

const sendEmail = async (email, title, body) => {
  console.log("I'm being asked to send the following email,",
    "but I don't know how to do that!",
    "\nTo:", email, "\nTitle:", title, "\nBody:", body)
}

const sendRegisterEmail = async (email, code) => {
  const title = `Codaisseur Calendar account registration.`
  const body = `Hello,\n\n` +
    `A new account has been registered with email address: ` +
    `${email}\n\n` +
    `You can continue the registration process at: ` +
    `${baseUrl}/validate/${code}\n\n` +
    `Thank you for registering.`
  await sendEmail(email, title, body)
}

const AlreadyRegisteredEmail = async (email) => {
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
  AlreadyRegisteredEmail,
}