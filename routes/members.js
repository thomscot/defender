var express = require('express');
var router = express.Router();

/*
 * GET members listing.
 */
router.get('/memberslist', function(req, res) {
    var db = req.db;
    var collection = db.get('memberstest');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});


/*
 * POST to addmember.
 */
router.post('/addmember', validator, function(req, res) {
  var db = req.db;
  var collection = db.get('memberstest');
  collection.insert(req.body, function(err, result){
    res.json(
      (err === null) ? { msg: 'success' } : { msg: err }
    );
  });
});


/*
 * Middleware validator
 */
function validator(req, res, next) {
  req.checkBody('namekanji', 'お名前[漢字]項目は必須で御座います').notEmpty();
  req.checkBody('namekana', 'お名前[漢字]項目は必須で御座います').notEmpty();
  req.checkBody('email', '入力されたメール正しくはありません').isEmail();
  req.checkBody('location', 'insert location').notEmpty();
  req.checkBody('age', 'insert age').notEmpty();
  req.checkBody('sex', 'insert gender').notEmpty();
  //TODO: req.validationErrors() may be removed in a future version. Use req.getValidationResult().
  var errors = req.validationErrors();
  if (errors) {
    console.log(errors) 
    res.json({msg: 'validation', errors:errors}); // send back the errors as json
  }
  else {
    next();
  }
};


module.exports = router;

