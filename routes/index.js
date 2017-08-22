var express = require('express');
var router = express.Router();


/*
 * GET home page.
 */
router.get('/', function(req, res) {
  res.render('index');
});


/*
 * Download the manifesto.
 */
router.get('/gekibun_download', function (req, res, next) {
    var filePath = __dirname +　"/../public/data/gekibun.txt"; 
    var fileName = "gekibun.txt"; 
    res.download(filePath, fileName);    
});


module.exports = router;