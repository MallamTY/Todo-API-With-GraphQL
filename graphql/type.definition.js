import { gql } from "apollo-server";



const typeDefs = gql`
type Task {
    id: ID!
     task_title: String!
     status: String!
     description: String!
     createdAt: String!
}

type User {
    id: ID!
    username: String!
    email: String!
}

type LoginUser {
    id: ID!
    username: String!
    email: String!
    token: String!
}

input TaskInput {
    task_title: String!
    status: String!
    description: String!
}

input EditTaskInput {
    task_title: String
    status: String
    description: String
}

input regInput{
    username: String!
    password: String!
    confirm_password: String!
    email: String!
}

input loginInput {
    email: String!
    password: String!
}

type Query {
    getSingleTask (id: ID!): Task!
    getTaskByAmount (amount: Int!): [Task!]!
    getAllTasks: [Task!]!
}

type Mutation {
    createTask (taskInput: TaskInput!): Task!
    updateTask (id: ID!, editeTaskInput: EditTaskInput!): String
    deleteTask (id: ID!): String
    registerUser(userInput: regInput!): User!
    loginUser(loginInput: loginInput): LoginUser!


}
`



export default typeDefs;