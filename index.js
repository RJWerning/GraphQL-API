const { ApolloServer } = require('apollo-server');
const SessionAPI = require('./datasources/sessions');
const SpeakerAPI = require('./datasources/speakers');
const typeDefs = require('./schema.js');
const resolvers = require('./resolvers.js');

const dataSources = () => ({
    sessionAPI: new SessionAPI(),
    speakerAPI: new SpeakerAPI(),
})

// To disable introspection, add introspection param to create of ApolloServer
//  - This allows Playground to work but cannot see Docs or Schema
// To disable Playground, add playground param to create of ApolloServer
//  - Running playground now gives a "GET query missing" error
// const server = new ApolloServer({typeDefs, resolvers, dataSources, introspection: false, playground: false});
// To disable Playground from within package.json, add the following
// "nodemonConfig": {
//     "env": {
//         "NODE_ENV": "production"
//     }
// }

const server = new ApolloServer({typeDefs, resolvers, dataSources});

server.listen({ port: process.env.port || 4000 }).then(({ url }) => {
    console.log(`graphQL running at ${url}`);
});
