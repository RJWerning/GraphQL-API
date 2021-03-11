const { ApolloServer, ApolloError } = require('apollo-server');
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
// const server = new ApolloServer({typeDefs, resolvers, dataSources, introspection: false});

// To disable Playground, add playground param to create of ApolloServer
//  - Running playground now gives a "GET query missing" error
// const server = new ApolloServer({typeDefs, resolvers, dataSources, playground: false});

// To disable Playground from within package.json, add the following
// "nodemonConfig": {
//     "env": {
//         "NODE_ENV": "production"
//     }
// }

// To remove stacktrace from error messages, set debug: false
// const server = new ApolloServer({typeDefs, resolvers, dataSources, debug: false});

// To clean up error message, include formatError.
//  This is more of a global catch all error handling. A better approach is to add it at the
//  point of failure.
//  Example: Don't run speakers API and put code into the calling area. 
//
//   For a more granular approach to errors, use a try/catch and throw ApolloError

const server = new ApolloServer({
    typeDefs, 
    resolvers, 
    dataSources,
    debug: false,
    formatError: (err) => {
        if (err.extensions.code == 'INTERNAL_SERVER_ERROR') {
            return new ApolloError("We are experiencing technical difficulties", "ERROR");
        }
        return err;
    }
});

server.listen({ port: process.env.port || 4000 }).then(({ url }) => {
    console.log(`graphQL running at ${url}`);
});
