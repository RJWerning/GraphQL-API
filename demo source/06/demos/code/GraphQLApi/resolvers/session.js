const _ = require('lodash');
const { ApolloError } = require('apollo-server');

module.exports = {
  speakers: async (session, args, { dataSources }, info) => {
    try {
      const speakers = await dataSources.speakerAPI.getSpeakers();
      const returns = speakers.filter((speaker) => {
        return _.filter(session.speakers, { id: speaker.id }).length > 0;
      });
      return returns;
    } catch (error) {
      return new ApolloError('Unable to retrieve speakers', 'SPEAKERAPIERROR', {
        token: 'uniquetoken',
      });
    }
  },
};
