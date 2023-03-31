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
                data: []
            }
        }


        return {
            error: null,
            data: addressData.data
        }
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
                .textSearch('name', name)

            return response;
        }

        const addressData = await query();

        if (addressData["data"].length == 0) {
            return {
                error: "no name found",
                data: []
            }
        }


        return {
            error: null,
            data: addressData.data
        }
    }

}
