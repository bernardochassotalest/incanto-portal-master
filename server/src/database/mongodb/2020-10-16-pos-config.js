

db.getCollection('c_cldr_pos_config').save([
    {
        "_id": "maxipago-35347",
        "Source": "maxipago",
        "RefField": "MERCHANT_ID",
        "Code" : "35347",
        "Acquirer" : {
            "Code": "rede",
            "Name": "Rede"
        },
        "PointOfSale" : "068836147",
    },
    {
        "_id": "skytef-00005",
        "Source": "skytef",
        "RefField": "TransactionsPayments.Details.OperatorCode",
        "Code" : "00005",
        "Acquirer" : {
            "Code": "rede",
            "Name": "Rede"
        },
        "PointOfSale" : "083065237",
    },
    {
        "_id": "vindi-36716",
        "Source": "vindi",
        "RefField": "charges.last_transaction.gateway.id",
        "Code" : "36716",
        "Acquirer" : {
            "Code": "cielo",
            "Name": "Cielo"
        },
        "PointOfSale" : "1018553425",
    },
    {
        "_id": "vindi-40246",
        "Source": "vindi",
        "RefField": "charges.last_transaction.gateway.id",
        "Code" : "40246",
        "Acquirer" : {
            "Code": "rede",
            "Name": "Rede"
        },
        "PointOfSale" : "023017210",
    },
    {
        "_id": "vindi-1959",
        "Source": "vindi",
        "RefField": "charges.last_transaction.gateway.id",
        "Code" : "1959",
        "Acquirer" : {
            "Code": "cielo",
            "Name": "Cielo"
        },
        "PointOfSale" : "1018553425",
    },
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
        "Branch": "2938",
        "Account": "31065"
    },
    {
        "_id": "itau-2938-31065",
        "Source": "itau",
        "RefField": "bank.account",
        "Code" : "341-02938-0000031065",
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
        "Account": "90000",
        "Tag": "multiclubes"
    },
    {
        "_id": "multiclubes-0",
        "Source": "multiclubes",
        "RefField": "Items.Tef.Type.ID",
        "Code" : "0",
        "Acquirer" : {
            "Code": "cielo",
            "Name": "Cielo"
        },
        "PointOfSale" : "001089256598",
    },
    {
        "_id": "multiclubes-1",
        "Source": "multiclubes",
        "RefField": "Items.Tef.Type.ID",
        "Code" : "1",
        "Acquirer" : {
            "Code": "cielo",
            "Name": "Cielo"
        },
        "PointOfSale" : "001095349411",
    },
    {
        "_id": "multiclubes-2",
        "Source": "multiclubes",
        "RefField": "Items.Tef.Type.ID",
        "Code" : "2",
        "Acquirer" : {
            "Code": "cielo",
            "Name": "Cielo"
        },
        "PointOfSale" : "001089256598",
    },
])
