module.exports = {
  sessions: (parent, args, { dataSources }, info) => {
    return dataSources.sessionAPI.getSessions(args);
  },
  sessionById: (parent, { id }, { dataSources }, info) => {
    try {
      return dataSources.sessionAPI.getSessionById(id);
    } catch (error) {
      return {
        code: 'ERROR',
        message: 'An error occured',
        token: '13423rhrfhefewe',
      };
    }
  },
  speakers: (parent, args, { dataSources }, info) => {
    return dataSources.speakerAPI.getSpeakers();
  },
  speakerById: (parent, { id }, { dataSources }, info) => {
    return dataSources.speakerAPI.getSpeakerById(id);
  },
};
