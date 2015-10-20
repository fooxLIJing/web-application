/**
 * Created by fooxlj on 13/10/15.
 */


function judgeURL(){

    var url = $('.myurl').val();
    var server_url;

    if(null != url.match('offres')) {
        server_url = 'http://localhost:8081/geturl_ads';
    }else {
        server_url = 'http://localhost:8081/geturl';
    }
        $.ajax({
            type: "POST",
            url: server_url,
            data: {"myurl": url},
            dataType: 'json',

            success: function () {
                console.log('success');

                if (null != url.match('offres')) {

                    var trHTML = '<tr><td>marque</td><td>prix</td></tr>';

                    $.getJSON("json/leboncoin_ads.json", function (data) {

                        for (var i = 0; i < data.length; i++) {
                            trHTML += '<tr><td><a onclick=getDetail('+JSON.stringify(data[i].ads_link)+')>' + JSON.stringify(data[i].marque) + '</a></td><td>' + JSON.stringify(data[i].prix) + '</td></tr>';
                        }
                    });

                    alert(trHTML);
                    $('.ads_table').append(trHTML);
                } else {
                    location.href = 'http://localhost:8081/views/detail.html';
                }
            },
            error: function (error) {
                console.log(error);
            }
        });

}

function addOptions(){

    var version_select=document.getElementById('version_select');

    $.getJSON("../json/lacentrale.json",function(data){

        if(data.length!=0){
            var i = 0;
            while(i < data.length){
                var version_option = document.createElement('option');
                version_option.text = data[i].version;
                version_option.value = data[i].url;
                version_select.appendChild(version_option);
                i++;
            }
        }
    })

}

function getPrix(){

    var myurl;
    var sel =  $( "select" );

    if(1 != sel.find('option').length){
        sel
        .change(function() {
            $( "select option:selected" ).each(function() {
               myurl=$(this).val();
            });
        })
        .trigger( "change" );

        $.ajax({
            type: "POST",
            url: 'http://localhost:8081/getdetail',
            data: {"myurl":myurl},

            dataType:'json',
            success: function(data) {
                console.log('success');
                var worthy = JSON.stringify(data);
                if(worthy == 'true'){
                    $('.result').html('<h1>WORTHY</h1>');
                }
                else{
                    $('.result').html('<h1>NOT WORTHY</h1>');
                }

            },
            error: function(error) {
                console.log(error);
            }
        });
    }else{
        $('#compare_bottom').prop('disabled' ,true);
        $('.result').html('<h1>No Record</h1>');
    }
}


function getDetail(myurl){

    alert('toto : '+myurl);
    $.ajax({
        type: "POST",
        url: 'http://localhost:8081/geturl',
        data: {"myurl":myurl},

        dataType:'json',
        success: function() {
            location.href = 'http://localhost:8081/views/detail.html';
        },
        error: function(error) {
            console.log(error);
        }
    });
}