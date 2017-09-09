var express = require('express');
var router = express.Router();

/*
 * POST tp addmember to insert a new member in the database upon validation
 * and provided the user email has not been registered yet.
 */
router.post('/addmember', validator, async (req,res) => {

    try {
          let db = req.db;
          let collection = db.get('memberstest');
          
          // Check if email is already in DB
          collection.findOne({'email': req.body.email }, function(err, member) {

            if (err) { // TODO: handle this?
              console.log('Signup error');
            }
            if(member){ // If we already have a member with this email, return 
              var err = new Error();
              err.message = '入力された電子郵便住所は既に登録されています。';
              res.json(
                { msg: 'email_exists' , error: err }
              );
            } else { // Otherwise do the insert 
              collection.insert(req.body, function(err, result){
                res.json(
                  (err === null) ? { msg: 'success' } : { msg: err.message }
                );
              });
            }
          });
          
    await db.then(() => 1); // really need to understand this.
    
    } catch(e) {
      res.json({msg: e.message})
    }
    
});


/*
 * Middleware validator to check that the fields are filled correctly. 
 * For now checking non-empty and isEmail() is enough.
 */
function validator(req, res, next) {

  req.checkBody('namekanji', 'お名前[漢字]をご入力下さい。').notEmpty();
  req.checkBody('namekana', 'お名前[かな]をご入力下さい。').notEmpty();
  req.checkBody('email', '入力された電子郵便住所が正しくありません。').isEmail();
  req.checkBody('email_confirm', '入力された確認電子郵便住所が正しくありません。').equals(req.body.email)
  req.checkBody('location', 'ご住所をご入力下さい。').notEmpty();
  req.checkBody('age', '年齢をご入力下さい。').notEmpty();
  req.checkBody('sex', '性別をご入力下さい。').notEmpty();
  
  //TODO: req.validationErrors() may be removed in a future version. Use req.getValidationResult().
  var errors = req.validationErrors();
  
  if (errors) {
    res.json({msg: 'validation', errors:errors}); // send back the errors as json
  }
  else {
    delete req.body.email_confirm // In order to avoid inserting email twice in DB (as 'email' and 'email_confirm')
    next();
  }
};


module.exports = router;

