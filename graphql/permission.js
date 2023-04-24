import { ApolloError } from "apollo-server"
import { rule, shield } from "graphql-shield";
import { tokenVerifier } from "../assessories/token.verifier.js";

export const isAuthenticated = rule()(async (parent, args, context, info) => {
  try {
    if (context.user === undefined) {
      return new ApolloError('Unathorized access', 403);
  }

  else {
    let token = context.user;
    token = token.split(' ')[1];
    
    if (!token) {
      return new ApolloError('Unauthorized access', 403);
    }
    
    return true;
  }
  } catch (error) {
    return ApolloError('Error verifying your tooken', 500)
  }
    
  })
  


  
  // Permissions
  const permissions = shield({
    Query: {
      getSingleTask: isAuthenticated,
      getTaskByAmount: isAuthenticated,
      getAllTasks: isAuthenticated
    },
    Mutation: {
      createTask: isAuthenticated,
      updateTask: isAuthenticated,
      deleteTask: isAuthenticated
    }
  })


  export default permissions;