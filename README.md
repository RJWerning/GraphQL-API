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

### Chapter 4: Nesting Queries:

    Already has a mock API created, just change to that dir & run npm
    C:\Development\GraphQL-API Demo source\04\demos\code\speakers>
    > npm install nodemon
    > npm install
    > npm run start

    Verify in browser - http://localhost:3000/speakers

    Apollo provides a default REST datasource out of the box
    > npm install apollo-datasource-rest@0.9.3

    In resolvers.js, we need to create a Session resolver for speakers since we added speakers: [Speaker] to Session in schema.js.
    This is how we create a way for Graph to populate the speakers array, since speakers is not a default Scalar type.

    The Apollo RESTDataSource calls are cached, so even though we reference it multiple times it actually only calls it once

### Chapter 5: Mutating Data

    - Modifying data (CRUD)

    In Playground to execute a mutation, instead of a query like we have been doing:
    	mutation {
    	  toggleFavoriteSession(id: "84473") {
    	    title
    	    favorite
    	  }
    	}

    You can't do both a query & mutation in the same playground execution, you can however do multiple of either.

    - Input Types > Need to define an input type for add methods
    	input SessionInput {
    	    title: String!,
    	    description: String,
    	    startsAt: String,
    	    endsAt: String,
    	    room: String,
    	    day: String,
    	    format: String,
    	    track: String,
    	    level: String,
    	    favorite: Boolean,
    	}

    Playground execute mutation:
    	mutation {
    	  addNewSession(session: {
    	    title: "New Session",
    	    description: "This is a great session"
    	  }){
    	    id
    	    title
    	    description
    	  }
    	}

    - Enums are kinda neat but have issues, by convention they should be all caps. But that doesn't often translate to what is stored in data.  ie. EUROPA vs Europa.  So then you need a resolver to convert the ENUM to the value.

### Chapter 6: Error Handling and Validation

    - Built in error handling
    	Query object validation automatically occur, can't query for fields that don't exist or reference a scalar type (string) as if it was an object.
    	Out of the box the error message is rather messy, it includes stacktraces

    - Cleaner Error Messages
    	Remove stacktrace from error, debug:
    		const server = new ApolloServer({typeDefs, resolvers, dataSources, debug: false});

    	To clean up error message, include formatError
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


    	For a more granular approach to errors, use a try/catch and throw ApolloError
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


    - Unions for Better Errors
    	in schema > define field as typeOrError > sessionById(id: ID): SessionOrError,
    	Define the union > union SessionOrError = Session | Error
    	In Resolvers, define the typeOrError object
    	    SessionOrError: {
    	        __resolveType(obj) {
    	            if (obj.code) {
    	                return 'Error';
    	            }
    	            return 'Session';
    	        },
    	    },

    Playground query would need to be reformated to handle the fragment annotation (spread operator)
    	query {
    	  sessionById(id: "84473") {
    	    ... on Session {
    	      title
    	      favorite
    	      room
    	      track
    	      id
    	      level
    	      description
    	      speakers {
    	        name
    	      }
    	    }
    	    ... on Error {
    	      code
    	      message
    	    }
    	  }
    	}

### Chapter 7: Working with Apollo Studio

    Watched but did not follow exercises
    https://studio.apollographql.com/
    Signed up using my github account RWerning, company is WerningSoftwareLLC

    Easy setup, provides real-time metrics on performance, errors etc.

    Automatically tracks version as you push new versions to Studio

    Checks for errors when you do pushes (Lint?)
