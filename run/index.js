var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
const request = require('request');
var cron = require('node-cron');
var fs = require('fs'); 

cron.schedule('34 * * * *', () => {
    request('https://corona-api.com/timeline', function (error, response, body) {
        console.error('error:', error); // Print the error if one occurred
        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //console.log('body:', body); 
        let today = new Date();   

        let year = today.getFullYear(); // 년도
        let month = today.getMonth() + 1;  // 월
        let date = today.getDate();  // 날짜
        let day = today.getDay();  // 요일


        fs.writeFile('../data/'+year+month+date+'.json',body,function(err){ 
            if (err === null) { 
                console.log('success'); 
            } else { 
                console.log('fail'); 
            } 
        });

      });
});

//view engine 을 EJS(쉽게 말해서 Express 를 위한 HTML 같은거)로 설정
app.set('view engine','ejs');

//view 를 views 디렉토리로 설정
app.set('views','./views');
app.use(express.static('pub'));

let today = new Date();   

let year = today.getFullYear(); // 년도
let month = today.getMonth() + 1;  // 월
let date = today.getDate();  // 날짜
let day = today.getDay();  // 요일



app.get('/', function(req, res) {
    fs.readFile('../data/'+year+month+date+'.json','utf8',function(err,data){ 
        res.render("index", {
            globalConfirmed: JSON.parse(JSON.parse(data).data[0].confirmed),
            globalUpdate: JSON.stringify(JSON.parse(data).data[0].updated_at),
            globalNewConfirmed: JSON.parse(JSON.parse(data).data[0].new_confirmed)
        });
        //console.log(JSON.parse(JSON.parse(data).data[0].confirmed))
    });
});

app.get('/intro', function(req, res) {
    res.render('intro');
});

server.listen(9200);
//https://api.covid19api.com/summary
