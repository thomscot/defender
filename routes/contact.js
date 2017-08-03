var express = require('express');
var router = express.Router();

/*
 * POST the contact form.
 */
router.post('/contact', validate_contact, function(req, res) {
 alert('message sent')
});

/*
 * Middleware validator
 */
function validate_contact(req, res, next) {
  req.checkBody('contact_name', 'お名前項目は必須で御座います').notEmpty();
  req.checkBody('contact_email', '入力されたメール正しくはありませんす').isEmail();
  req.checkBody('contact_subject', 'insert subject').notEmpty();
  req.checkBody('contact_message', 'insert message').notEmpty();
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
