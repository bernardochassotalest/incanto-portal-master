import _ from 'lodash';

export default {
    clientId: process.env.NEWC_CLIENTID,
    matchTest: _.toString(_.toUpper(process.env.NEWC_MATCH_TEST)),
    api: {
        'url': process.env.NEWC_APIURL,
        'key': process.env.NEWC_APIKEY,
    }
};
