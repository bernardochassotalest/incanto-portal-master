
db.getCollection('c_cldr_pos_config').remove({"_id": "vindi-36718"});
db.getCollection('c_cldr_pos_config').remove({"_id": "itau-0713-90000"});
db.getCollection('c_cldr_pos_config').remove({"_id": "itau-2938-36930"});

db.getCollection('c_cldr_pos_config').save([
    {
        "_id": "vindi-36718",
        "Source": "vindi",
        "RefField": "charges.last_transaction.gateway.id",
        "Code" : "36718",
        "Acquirer" : {
            "Code": "itau",
            "Name": "Itau"
        },
        "Bank": "341",
        "Branch": "0713",
        "Account": "90000"
    },
    {
        "_id": "itau-0713-90000",
        "Source": "itau",
        "RefField": "bank.account",
        "Code" : "341-00713-0000090000",
        "Acquirer" : {
            "Code": "itau",
            "Name": "Itau"
        },
        "Bank": "341",
        "Branch": "0713",
        "Account": "90000",
        "Tag": "avanti"
    },
    {
        "_id": "itau-2938-36930",
        "Source": "itau",
        "RefField": "bank.account",
        "Code" : "341-02938-0000036930",
        "Acquirer" : {
            "Code": "itau",
            "Name": "Itau"
        },
        "Bank": "341",
        "Branch": "0713",
        "Account": "14722",
        "Tag": "multiclubes"
    },
]);

