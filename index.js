import { ApolloServer } from 'apollo-server';
import typeDefs from "./graphql/type.definition.js";
import resolvers from "./graphql/resolver.js";
import connectDB from "./db/db.connet.js";
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { MONGO_URI, PORT } from "./configuration.js";
import permissions from './graphql/permission.js';
import todoModel from './model/todo.js';
import { tokenVerifier } from './assessories/token.verifier.js';




const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})

const schema_with_permission = applyMiddleware(schema, permissions);

const server = new ApolloServer({
    schema: schema_with_permission,
    context: ({ req }) => {
        const user = req.headers.authorization;
        const Todo = todoModel;
        let current_user = ''
        if (user) {
            let token = user.split(' ')[1];
            const payload = tokenVerifier(token);
            current_user = payload;
        }
       
        return { user, Todo, current_user};
      },
      
})


const startUp = async () => {

    await connectDB(MONGO_URI);
    const {url} = await server.listen({port: PORT})

    console.log(`\n Server running on ${url}`);
}

startUp();



