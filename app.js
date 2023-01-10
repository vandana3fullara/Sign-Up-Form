const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { json } = require("body-parser");
require('dotenv').config();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.secondName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us1.api.mailchimp.com/3.0/lists/d54c47a21b";
    const options = {
      method: "POST",  
      auth: process.env.API_KEY
    }

   const request = https.request(url, options, function(response) { 
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData); 
    request.end(); 
});

app.post("/failure.html", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
   console.log("Server Is Up And Running On Port 3000"); 
});