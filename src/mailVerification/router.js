const nodemailer = require('nodemailer')
const { Router } = require('express')
const router = new Router()
const User = require('../user/model')

let smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
      user: "gijsmaas82@gmail.com",
      pass: "3Joepie3"
  }
});
let rand, mailOptions, host, link;

router.get('/mail', (req, res) => {

  rand=Math.floor((Math.random() * 100) + 54);
  host=req.get('host');
  link="http://"+req.get('host')+"/verify?id="+rand;
  mailOptions={
      to : req.query.to,
      subject : "Please confirm your Email account",
      html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
  }
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, response){
   if(error){
          console.log(error);
      res.end("error");
   }else{
          console.log("Message sent: " + response.message);
      res.end("sent");
       }
  });
})

router.get('/verify', (req,res) => {
  console.log(req.protocol+":/"+req.get('host'));
  if((req.protocol+"://"+req.get('host'))==("http://"+host))
  {
      console.log("Domain is matched. Information is from Authentic email");
      if(req.query.id==rand)
      {
          console.log("email is verified");
          res.end("Email "+mailOptions.to+" is been Successfully verified");
      }
      else
      {
          console.log("email is not verified");
          res.end("Bad Request");
      }
  }
  else
  {
      res.end("Request is from unknown source");
  }
});


module.exports = router