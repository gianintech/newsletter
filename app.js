const express = require("express");
const request = require("request");
const bodyParser = require ("body-parser");
const https = require("https");
const port = process.env.PORT || 3000;


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res) {
    
    const firstName = req.body.fName;
    const lastName = req.body.lName;
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

    const url = "https://us14.api.mailchimp.com/3.0/lists/062c13904e";
    const option = {
        method: "POST",
        auth: "gianintech:311c37393d854740da3618c3f47dc42d-us14"
    }

    const request = https.request(url, option, function(response){

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", function (req, res){
    res.redirect("/");
});

app.listen(port, function(){
    console.log("Server is running on Port "  + port );
});


//API KEY
// 311c37393d854740da3618c3f47dc42d-us14

//LIST ID
// 062c13904e