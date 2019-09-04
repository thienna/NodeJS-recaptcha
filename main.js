var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.get('/',function(req,res) {
  // Sending our HTML file to browser.
  res.sendFile(__dirname + '/index.html');
});

app.post('/submit',function(req,res){
  // Put your secret key here.
  var secretKey = "SECRET";
  var userIpAddress = req.connection.remoteAddress;
  var repsonseToken = req.body['test_token']
  // req.connection.remoteAddress will provide IP address of connected user.
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify";
  // Hitting GET request to the URL, Google will respond with success or error scenario.
  request.post(verificationUrl, {
    form: {
      secret: secretKey,
      response: repsonseToken,
      remoteip: userIpAddress,
    }

    }, function(error,response,body) {
    body = JSON.parse(body);
    console.log("RESPONSE", body)
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
      return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
    }
    res.json({"responseCode" : 0,"responseDesc" : "Sucess"});
  });
});

// This will handle 404 requests.
app.use("*",function(req,res) {
  res.status(404).send("404");
})

// lifting the app on port 3000.
app.listen(3000);
