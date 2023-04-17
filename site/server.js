const express = require('express')
const app = express()
const port = 8080
require('dotenv').config();

const multer = require('multer');
const fs = require("fs");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const { parse } = require("csv-parse");


const csv = require('fast-csv');

const zip = require('express-zip');

const Client = require("../mailcorgi API/database/supabase");
const { time } = require('console');

const client = new Client(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, 900000);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })



app.set("view engine", "ejs");

app.get('/token/:token', (req, res) => {
    const callback = (status) => {
        if (status == true) {
            res.render('../site/views/authenticated', {
                url: process.env.SITE_URL,
                token: req.params.token
            });
        } else {
            res.send('validation failed');
        }
    }

    client.checkSudoToken(req.params.token).then(
        callback
    );

    // res.render('../site/views/homepage', {
    //     emailSite: "localhost:8080/token/" + process.env.
    // });
});

app.get('/', (req, res) => {
    res.send("Go to /tokens/ and enter your token. The corgis see you!");
});

app.get('/token/:token/uploadcsv', (req, res) => {
    const callback = (status) => {
        if (status == true) {
            res.render('../site/views/upload', {
                url: process.env.SITE_URL,
                token: req.params.token
            });
        } else {
            res.send('validation failed');
        }
    }

    client.checkSudoToken(req.params.token).then(
        callback
    );
})

app.post('/uploadfile', upload.single('file'), (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    validFilename = "./processedFiles/found_" + file.originalname;
    invalidFilename = "./processedFiles/failed_" + file.originalname;


    const writeCSV = (data) => {
        header = [
            { id: 'email', title: 'Email' },
            { id: 'phone', title: 'Phone' },
            { id: 'slack', title: 'Slack' },
            { id: 'name', title: 'Name' },
            { id: 'club', title: 'Club' },
            { id: 'addr1', title: 'Addr1' },
            { id: 'addr2', title: 'Addr1' },
            { id: 'city', title: 'City' },
            { id: 'state', title: 'State' },
            { id: 'zip', title: 'Zip' },
            { id: 'country', title: 'Country' },
            { id: 'public_wildcard', title: 'PUW' },
            { id: 'private_wildcard', title: 'PRW' },
        ]


        const validWriter = createCsvWriter({
            path: validFilename,
            header: header
        });

        validWriter
            .writeRecords(data[0])
            .then(() => console.log('The CSV file was written successfully'));

        const invalidWriter = createCsvWriter({
            path: invalidFilename,
            header: header
        });

        invalidWriter
            .writeRecords(data[1])
            .then(() => console.log('The CSV file was written successfully'));
    }

    readCSVdata = [];

    const callback = (status) => {

        if (status == true) {
            fs.createReadStream(`./uploads/${file.originalname}`)
                .pipe(parse({ delimiter: ",", from_line: 2 }))
                .on("data", function (row) {
                    console.log(row);
                    readCSVdata.push(row);
                })
                .on("end", function () {
                    client.checkSudoBulkByEmailName(readCSVdata).then(writeCSV);

                })
                .on("error", function (error) {
                    console.log(error.message);
                });

            currentTime = new Date(Date.now());
            res.zip([
                {
                    path: validFilename,
                    name: `foundAddresses_${currentTime}.csv`
                },
                {
                    path: invalidFilename,
                    name: `failedAddresses_${currentTime}.csv`
                },

            ], `bulkaddresses_${currentTime}`)

        } else {
            res.send('validation failed');
        }


    }

    client.checkSudoToken(req.body.token).then(
        callback
    );

})


app.get('/token/:token/email/:email', (req, res) => {


    console.log(req.params);
    console.log(req.params.token);

    const callback = (status) => {
        console.log(status);

        if (status == true) {
            const sendAddress = (address) => {
                res.render('../site/views/viewAddress', {
                    error: address.error,
                    address: address.data,
                    query: req.params.email,
                    url: process.env.SITE_URL,
                    token: req.params.token
                });

                console.log(address.data)
            }
            client.checkSudoAddressByEmail(decodeURIComponent(req.params.email)).then(sendAddress);
        } else {
            res.send("Invalid token, auth failed");
        }

    }

    client.checkSudoToken(req.params.token).then(
        callback
    );
});

app.get('/token/:token/edit/:email', (req, res) => {


    const callback = (status) => {

        if (status == true) {
            const sendAddress = (address) => {
                res.render('../site/views/editAddress', {
                    error: address.error,
                    address: address.data[0],
                    query: req.params.email,
                });

            }
            client.checkSudoAddressByEmail(req.params.email).then(sendAddress);
        } else {
            res.send("Invalid token, auth failed");
        }

    }

    client.checkSudoToken(req.params.token).then(
        callback
    );
});

app.get('/token/:token/edit/:email/editing/', (req, res) => {

    console.log("editing!!!!")

    const callback = (status) => {

        if (status == true) {
            const confirmSent = (error) => {
                console.log(error);
                console.log("updated address");
                res.redirect(process.env.SITE_URL + `/token/${req.params.token}/edit/${req.params.email}`)
            }
            p = req.query;
            client.updateSudoAddress(req.params.email, { "phone": p.phone, "slack": p.slack, "name": p.name, "club": p.club, "addr1": p.addr1, "addr2": p.addr2, "city": p.city, "state": p.state, "zip": p.zip, "country": p.country, "public_wildcard": "[]", "private_wildcard": "[]" }).then(confirmSent);
        } else {
            res.send("Invalid token, auth failed");
        }

    }

    client.checkSudoToken(req.params.token).then(
        callback
    );
});

app.get('/token/:token/name/:name', (req, res) => {


    console.log(req.params);

    const callback = (status) => {
        console.log(status);

        if (status == true) {
            const sendAddress = (address) => {
                res.render('../site/views/viewAddress', {
                    error: address.error,
                    address: address.data,
                    query: req.params.name,
                    url: process.env.SITE_URL,
                    token: req.params.token
                });
            }
            client.checkSudoAddressByName(decodeURIComponent(req.params.name)).then(sendAddress);
        } else {
            res.send("Invalid token, auth failed");
        }

    }

    client.checkSudoToken(req.params.token).then(
        callback
    );
});

app.get('/token/:token/add', (req, res) => {
    const callback = (status) => {
        if (status == true) {
            res.render('../site/views/add', {
                url: process.env.SITE_URL,
                token: req.params.token
            });
        } else {
            res.send('validation failed');
        }
    }

    client.checkSudoToken(req.params.token).then(
        callback
    );

    // res.render('../site/views/homepage', {
    //     emailSite: "localhost:8080/token/" + process.env.
    // });
});
app.listen(process.env.PORT || 8080,
    () => console.log("Server is running..."));
