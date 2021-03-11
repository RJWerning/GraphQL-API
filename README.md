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
