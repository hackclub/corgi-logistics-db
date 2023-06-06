supabase = require('@supabase/supabase-js');
require('dotenv').config();

module.exports = class Client {
    constructor(supabaseURL, supabaseKey, expiryTime) {
        const client = supabase.createClient(supabaseURL, supabaseKey);
        this.client = client;

        // expiryTime: ms before a token expires
        this.expiryTime = expiryTime;
    }

    /*
        verification / other tools to add in 
    */

    generateSearchTokenString(string) {
        let array = string.split(" ");
        let returnedString = "";
        let lengthOf = array.length;

        for (let i = 0; i < lengthOf; i++) {
            if (i == lengthOf - 1) {
                returnedString += array[i]
            } else {
                returnedString += array[i]
                returnedString += " & "
            }

        }
        console.log(returnedString);
        return returnedString;
    }

    async checkToken(email, token) {
        const tokens = async () => {
            const response = await this.client
                .from('tokens')
                .select()
                .eq('email', email)
                .eq('token', token)
                .gt('expiry', new Date(Date.now()).toISOString());

            return response;
        }

        const response = await tokens();

        if (response["data"].length == 0) {
            return false;
        }

        return true;

    }

    async updateSudoAddress(email, address) {
        const addresses = async () => {
            const response = await this.client
                .from('people')
                .select('email')
                .eq('email', email)

            return response;
        }

        const response = await addresses();

        if (response["data"].length == 0) {
            console.log("updating address by insert")
            await this.client
                .from('people')
                .insert(
                    {
                        email: email,
                        phone: address.phone,
                        slack: address.slack,
                        name: address.name,
                        club: address.club,
                        addr1: address.addr1,
                        addr2: address.addr2,
                        city: address.city,
                        state: address.state,
                        zip: address.zip,
                        country: address.country,
                    }).then(console.log);
        }

        console.log("updating");
        const { error } = await this.client
            .from('people')
            .update({
                phone: address.phone,
                slack: address.slack,
                name: address.name,
                club: address.club,
                addr1: address.addr1,
                addr2: address.addr2,
                city: address.city,
                state: address.state,
                zip: address.zip,
                country: address.country
            })
            .eq('email', email);

        console.log(address);
    }



    async updateAddress(email, token, address) {

        /*
        insert or update, depending on availability of an existing record 

        address should be:
        
        {
            phone,
            slack,
            name,
            club,
            addr1,
            addr2,
            city,
            state,
            zip,
            country,
            public_wildcard,
            private_wildcard
        }

        */

        const authenticatedStatus = async () => {
            const response = await this.checkToken(email, token);

            return response
        }

        const auth = await authenticatedStatus();

        if (auth == false) {
            return {
                error: "invalid token",
                data: []
            }
        }


        const addresses = async () => {
            const response = await this.client
                .from('people')
                .select('email')
                .eq('email', email)

            return response;
        }

        const response = await addresses();

        if (response["data"].length == 0) {
            await this.client
                .from('people')
                .insert(
                    {
                        email: email,
                        phone: address.phone,
                        slack: address.slack,
                        name: address.name,
                        club: address.club,
                        addr1: address.addr1,
                        addr2: address.addr2,
                        city: address.city,
                        state: address.state,
                        zip: address.zip,
                        country: address.country,
                        public_wildcard: address.public_wildcard,
                        private_wildcard: address.private_wildcard
                    }).then(console.log);
        }

        const { error } = await this.client
            .from('people')
            .update({
                phone: address.phone,
                slack: address.slack,
                name: address.name,
                club: address.club,
                addr1: address.addr1,
                addr2: address.addr2,
                city: address.city,
                state: address.state,
                zip: address.zip,
                country: address.country,
                public_wildcard: address.public_wildcard,
                private_wildcard: address.private_wildcard
            })
            .eq('email', email);

        console.log(address);
    }


    async createToken(email, timeValid) {
        // create a new record


    }

    async pullAddress(email, token) {
        const authenticatedStatus = async () => {
            const response = await this.checkToken(email, token);

            return response
        }

        const auth = await authenticatedStatus();

        if (auth == false) {
            return {
                error: "invalid token",
                data: []
            }
        }

        const query = async () => {
            const response = await this.client
                .from('people')
                .select()
                .eq('email', email);

            return response;
        }

        const addressData = await query();

        if (addressData["data"].length == 0) {
            return {
                error: "no email found",
                data: []
            }
        }


        return {
            error: null,
            data: addressData.data
        }
    }

    async checkNodemaster(email, token) {
        /*
            checkNodemaster checks token 
        */

        const nodemasterStatus = async () => {
            const response = await this.client
                .from('nodemasters')
                .select('email', 'token')
                .eq('email', email)
                .eq('token', token)

            return response;
        }

        const response = await nodemasterStatus();

        if (response["data"].length == 0) {
            return false;
        }

        return true;

    }

    async checkSudoToken(token) {
        // should only be used with enhanced length passwords
        const nodemasterToken = async () => {
            const response = await this.client
                .from('nodemasters')
                .select('token')
                .eq('token', token);

            return response;
        }

        const response = await nodemasterToken();

        if (response["data"].length == 0) {
            return false;
        }

        return true;
    }

    async checkSudoAddressByEmail(email) {
        //
        //
        //
        // DANGER ZONE: DO NOT USE UNLESS PROPERLY AUTHENTICATED! THERE ARE NO AUTHENTICATION CHECKS
        // 
        //
        //

        const query = async () => {
            const response = await this.client
                .from('people')
                .select()
                .textSearch('email', email);

            console.log(response);
            return response;
        }

        const addressData = await query();

        if (addressData["data"].length == 0) {
            return {
                error: "no email found",
                data: {
                    email: email,
                    phone: '',
                    slack: '',
                    name: '',
                    club: '',
                    addr1: '',
                    addr2: '',
                    city: '',
                    state: '',
                    zip: '',
                    country: '',
                    public_wildcard: null,
                    private_wildcard: null
                }
            }
        }

        return {
            error: null,
            data: addressData.data
        }
    }

    async checkSudoAddressByEmailStrict(email) {
        //
        //
        //
        // DANGER ZONE: DO NOT USE UNLESS PROPERLY AUTHENTICATED! THERE ARE NO AUTHENTICATION CHECKS
        // same as above, but CASE SENSITIVE and not "matching"
        // 
        //
        //

        const query = async () => {
            const response = await this.client
                .from('people')
                .select()
                .eq('email', email.toLowerCase());

            return response;
        }

        const addressData = await query();

        if (addressData["data"].length == 0) {
            return {
                error: "no email found",
                data: {
                    email: email,
                    phone: '',
                    slack: '',
                    name: '',
                    club: '',
                    addr1: '',
                    addr2: '',
                    city: '',
                    state: '',
                    zip: '',
                    country: '',
                    public_wildcard: null,
                    private_wildcard: null
                }
            }
        }


        return {
            error: null,
            data: addressData.data
        }
    }

    async checkSudoAddressByUID(UID) {
        //
        //
        //
        // DANGER ZONE: DO NOT USE UNLESS PROPERLY AUTHENTICATED! THERE ARE NO AUTHENTICATION CHECKS
        // same as above, but CASE SENSITIVE and not "matching"
        // 
        //
        //

        const query = async () => {
            const response = await this.client
                .from('people')
                .select()
                .eq('slack', UID);

            return response;
        }

        const addressData = await query();

        if (addressData["data"].length == 0) {
            return {
                error: "no uid found",
                data: {
                    email: '',
                    phone: '',
                    slack: UID,
                    name: '',
                    club: '',
                    addr1: '',
                    addr2: '',
                    city: '',
                    state: '',
                    zip: '',
                    country: '',
                    public_wildcard: null,
                    private_wildcard: null
                }
            }
        }


        return {
            error: null,
            data: addressData.data
        }
    }

    async checkSudoBulkByEmailName(list) {
        var returnedData = [[], []]

        const pushData = (data) => {
            if (data.data.length > 1) {

                for (var i = 0; i < data.data.length; i++) {
                    console.log(i, "push multiple", data.data[i])
                    returnedData[1].push(data.data[i]);
                }
            } else {
                if (data.error == null) {
                    console.log("push single", data.data[0])
                    returnedData[0].push(data.data[0]);
                } else {
                    console.log("push none", data)
                    returnedData[1].push(data.data);
                }
            }
        }

        for (var i = 0; i < list.length; i++) {

            if (list[i][0] != '') {
                await this.checkSudoAddressByEmailStrict(list[i][0]).then(pushData);
            } else if (list[i][1] != '') {
                await this.checkSudoAddressByUID(list[i][1]).then(pushData);
            } else if (list[i][2] != '') {
                //no email provided, check with name
                await this.checkSudoAddressByName(list[i][2]).then(pushData);
            }
        }

        return returnedData;
    }

    async checkSudoAddressByName(name) {
        //
        //
        //
        // DANGER ZONE: DO NOT USE UNLESS PROPERLY AUTHENTICATED! THERE ARE NO AUTHENTICATION CHECKS
        // 
        //
        //

        const query = async () => {
            const response = await this.client
                .from('people')
                .select()
                .textSearch('name', this.generateSearchTokenString(name))

            return response;
        }


        const addressData = await query();

        console.log("hello", addressData);

        if (addressData["data"].length == 0) {
            return {
                error: "no name found",
                data: {
                    email: '',
                    phone: '',
                    slack: '',
                    name: name,
                    club: '',
                    addr1: '',
                    addr2: '',
                    city: '',
                    state: '',
                    zip: '',
                    country: '',
                    public_wildcard: null,
                    private_wildcard: null
                }
            }
        }


        return {
            error: null,
            data: addressData.data
        }


    }

    async checkNodemaster(nodemaster) {
        const uid = async () => {
            const response = await this.client
                .from('nodemasters')
                .select()
                .eq('slack', nodemaster)

            return response;
        }

        const response = await uid();

        if (response["data"].length == 0) {
            return false;
        }

        return true;

    }


    async updateSudoAddressUID(UID, address) {

        /*
        insert or update, depending on availability of an existing record 

        address should be:
        
        {
            phone,
            slack,
            name,
            club,
            addr1,
            addr2,
            city,
            state,
            zip,
            country,
            public_wildcard,
            private_wildcard
        }

        */


        const UIDaddresses = async () => {
            const response = await this.client
                .from('people')
                .select('slack')
                .eq('slack', UID)

            return response;
        }

        const UIDresponse = await UIDaddresses();

        const Emailaddresses = async () => {
            const response = await this.client
                .from('people')
                .select('slack')
                .eq('slack', UID)

            return response;
        }

        const Emailresponse = await Emailaddresses();

        if (UIDresponse["data"].length == 0 || Emailresponse["data"].length == 0) {
            await this.client
                .from('people')
                .insert(
                    {
                        email: address.email,
                        phone: address.phone,
                        slack: address.slack,
                        name: address.name,
                        club: address.club,
                        addr1: address.addr1,
                        addr2: address.addr2,
                        city: address.city,
                        state: address.state,
                        zip: address.zip,
                        country: address.country
                    }).then(console.log);
        }

        const { error } = await this.client
            .from('people')
            .update({
                email: address.email,
                phone: address.phone,
                slack: address.slack,
                name: address.name,
                club: address.club,
                addr1: address.addr1,
                addr2: address.addr2,
                city: address.city,
                state: address.state,
                zip: address.zip,
                country: address.country,
            })
            .eq('slack', UID);

        console.log(address, "update", error);
    }
}
