
db.getCollection('c_cldr_pos_config').save([
    {
        "_id": "itau-4818108310435",
        "Source": "itau",
        "RefField": "bank.companyCode",
        "Code" : "4818108310435",
        "Bank": "341",
        "Branch": "0713",
        "Account": "90000",
        "DigitAccount": "9",
        "Tag": "avanti"
    },
    {
        "_id": "itau-3823205200605",
        "Source": "itau",
        "RefField": "bank.companyCode",
        "Code" : "3823205200605",
        "Bank": "341",
        "Branch": "0713",
        "Account": "90000",
        "DigitAccount": "9",
        "Tag": "multiclubes"
    },
    {
        "_id": "vindi-36717",
        "Source": "vindi",
        "RefField": "charges.last_transaction.gateway.id",
        "Code" : "36717",
        "Acquirer" : {
            "Code": "itau",
            "Name": "Itau"
        },
        "Bank": "341",
        "Branch": "0713",
        "Account": "90000"
    },
])

