# GraphQL-API

## Building a GraphQL API with Apollo Server (and NodeJS) - Jonathan Mills

https://app.pluralsight.com/course-player?clipId=7ebd1712-79cf-4596-bc04-bc4e73e87a90

    Scenario > updates for Globomantics
    	https://www.pluralsight.com/teach/author-tools/globomantics/index

    	Build out a GraphQL API so UI team can customize what they get

    Apollo - a node.js implementation of the GraphQL specification that does a lot of heavy lifting for use so we can just get to the business needs.

### Chapter 2: Setup

    c:\development\graphql-api-with-apollo

    > npm init
    > npm install apollo-server@2.12
    > npm isntall nodemon
    > npm install graphql

    * Add VS Code extension > Apollo GraphQL

A schema allows the client to understand what properties are available on your api. And enables them to select only the fields they want.

-   Apollo Playground > a graphical, interactive, in-browser GraphQL IDE
-   Introspection > The ability to query which resources are available in the current API schema. Given the API, via introspection, we can see the queries, types, fields and directives it supports.
-   Postman supports a request type for GraphQL right out of the box, this is what we'll use.
    localhost:4000
    body: GraphQL
    Query >
    ```
    {
        \_\_schema {
            types {
                name
            }
        }
    }
    ```

### Chapter 3: Resolving Queries:

    - Resolver Maps
    - Executing queries
    - Schema directives
    - Implementing datasources
    - Query byId
    - Filtering queries
    - Code Cleanup

Resolver : A function that is responsible for populating the data for a single field in your schema
Resolver Map : A big object that holds all of those Type > Field > Resolver functions
Going to use mock data, can hook it up to real data in Jonathan's MongoDB course

-   Add sessions to index.js requires
-   create resolver for sessions
-   in GraphQL Playground, enter a query to return all sessions
    query {
    sessions {
    title,
    room,
    track
    }
    }

-   Field level directives
    @include(if: Boolean!) > Calls the resolver for the annotated field if the boolean is true
    @skip(if: Boolean!) > Skips the annotated field if the boolean is true
    @deprecated(reason: String) > Mark a field as deprecated with a reason for its future removal

You can do custom directives if required, not covered in this course
Deprecated will show up in the schema

-   Implement a datasource
    const {DataSource} = require('apollo-datasource');
    Need to install apollo-datasource

    > npm install apollo-datasource@0.7.0

-   Implement getSessionById
    Need to install lodash

    > npm install lodash@4.17

    create function in sessions.js
    add use to Query & resolvers in index.js

-   Filtering by many columns

To disable introspection, add introspection param to create of ApolloServer

-   This allows Playground to work but cannot see Docs or Schema
    To disable Playground, add playground param to create of ApolloServer
-   Running playground now gives a "GET query missing" error
    const server = new ApolloServer({typeDefs, resolvers, dataSources, introspection: false, playground: false});
    To disable Playground from within package.json, add the following
    "nodemonConfig": {
    "env": {
    "NODE_ENV": "production"
    }
    }
