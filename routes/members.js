var express = require('express');
var router = express.Router();

/*
 * GET members listing.
 */
router.get('/memberslist', function(req, res) {
    var db = req.db;
    var collection = db.get('memberslisttest');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/*
 * POST to addmember.
 */
router.post('/addmember', function(req, res) {
    var db = req.db;
    var collection = db.get('memberslisttest');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: 'success' } : { msg: err }
        );
    });
});

module.exports = router;