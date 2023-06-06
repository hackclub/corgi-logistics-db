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
const supabaseClient = client;

const { WebClient, LogLevel } = require("@slack/web-api");

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN, {
    // LogLevel can be imported and used to make debugging simpler
    logLevel: LogLevel.DEBUG
});

const { App } = require('@slack/bolt');

const slackApp = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true, // add this
    appToken: process.env.SLACK_APP_TOKEN // add this
});


const modalViews = require('../slack/modals');
const modals = require('../slack/modals');


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

                try {
                    address.data.forEach(function () { });
                } catch (error) {
                    res.render('../site/views/noResults', {
                    });
                    return
                }
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
                    url: process.env.SITE_URL,
                    token: req.params.token
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

                try {
                    address.data.forEach(function () { });
                } catch (error) {
                    console.log(error, "\n\n\n test \n\n\n")
                    res.render('../site/views/noResults', {
                    });
                    return
                }

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








slackApp.command('/update', async ({ ack, body, command, client, logger }) => {
    // Acknowledge command request
    await ack();


    slackProfileInfo = await slackClient.users.info({ user: command.user_id });
    console.log(slackProfileInfo);
    address = await supabaseClient.checkSudoAddressByUID(command.user_id);
    console.log(address);

    if (address.error === null || address.error === undefined) {
        if (address.data[0].phone === null || address.data[0].phone === undefined) {
            address.data[0].phone = '';
        }

        if (address.data[0].addr2 === null || address.data[0].addr2 === undefined) {
            address.data[0].addr2 = '';
        }

        addressView = modalViews.generateAddressModal(address.data[0].email, address.data[0]);
    } else {
        addressView = modalViews.generateAddressModal(slackProfileInfo.user.profile.email, address.data);
    }

    console.log(addressView)


    try {
        // Call views.open with the built-in client
        const result = await client.views.open({
            // Pass a valid trigger_id within 3 seconds of receiving it
            trigger_id: body.trigger_id,
            // View payload
            view: addressView
        });
    }
    catch (error) {
        logger.error(error);
        console.log("\n\n\n", error.data.response_metadata);

    }
});

// slackApp.view('region_select', async ({ ack, view, body }) => {
//     await ack({
//         response_action: 'update',
//         view: modalViews.generateCountryModal(view['state']['values']['static_select_region']['static_select-action']['selected_option']['value']),
//     });
// });

slackApp.view('address-modal', async ({ ack, body, view, client, logger }) => {
    await ack();
    console.log("\n\n\n", view['state']['values']);
    slackUID = body.user.id;

    address = view['state']['values'];

    supabaseClient.updateSudoAddressUID(slackUID, {
        email: address.email.value.value,
        slack: slackUID,
        phone: address.phone.value.value,
        name: address.name.value.value,
        addr1: address.addr1.value.value,
        addr2: address.addr2.value.value,
        city: address.city.value.value,
        state: address.state.value.value,
        zip: address.zip.value.value,
        country: address.country.value.value
    });

});

