const { ApolloError } = require('apollo-server-errors');
const _ = require('lodash');

module.exports = {
    async speakers(session, args, {dataSources}) {
        try {
            console.log('speakers');
            const speakers = await dataSources.speakerAPI.getSpeakers();
            const returns = speakers.filter((speaker) => {
                return _.filter(session.speakers, {id: speaker.id}).length > 0;
            });
    
            return returns;                
        } catch (error) {
            console.log('error', error);
            return new ApolloError("Unable to retrieve speakers", "SPEAKERAPIERROR");
        }
    }
}