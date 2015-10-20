/**
 * Created by fooxlj on 08/10/15.
 */
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var carAd = require('../public/json/leboncoin.json');
var String = require('string');

exports.getVersions = function(){

    if(null == carAd.modèle.match('Autres')){
        var url="http://www.lacentrale.fr/cote-voitures-"+carAd.marque.toLowerCase()+"-"+carAd.modèle.toLowerCase()+"--"+carAd.ann+"-.html";
        request(url, function(error, response, html) {
            if (!error) {
                var $ = cheerio.load(html);
                var carlist = [];
                var length=$('.tdSD.QuotMarque').length;

                for(var i=0; i < length ; i++){
                    $('#TabAnnHomeCote').filter (function(error, response, html){
                        var data = $(this);
                        var carjson = {url:"" , version:"" , energie:"" , puis_fisc:"" , vitesse:"" , portes :""}

                        var version = data.find($(".tdSD.QuotMarque")).eq(i).children('a');
                        carjson.url = version.attr("href");
                        carjson.version = version.text();
                        carjson.energie = data.find($(".tdSD.QuotNrj")).eq(i).children('a').text();
                        carjson.puis_fisc = data.find($(".tdSD.QuotPower")).eq(i).children('a').text();
                        carjson.vitesse = data.find($(".tdSD.QuotBoite")).eq(i).children('a').text();
                        carjson.portes = data.find($(".tdSD.QuotDoors")).eq(i).children('a').text();

                        carlist.push(carjson);
                    })
                }
            }else {
                console.log(error);
            }
        exports.writeJson(carlist);
    })
    }else{
        fs.writeFile('./public/json/lacentrale.json', JSON.stringify( null, 4), function (err) {
            console.log('File successfully written! - Check your project directory for the lacentrale.json file');
        })
    }
};

exports.writeJson = function (carlist){
    var k=0;

    console.log(carAd.carburant);
    for(var i = 0; i< carlist.length; i++)
    {

       if(null == carAd.carburant.match(/'Autre'/gi)){

            if( null != carlist[i].energie.match(/carAd.carburant/gi)  ||
                carlist[i].vitesse != carAd.vitesse.toLowerCase())
            {
                k=i;
                i--;
                carlist.splice(k);
            }
        }else{
           if(carlist[i].vitesse != carAd.vitesse.toLowerCase())
           {
               k=i;
               i--;
               carlist.splice(k);
               console.log(carlist.length);
           }
       }

    }
    fs.writeFile('./public/json/lacentrale.json', JSON.stringify(carlist, null, 4), function (err) {
        console.log('File successfully written! - Check your project directory for the lacentrale.json file');
    })
};

exports.getPrix = function(url,callback) {

    url="http://www.lacentrale.fr/"+url;
    var cote = 0;
    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            $('.Result_Cote.arial.tx20').filter(function(error, response, html){
                var data=$(this);
                cote=data.text().replace(/\s+/g, '');
            })
        }else{
            console.log(error);
        }
        console.log(cote);
        return callback(cote);
    });

};