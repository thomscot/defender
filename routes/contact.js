var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
 
/*
 * POST the contact form.
 */
router.post('/contact', validate_contact, function(req, res) {
  
  // NOTE: It seems Gmail doesn't allow to send messages with various FROM fields.
  // Hence all the receivede emails will be "from" the address in smtpTransport.
  // Temporary fix: put all the info in the message 
  // NOTE 2: few things might have to be done for gmail like allowing access to less secure apps and disabling captcha.
  var message = "From: " + req.body.contact_name + "\n " + "Email: " + req.body.contact_email + "\n\n " + req.body.contact_message 

  var mailOptions= {
                    from: req.body.contact_email,
                    to: "yougosha@yahoo.com",
                    subject: req.body.contact_subject,
                    text: message
                   };
     
  var smtpTransport = nodemailer.createTransport( {
                      // service: 'yahoo',
                      host: 'plus.smtp.mail.yahoo.com',
                      port: 465,
                      // read user/pwd from env variables:
                      auth: { 
                            user:  process.env.NODEMAILER_USER,
                            pass:  process.env.NODEMAILER_PASS
                            }
                      
                      });

  smtpTransport.sendMail(mailOptions, function(err, result){
    console.log(err)
     res.json(
      (err === null) ? { msg: 'success' } : { msg: err }
    );
  });
  
  smtpTransport.close(); 

  
});

/*
 * Middleware validator
 */
function validate_contact(req, res, next) {
  req.checkBody('contact_name', 'お名前をご入力下さい。').notEmpty();
  req.checkBody('contact_email', '入力されたメールが正しくありません。').isEmail();
  req.checkBody('contact_subject', '件名をご入力下さい。').notEmpty();
  req.checkBody('contact_message', '伝言内容をご入力下さい。').notEmpty();
  //TODO: req.validationErrors() may be removed in a future version. Use req.getValidationResult().
  
  var errors = req.validationErrors();
  if (errors) {
    console.log(errors) 
    res.json({msg: 'validation', contact_errors:errors}); // send back the errors as json
  }
  else {
    next();
  }
};


module.exports = router;
