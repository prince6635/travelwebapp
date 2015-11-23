var express = require('express');
var fortune = require('./lib/fortune');

var app = express();

// 设置handlebars 视图引擎
var handlebars = require('express3-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// 放在路由前用来区别test
app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' &&
        req.query.test === '1';
    next();
});

// 可以在启动服务器前通过设置环境变量覆盖端口
app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    //res.type('text/plain');
    //res.send("Zi's Travel");

    res.render('home');
});

app.get('/about', function (req, res) {
    //res.type('text/plain');
    //res.send("About Zi's Travel");

    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: 'qa/tests-about.js'
    });
});

app.get('/tours/hood-river', function(req, res){
    res.render('tours/hood-river');
});

app.get('/tours/request-group-rate', function(req, res){
    res.render('tours/request-group-rate');
});

// customized 404 page
// 顺序很重要，如果404放在最前面则都会返回404
// 而且路径从上到下要是从精确到General
app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

// customized 500 page
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' +
        app.get('port') +
        '; press Ctrl+C to terminate');
});

// for testing JSHint
//if( app.thing == null ) console.log( 'bleat!' );

