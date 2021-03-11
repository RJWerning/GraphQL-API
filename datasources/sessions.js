const sessions = require('../data/sessions.json');
const _ = require('lodash');
const {DataSource} = require('apollo-datasource');

class SessionAPI extends DataSource {
    constructor() {
        super();
    }

    initialize(config) {
    }

    getSessions(args) {
        return _.filter(sessions, args);
    };

    getSessionById(id) {
        const session = _.filter(sessions, {id: parseInt(id)});
        return session[0];
    }

    toggleFavoriteSession(id) {
        const session = _.filter(sessions, {id: parseInt(id)});
        session[0].favorite = !session[0].favorite;
        return session[0];
    }

    addSession(session){ 
        session.id = 1234;
        sessions.push(session);
    }
}

module.exports = SessionAPI;