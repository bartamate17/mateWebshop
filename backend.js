console.log('Backend fut!');

const http = require('http');
const fs = require('fs');
var url = require('url');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://clientName:passWord@cluster0.2stvc.mongodb.net/databaseName?retryWrites=true&w=majority";

var mime = {
    html: "text/html",
    css: "text/css",
    txt: "text/plain",
    js: "application/javascript",
    json: "application/json",
    jpg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    svg: "image/svg+xml"
};

function MongoRequest(clientName, collectionName, handler) {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    client.connect(err => {
        const collection = client.db(clientName).collection(collectionName);

        handler(client, collection);
    });
}

http.createServer(function(request, response) {

    var parsedUrl = url.parse(request.url);

    switch (true) {

        case request.method == "GET" && parsedUrl.pathname == "/":

            response.writeHead(200, { "Content-type": mime["html"] + "; charset = utf-8" });

            fs.readFile(__dirname + "/index.html", function(error, file) {

                response.write(file);
                response.end();
            });

            break;

        case request.method == "GET" && parsedUrl.pathname == "/products":

            response.writeHead(200, { "Content-type": mime["json"] + "; charset = utf-8" });

            MongoRequest("databaseName", "collectionName", (client, collection) => {

                collection.find().toArray(function(err, res) {

                    response.write(JSON.stringify(res));
                    response.end();
                    client.close();
                });
            });

            break;

        case request.method == "POST" && parsedUrl.path == "/newproducts":

            dataStringTemplate = "";
            dataObjectTempalte = {};

            request.on("data", function(chunk) {
                dataStringTemplate += chunk;
            });

            request.on("end", function() {
                dataObjectTempalte = JSON.parse(dataStringTemplate);

                MongoRequest("databaseName", "collectionName", (client, collection) => {

                    collection.insertOne(dataObjectTempalte, function(err, res) {

                        var obj = JSON.stringify({ message: "Sikeres felülírás!" });

                        response.write(obj);
                        response.end();

                        client.close();
                    });
                });
            });
            break;

        case request.method == "POST" && parsedUrl.path == "/editproduct":

            var dataString = '';

            request.on("data", function(chunk) {
                dataString += chunk;

            });

            request.on("end", function() {

                prodData = JSON.parse(dataString);

                console.log(prodData)

                MongoRequest("databaseName", "collectionName", (client, collection) => {

                    var IDquery = { id: prodData.id };
                    var updateProductQuery = {
                        $set: {
                            megnevezes: prodData.megnevezes,
                            ar: prodData.ar,
                            garancia: prodData.garancia,
                            forgalmazo: prodData.forgalmazo,
                            id: prodData.id
                        }
                    };

                    collection.updateOne(IDquery, updateProductQuery, function(err, res) {

                        var obj = JSON.stringify({ message: "Sikeres szerkesztés!" });

                        response.write(obj);
                        response.end();

                        client.close();
                    });
                });

            });

            break;

        case request.method == "POST" && parsedUrl.path == "/newsletter":

            var templateString = "";
            var dataObjectTempalte = {};

            request.on("data", function(chunk) {
                templateString += chunk;
            });

            request.on("end", function() {
                dataObjectTempalte = JSON.parse(templateString);

                MongoRequest("databaseName", "collectionName", (client, collection) => {

                    collection.insertOne(dataObjectTempalte, function(err, res) {

                        var obj = JSON.stringify({ message: "Sikeres mentés!" });

                        response.write(obj);
                        response.end();

                        client.close();
                    });
                });
            });

            break;

        default:

            var urlEndIndex = parsedUrl.pathname.slice(parsedUrl.pathname.indexOf(".") + 1);
            console.log(urlEndIndex);
            console.log(__dirname, parsedUrl.pathname);

            response.writeHead(200, { "Content-type": mime[urlEndIndex] || "text/plain" });
            fs.readFile(path.join(__dirname, parsedUrl.pathname.slice(1)), function(error, file) {

                if (error) {
                    response.write(error + ": Hiba a betöltés során!");
                } else {
                    response.write(file);
                }
                response.end();
            });
    }

}).listen(3000);