var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
 
/*
 * POST the contact form.
 */
router.post('/contact', validate_contact, function(req, res) {
  
  // NOTE 1: It seems Gmail doesn't allow to send messages with various FROM fields.
  // Hence all the receivede emails will be "from" the address in smtpTransport.
  // Temporary fix: put all the info in the message 
  // NOTE 2: few things might have to be done for gmail like allowing access to less secure apps and disabling captcha.
  // NOTE 3: switched to Yahoo because in production gmail kept giving errors although the captcha thing (is like you have to do it over and over each time)
  // NOTE 4: Services such as gmail will automatically substitue the "from" field with the email address using the service. However, Yahoo will return authentication error.
  // Therfore, when using Yahoo the "from" should be the same as the user in the authentication. See NOTE 1.
  // NOTE 5: in dev environment Yahoo/Hotmail THIS WILL NOT WORK as cloud9 blocks all SMTP connections to avoid spam (but somehow gmail works in dev too).
  
  var message = "From: " + req.body.contact_name + "\n " + "Email: " + req.body.contact_email + "\n\n " + req.body.contact_message 

  var mailOptions= {
                    from: process.env.NODEMAILER_USER, // NOTE 1 and 4
                    to: process.env.NODEMAILER_USER,
                    subject: req.body.contact_subject,
                    text: message
                   };
     
  var smtpTransport = nodemailer.createTransport( {
                      service: 'yahoo',
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
 * Middleware validator to check the form fields are filled correctly.
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
