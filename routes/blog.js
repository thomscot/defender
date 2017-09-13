var express = require('express');
var router = express.Router();


/*
 * GET blog page.
 * TODO: eventually this will have to rendere automatically something like /blog/article_title
 * fetching title etc from the request.
 */
router.get('/', function(req, res) {
  res.render('blog');
});


module.exports = router;