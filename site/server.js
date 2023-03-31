const express = require('express')
const app = express()
const port = 8080
require('dotenv').config();

const Client = require("../mailcorgi API/database/supabase");

const client = new Client(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, 900000);

app.set("view engine", "ejs");

app.get('/token/:token', (req, res) => {
    const callback = (status) => {
        if (status == true) {
            res.render('../site/views/authenticated', {
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

app.get('/test', (req, res) => {
    res.send("Test send!");
});

app.get('/second/:test', (req, res) => {
    res.send("Test send!");
});

app.get('/third/:third', (req, res) => {
    res.send(req.params.third);
});

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
                });

                console.log(address.data)
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

app.get('/token/:token/edit/:email', (req, res) => {


    console.log(req.params);
    console.log(req.params.token);

    const callback = (status) => {
        console.log(status);

        if (status == true) {
            const sendAddress = (address) => {
                res.render('../site/views/editAddress', {
                    error: address.error,
                    address: address.data[0],
                    query: req.params.email,
                });

                console.log(address.data)
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

app.get('/token/:token/edit/:email/:phone/:slack/:name/:club/:addr1/:addr2/:city/:state/:zip/:country/:public_wildcard/:private_wildcard', (req, res) => {
    console.log(req.params);
    console.log(req.params.token);

    const callback = (status) => {
        console.log(status);

        if (status == true) {
            const confirmSent = () => {
                console.log("updated address");
            }
            p = req.params;
            client.updateAddress(req.params.email, req.params.token, [p.phone, p.slack, p.name, p.club, p.addr1, p.addr2, p.city, p.state, p.zip, p.country, p.public_wildcard, p.private_wildcard]).then(confirmSent);
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
                });
            }
            client.checkSudoAddressByName(req.params.name).then(sendAddress);
        } else {
            res.send("Invalid token, auth failed");
        }

    }

    client.checkSudoToken(req.params.token).then(
        callback
    );
});

app.listen(process.env.PORT || 8080,
    () => console.log("Server is running..."));