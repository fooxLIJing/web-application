/**
 * Created by fooxlj on 08/10/15.
 */
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');


exports.getJson = function(url)
{
    console.log('leboncoin   '+ url);
    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            var prix, marque, modèle, ann, kilom, carburant, vitesse;
            var json = {prix: "", marque: "", modèle: "", ann: "", kilom: "", carburant: "", vitesse: ""};

            $('.price').filter(function () {
                var data = $(this);
                prix = data.text();

                json.prix = prix.replace(/\s+/g, '');
            });

            $('.lbcParams').filter(function () {
                var data = $(this);
                marque = data.find("td").eq(0).text();
                json.marque = marque;

                modèle = data.find("td").eq(1).text();
                json.modèle = modèle;

                ann = data.find("td").eq(2).text();
                json.ann = ann.replace(/\s+/g, '');

                kilom = data.find("td").eq(3).text();
                json.kilom = kilom.replace(/\s+/g, '');

                carburant = data.find("td").eq(4).text();
                json.carburant = carburant;

                vitesse = data.find("td").eq(5).text();
                json.vitesse = vitesse;
            });

        } else {
            console.log(error);
        }


// To write to the system we will use the built in 'fs' library.
// In this example we will pass 3 parameters to the writeFile function
// Parameter 1 :  output.json - this is what the created filename will be called
// Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
// Parameter 3 :  callback function - a callback function to let us know the status of our function

        fs.writeFile('./public/json/leboncoin.json', JSON.stringify(json, null, 4), function (err) {

            console.log('File successfully written! - Check your project directory for the leboncoin.json file');

        })

   })
};


exports.getJson_Ads = function(url){

    request(url, function(error, response, html){

        if(!error){
            var $ = cheerio.load(html);

            var length = $('.lbc').length;
            var ads = [];

            $('.list-lbc').filter(function(){
                var data = $(this);
                for(var i=0;i < length;i++){
                    var ad = {marque: "", ads_link: "" , prix:""};

                    ad.marque = data.find('a').eq(i).attr('title');
                    ad.ads_link = data.find('a').eq(i).attr('href');
                    ad.prix = data.find('.price').eq(i).text().replace(/\s+/g, '');

                    ads.push(ad);
                }
            });
        }
        else {
            console.log(error);
        }

        fs.writeFile('./public/json/leboncoin_ads.json', JSON.stringify(ads, null, 4), function (err) {

            console.log('File successfully written! - Check your project directory for the leboncoin_ads.json file');

        })
    })

};
