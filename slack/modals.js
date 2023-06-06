const { App } = require("@slack/bolt");
const countries = require("./countries");

function generateCountryModal(region) {
    let optionList = [];

    let countryList = countries[region];

    for (let i = 0; i < countryList.length; i++) {
        optionList.push({
            "text": {
                "type": "plain_text",
                "text": countryList[i],
                "emoji": true
            },
            "value": countryList[i]
        })
    }

    console.log(optionList);
    console.log(countryList);

    return {
        "blocks": [
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Select your country"
                },
                "accessory": {
                    "type": "static_select",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select an item",
                        "emoji": true
                    },
                    "options": optionList,
                    "action_id": "static_select-action"
                }
            }
        ]
    }


}

function generateAddressModal(email, address) {
    console.log(address);
    if (address.addr2 === null || address.addr2 === undefined || address.addr2 == '') {

        console.log("no addr2")
        return {
            "type":
                "modal",
            "callback_id":
                "address-modal",
            "title": {
                "type": "plain_text",
                "text": "Address Update",
                "emoji": true
            },
            "submit": {
                "type": "plain_text",
                "text": "Submit",
                "emoji": true
            },
            "close": {
                "type": "plain_text",
                "text": "Cancel",
                "emoji": true
            },
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "plain_text",
                        "text": "Update your address!",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "email",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": email
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Email",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "optional": true,
                    "block_id": "phone",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.phone
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Phone Number",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "name",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.name
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Name",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "addr1",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.addr1
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Address Line 1",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "addr2",
                    "optional": true,
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Address Line 2",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "city",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.city
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "City",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "state",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.state
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "State",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "zip",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.zip
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Zip",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "country",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.country
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Country",
                        "emoji": true
                    }
                }
            ]
        }
    } else {
        console.log("addr2 there", address.addr2)
        return {
            "type":
                "modal",
            "callback_id":
                "address-modal",
            "title": {
                "type": "plain_text",
                "text": "Address Update",
                "emoji": true
            },
            "submit": {
                "type": "plain_text",
                "text": "Submit",
                "emoji": true
            },
            "close": {
                "type": "plain_text",
                "text": "Cancel",
                "emoji": true
            },
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "plain_text",
                        "text": "Update your address here! Whatever we have stored for you is pre-filled, so if it's blank, that means we don't have an address stored for you.",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "email",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": email
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Email",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "optional": true,
                    "block_id": "phone",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.phone
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Phone Number",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "name",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.name
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Name",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "addr1",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.addr1
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Address Line 1",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "addr2",
                    "optional": true,
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.addr2
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Address Line 2",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "city",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.city
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "City",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "state",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.state
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "State / Province",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "zip",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.zip
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Postal Code",
                        "emoji": true
                    }
                },
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "plain_text",
                            "text": "If your country doesn't use a Postal Code, enter 000000.",
                            "emoji": true
                        }
                    ]
                },
                {
                    "type": "input",
                    "block_id": "country",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.country
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Country",
                        "emoji": true
                    }
                }
            ]
        }
    }
}

function generateEditAddressModal(email, UID, address) {
    if (address.addr2 == null || address.addr2 == '') {
        return {
            "type":
                "modal",
            "callback_id":
                "edit-modal",
            "title": {
                "type": "plain_text",
                "text": "Address Update",
                "emoji": true
            },
            "submit": {
                "type": "plain_text",
                "text": "Submit",
                "emoji": true
            },
            "close": {
                "type": "plain_text",
                "text": "Cancel",
                "emoji": true
            },
            "blocks": [
                {
                    "type": "input",
                    "block_id": "uid",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": UID
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Slack UID, DO NOT TOUCH THIS FIELD",
                        "emoji": true
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "plain_text",
                        "text": "Update your address!",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "email",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": email
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Email",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "optional": true,
                    "block_id": "phone",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.phone
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Phone Number",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "name",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.name
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Name",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "addr1",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.addr1
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Address Line 1",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "addr2",
                    "optional": true,
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Address Line 2",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "city",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.city
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "City",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "state",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.state
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "State",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "zip",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.zip
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Zip",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "country",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.country
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Country",
                        "emoji": true
                    }
                }
            ]
        }
    } else {
        return {
            "type":
                "modal",
            "callback_id":
                "address-modal",
            "title": {
                "type": "plain_text",
                "text": "Address Update",
                "emoji": true
            },
            "submit": {
                "type": "plain_text",
                "text": "Submit",
                "emoji": true
            },
            "close": {
                "type": "plain_text",
                "text": "Cancel",
                "emoji": true
            },
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "plain_text",
                        "text": "Update your address!",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "email",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": email
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Email",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "optional": true,
                    "block_id": "phone",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.phone
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Phone Number",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "name",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.name
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Name",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "addr1",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.addr1
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Address Line 1",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "addr2",
                    "optional": true,
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.addr2
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Address Line 2",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "city",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.city
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "City",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "state",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.state
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "State",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "zip",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.zip
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Zip",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "country",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "value",
                        "initial_value": address.country
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Country",
                        "emoji": true
                    }
                }
            ]
        }
    }
}
module.exports = {
    regionModal: {
        type: 'modal',
        // View identifier
        callback_id: 'region_select',
        title: {
            type: 'plain_text',
            text: 'Modal title'
        },
        "submit": {
            "type": "plain_text",
            "text": "Submit",
            "emoji": true
        },
        "blocks": [
            {
                "type": "divider"
            },
            {
                "type": "section",
                "block_id": "static_select_region",
                "text": {
                    "type": "mrkdwn",
                    "text": "Select your region"
                },
                "accessory": {
                    "type": "static_select",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select an item",
                        "emoji": true
                    },
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "North America",
                                "emoji": true
                            },
                            "value": "north_america"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "South America",
                                "emoji": true
                            },
                            "value": "south_america"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Europe",
                                "emoji": true
                            },
                            "value": "europe"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Asia",
                                "emoji": true
                            },
                            "value": "asia"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Africa",
                                "emoji": true
                            },
                            "value": "africa"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Oceania/Australia",
                                "emoji": true
                            },
                            "value": "aussie"
                        }
                    ],
                    "action_id": "static_select-action"
                }
            },

        ]
    },
    generateAddressModal,
    generateCountryModal,
    generateEditAddressModal



}

