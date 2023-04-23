import { gql } from "apollo-server";


const typeDefs = gql`
type Task {
    id: ID!
     task_title: String!
     status: String!
     description: String!
     createdAt: String!
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

type Query {
    getSingleTask (id: ID!): Task!
    getTaskByAmount (amount: Int!): [Task!]!
    getAllTasks: [Task!]!
}

type Mutation {
    createTask (taskInput: TaskInput!): Task!
    updateTask (id: ID!, editeTaskInput: EditTaskInput!): Boolean
    deleteTask (id: ID!): Boolean


}
`



export default typeDefs;