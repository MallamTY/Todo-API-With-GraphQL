import { ApolloServer } from 'apollo-server';
import typeDefs from "./graphql/type.definition.js";
import resolvers from "./graphql/resolver.js";
import connectDB from "./db/db.connet.js";
import { MONGO_URI, PORT } from "./configuration.js";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const server = new ApolloServer({
    typeDefs,
    resolvers
})


const startUp = async () => {

    await connectDB(MONGO_URI);
    const {url} = await server.listen({port: 7000})

    console.log(`\n ${url}`);
}

startUp();



