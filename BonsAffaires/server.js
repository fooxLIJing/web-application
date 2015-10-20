/**
 * Created by fooxlj on 04/10/15.
 */


/**
 * Created by fooxlj on 07/10/15.
 */
var express = require('express');
var app     = express();
var bodyParser = require('body-parser');
var String = require('string');

app.use("/",express.static(__dirname + '/public'));
app.use("/styles",  express.static(__dirname + '/public/stylesheets'));
app.use("/scripts", express.static(__dirname + '/public/javascripts'));
app.use("/images",  express.static(__dirname + '/public/images'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine','ejs');



app.post('/geturl', function(req, res){

    var url=req.body.myurl;

    console.log('server  ' + url);
    //url = 'http://www.leboncoin.fr/voitures/852693116.htm?ca=12_s';
    var leboncoin=require("./js/LeBoncoin.js");
    leboncoin.getJson(url);

    var lacentrale = require("./js/LaCentrale.js");
    lacentrale.getVersions();

    res.json('toto');
    });


app.post('/getdetail',function(req,res){

    var url = req.body.myurl;
    var lacentrale = require('./js/LaCentrale.js');
    console.log(url);

    lacentrale.getPrix(url, function(response){
        var leboncoin = require ('./public/json/leboncoin.json');
        var coin_prix =String(leboncoin.prix).right(-1).s;
        var centrale_prix = String(response).right(-1).s;

        console.log(String(coin_prix).toInt() < String(centrale_prix).toInt());
        var worthy = (String(coin_prix).toInt() < String(centrale_prix).toInt());
        res.json(worthy);
    });
});


app.post('/geturl_ads',function(req, res){
    //http://www.leboncoin.fr/voitures/offres/ile_de_france/hauts_de_seine/?f=a&th=1&pe=33&rs=2005&me=100000&q=lexus
    var url=req.body.myurl;
    var leboncoin=require("./js/LeBoncoin.js");
    leboncoin.getJson_Ads(url);
    res.json('toto');
});

app.listen("8081");
console.log('Magic happens on port 8081');
exports = module.exports = app;