const baseUrl = process.env.BASEURL || 'http://localhost:3000';

//

const sendEmail = async (transport, to, subject, text, html) => {
    await transport.sendMail({ to, subject, text, html }, function(
        error,
        result
    ) {
        if (error) {
            console.error(error);
            throw 'An error occurred trying to send an email.';
        }
    });
};

const sendRegisterEmail = async (transport, to, validation) => {
    const subject = `Codaisseur Calendar account registration.`;

    const text = `Hello,

    A new account has been registered with email address:
    ${to}

    To continue the registration process, follow the link below:
    ${baseUrl}/validate/${validation}

    Thank you for registering.`;

    const html = `<h3>Hello,</h3>

    <p>A new account has been registered with email address:</p>
    <p>${to}</p>

    <p>To continue the registration process, follow the link below:</p>
    <a href="${baseUrl}/validate/${validation}">Continue registration</a>
      
    <p>Thank you for registering.</p>`;

    await sendEmail(transport, to, subject, text, html);
};

const alreadyRegisteredEmail = async (transport, to) => {
    const subject = `Codaisseur Calendar account registration.`;

    const text = `Hello,

    An attempt was made to register an account with email address:
    ${to}

    However, an account with this email address already exists.

    If you have forgotten your password, reset it with the link below:
    ${baseUrl}/resetpassword/${validation}/${to}

    Thank you.`;

    const html = `<h3>Hello,</h3>

    <p>An attempt was made to register an account with email address:</p>
    <p>${to}</p>

    <p>However, an account with this email address already exists.</p>

    <p>If you forgot your password, reset it with the link below:</p>
    <a href="${baseUrl}/resetpassword/${validation}/${to}">Reset your password</a>
  
    <p>Thank you.</p>`;

    await sendEmail(transport, to, subject, text, html);
};

const ResetPassword = async (transport, to, validation) => {
    const subject = `Codaisseur Calendar reset password.`;

    const text = `Dear,

    ${to}

    You requested for a password reset,

    kindly use this link below to reset your password:

    ${baseUrl}/resetpassword/${validation}/${to}

    Thank you.`;

    const html = `<h3>Dear,</h3>
    <p>${to}</p>

    <p>You requested for a password reset,</p>

    <p>kindly use this link below to reset your password:</p>
    <a href="${baseUrl}/resetpassword/${validation}/${to}">Click here to reset your password</a>
  
    <p>Thank you.</p>`;

    await sendEmail(transport, to, subject, text, html);
};

const beAssistantRequest = async (transport, to, event, user) => {
    console.log('MESSAGE SENT');
    const subject = `Codaisseur Calendar Assistant Request.`;

    const text = `Hello,

  I am ${user.name} and my e-mail adress is ${user.email}.

  I would like to assist in ${event.title} on ${event.start}.

  Here is the link to the event: ${event.eventLink}.

  Please let me know if thats possible. Thanks.`;

    const html = `<h3>Hello,</h3>

    <p>I am ${user.name} and my e-mail adress is ${user.email}.</p>

    <p>I would like to assist in ${event.title} on ${event.start}.</p>

     <p>Here is the link to the event: ${event.htmlLink}.</p>

    <p>Please let me know if that's possible. Thanks.</p>`;

    await sendEmail(transport, to, subject, text, html);
    console.log('MESSAGE SENT');
};

module.exports = {
    sendRegisterEmail,
    alreadyRegisteredEmail,
    ResetPassword,
    beAssistantRequest,
};
