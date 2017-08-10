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
 NOTE: According to the answer to my SO question, the only changed needed to catch the error if
 the DB is down, is to add the option { bufferMaxEntries: 0 } in the app.js to the db instance.
 Still it seems if I use the code below no error is caught.  For now will use the workaround
 with try/catch. This seems to be working although not necessary. I'd better understand this.
*/

/*
 * POST to addmember.
 */
// router.post('/addmember', validator, function(req, res) {
//   let db = req.db;
//   var collection = db.get('memberstest')
//   collection.insert(req.body, function(err, result){
//     res.json(
//       (err === null) ? { msg: 'success' } : { msg: err.message }
//     );
//   });
// });


/*
 * POST to addmember.
 */
router.post('/addmember', validator, async (req,res) => {

    try {
          let db = req.db;
          let collection = db.get('memberstest');
          collection.insert(req.body, function(err, result){
          res.json(
            (err === null) ? { msg: 'success' } : { msg: err.message }
          );
        });
        await db.then(() => 1);
    } catch(e) {
      res.json({msg: e.message})
    }
    
});


/*
 * Middleware validator
 */
function validator(req, res, next) {
  req.checkBody('namekanji', 'お名前[漢字]をご入力下さい。').notEmpty();
  req.checkBody('namekana', 'お名前[かな]をご入力下さい。').notEmpty();
  req.checkBody('email', '入力されたメールが正しくありません。').isEmail();
  req.checkBody('location', '位置をご入力下さい。').notEmpty();
  req.checkBody('age', '年齢をご入力下さい。').notEmpty();
  req.checkBody('sex', '性別をご入力下さい。').notEmpty();
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

