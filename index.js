const express = require('express');
const path = require('path');
const os = require('os');
const fs = require('fs');
const bodyParser = require('body-parser');
const Busboy = require('busboy');

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => console.log("Server listening at port " + port));

app.post('/upload', function (req, res) {
    const busboy = new Busboy({
        headers: req.headers
    });
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        var location = path.join('./public/', path.basename(filename));
        file.pipe(fs.createWriteStream(location));
    });
    busboy.on('finish', function () {
        res.writeHead(200, {
            'Connection': 'close'
        });
        res.end("Uploaded file!");
    });
    //Parse HTTP-POST upload
    return req.pipe(busboy);
});