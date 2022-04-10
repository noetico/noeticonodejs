var express = require('express');
//const { ModuleResolutionKind } = require('typescript');
var router = express.Router();
//var app = express();
//router.set('view engine', 'pug');

router.get('/views/corporate', function(req, res){
res.render('corporate');

});
router.get('/views/partners', function(req, res){
    res.render('partners');
    
    });

    module.exports = router;


