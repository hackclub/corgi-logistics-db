## The Corgi Logistics Database System!

Hack Club has a robust and creative ethos of mailing things! To support this, having an easy-to-use address and mail system is key. Right now, there's no simple way of finding anyone's latest address. We're fixing this!
This is an ongoing project to build mail infrastructure for Hack Club. 

A few major goals:
- Streamline mail operations by Hack Club
- Easy access to up-to-date addresses
- Enhance mail experience to Hack Clubbers
- Modular design for future expansion
- Incorporates latest postal technologies, where possible

This is a multi-component project. Here's the three key parts:

### MailCorgi API
RESTful API to power both below. This will be used for all address interfacing. Additionally, this can be easily integrated into sign-up forms for HQ events, like Assemble.

### Address Update Website
Hack Clubbers will be able to log-in and authenticate themselves by an email identifier. Once logged in, HC'ers can view and update their address. These changes will go directly to the SQL database. 
- Offer USPS CASS standardization on domestic addresses
- Allow country-specific metadata, such as entry of CPF tax IDs in Brazil, or Zip+4 and Delivery Point Codes in the US. 
- Simple and fast- no more DMing staff!

### HackShip
For mailing operations, we'll have our own mailing frontend. Offers comparable and enhanced functionality compared to software like PirateShip and Shippo- due to integration with our database.
- Generate PDF labels for envelopes
- Intelligent Mail support for domestic mailpieces
- At a later date, purchase parcel shipping labels from a variety of carriers with neogotiated, below-retail rates
- Auto-fill based off information in database
- Query tool, to locate addresses via an assortment of information available(name, email, partial address, etc)
- Easily query and/or ship in bulk - download a spreadsheet of addresses, or perhaps purchase a large number of labels.
- Scan a QR code and upload a picture directly to #packages to confirm receipt of mailpiece!

### Further Expansion
This is designed with flexibility and enhancements in mind. The software will be modular- allowing migrations without code rewrites, and easy expansion of features.
There is also an oppurtunity to build custom hardware- such as a dedicated mailstation, intelligent scale, and more.