slackApp.command('/nodemaster', async ({ ack, body, command, client, logger, say }) => {
    // Acknowledge command request
    await ack();

    try {
        slackID = body.text.split("<@")[1].split("|")[0];
    } catch {
        try {

            // Call the chat.postEphemeral method using the WebClient
            const result = await client.chat.postEphemeral({
                channel: body.channel_id,
                user: body.user_id,
                text: "Enter only a slack tag."
            });

            console.log(result);
        }
        catch (error) {
            console.error(error);
        }
    }

    requestID = body.user_id;

    nodemaster = await supabaseClient.checkNodemaster(requestID);

    if (nodemaster) {

        slackProfileInfo = await slackClient.users.info({ user: slackID });
        console.log(slackProfileInfo);
        address = await supabaseClient.checkSudoAddressByUID(slackID);
        console.log(address);

        if (address.error != null) {
            try {
                const result = await client.chat.postEphemeral({
                    channel: body.channel_id,
                    user: body.user_id,
                    text: `
No address for ${address.name}.
                `
                });
            } catch (error) {
                logger.error(error);
            }
        }
        else {
            try {
                // Call views.open with the built-in client
                if (address.data[0].addr2 == null || address.data[0].addr2 == '') {
                    const result = await client.chat.postEphemeral({
                        channel: body.channel_id,
                        user: body.user_id,
                        text: `
Address for ${address.data[0].name}
${address.data[0].phone}, ${address.data[0].email}, ${address.data[0].slack}
\`\`\`
${address.data[0].addr1}
${address.data[0].city} ${address.data[0].state}  ${address.data[0].zip}
${address.data[0].country}
\`\`\`
                    `
                    });
                }
                else {
                    const result = await client.chat.postEphemeral({
                        channel: body.channel_id,
                        user: body.user_id,
                        text: `
Address for ${address.data[0].name}
${address.data[0].phone}, ${address.data[0].email}, ${address.data[0].slack}
    
\`\`\`
${address.data[0].addr1}
${address.data[0].addr2}
${address.data[0].city} ${address.data[0].state}  ${address.data[0].zip}
${address.data[0].country}
\`\`\`
                    `
                    });
                }
            }
            catch (error) {
                logger.error(error);
            }
        }

    } else {
        try {

            // Call the chat.postEphemeral method using the WebClient
            const result = await client.chat.postEphemeral({
                channel: body.channel_id,
                user: body.user_id,
                text: "You're not a nodemaster! What a silly goose"
            });

            console.log(result);
        }
        catch (error) {
            console.error(error);
        }
    }

    console.log(slackID, requestID);
});



slackApp.command('/nodemasteredit', async ({ ack, body, command, client, logger, say }) => {
    // Acknowledge command request
    await ack();

    try {
        slackID = body.text.split("<@")[1].split("|")[0];
    } catch {
        try {

            // Call the chat.postEphemeral method using the WebClient
            const result = await client.chat.postEphemeral({
                channel: body.channel_id,
                user: body.user_id,
                text: "Enter only a slack tag."
            });

            console.log(result);
        }
        catch (error) {
            console.error(error);
        }
    }

    requestID = body.user_id;

    nodemaster = await supabaseClient.checkNodemaster(requestID);

    if (nodemaster) {

        slackProfileInfo = await slackClient.users.info({ user: slackID });
        console.log(slackProfileInfo);
        address = await supabaseClient.checkSudoAddressByUID(slackID);
        console.log(address);

        if (address.error != null) {
            addressView = modalViews.generateEditAddressModal(slackProfileInfo.user.profile.email, slackID, address.data);
        }
        else {
            if (address.data[0].phone === null || address.data[0].phone === undefined) {
                address.data[0].phone = '';
            }

            if (address.data[0].addr2 === null || address.data[0].addr2 === undefined) {
                address.data[0].addr2 = '';
            }
            addressView = modalViews.generateEditAddressModal(address.data[0].email, slackID, address.data[0]);
        }
        try {
            // Call views.open with the built-in client
            const result = await client.views.open({
                // Pass a valid trigger_id within 3 seconds of receiving it
                trigger_id: body.trigger_id,
                // View payload
                view: addressView
            });
        }
        catch (error) {
            logger.error(error);
        }
    } else {
        try {

            // Call the chat.postEphemeral method using the WebClient
            const result = await client.chat.postEphemeral({
                channel: body.channel_id,
                user: body.user_id,
                text: "You're not a nodemaster! What a silly goose"
            });

            console.log(result);
        }
        catch (error) {
            console.error(error);
        }
    }

    console.log(slackID, requestID);
});

slackApp.view('edit-modal', async ({ ack, body, view, client, logger }) => {
    await ack();

    address = view['state']['values'];

    slackUID = address.uid.value.value;

    console.log(slackUID);

    supabaseClient.updateSudoAddressUID(slackUID, {
        email: address.email.value.value,
        slack: slackUID,
        phone: address.phone.value.value,
        name: address.name.value.value,
        addr1: address.addr1.value.value,
        addr2: address.addr2.value.value,
        city: address.city.value.value,
        state: address.state.value.value,
        zip: address.zip.value.value,
        country: address.country.value.value
    });

});

app.listen(process.env.PORT || 8080,
    () => console.log("Server is running..."));

(async () => {
    await slackApp.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();
