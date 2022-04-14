var express = require("express");
var app = express();
var axios = require("axios");
var port = process.env.PORT || 5000;
var apikey = "4b8572f8c8b9752e97052ee0a2aec552";

//otetaan tarvittavat resurssit käyttöön.
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));

app.set("view engine", "ejs");

//Haetaan eri tietoa samasta artistista (tässä tapauksessa GAS). Tiedon hakeminne yhdellä kerralla (axios.all) aiheutti hieman päänsärkyä, joten toistin saman asian monta kertaa.

//Tämä hakee artistin tiedot.
axios
 .get("http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=Gas&api_key=" + apikey + "&format=json")
  .then(response => {
    info = response.data;
    return info;
  });

//Tämä hakee suosituimmat albumit kyseiseltä artistilta.
axios
 .get("http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=gas&limit=5&api_key="+ apikey +"&format=json")
  .then(response => {
    albums = response.data;
    return albums;
  });

//Tämä hakee Last.fm palvelun ehdottamia samankaltaisia artisteja.
axios
    .get("http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=gas&limit=10&api_key="+ apikey +"&format=json")
    .then(response => {
        similar = response.data;
        return similar;
    });

//Lähetetään index.ejs juuri hakemistoon ja sen mukana artistin tiedot (info muuttuja).
app.get("/", (req, res) => {
    res.render("pages/index.ejs", { posts: info });
});

//lähetetään /topalbums hakemistoon topalbums.ejs sekä tiedot suosituimmista albumeista (albums muuttuja).
app.get("/topalbums", (req, res) => {
    res.render("pages/topalbums.ejs", { posts: albums });
});

//Lähetetään /similar hakemistoon similar.ejs ja sen mukana lista samanlaisista artisteista (similar muuttuja).
app.get("/similar", (req, res) => {
    res.render("pages/similar.ejs", { posts: similar });
});

app.listen(port, () => console.log("The server is listening to port number " + port));