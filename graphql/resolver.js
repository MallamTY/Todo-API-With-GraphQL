import { ApolloError } from "apollo-server";
import validator from "validator";
import todoModel from "../model/todo.js";
import User from "../model/user.js";
import { encrypter } from "../assessories/encrypter.js";
import { compare, genSalt } from "bcrypt";
import { tokenIssuer } from "../assessories/token.issuer.js";


const resolvers = {
    Query: {
        async getSingleTask (_, {id}) {
            
            const task = await todoModel.findById(id);
            
            return {
                id: task.id,
                ...task._doc
            }
            
        },

        async getTaskByAmount (_, {amount}) {
            const tasks = await todoModel.find().sort({createdAt: 1}).limit(amount);
            return tasks;
        },

        getAllTasks: async(parent, args, context, info) => {

                const tasks = await todoModel.find()

            return tasks;
        
        }
    },

    Mutation: {
        async createTask (_, {taskInput: {task_title, status, description}}) {
            const created_task = await todoModel.create({task_title, status, description});

            return {
                id: created_task.id,
                ...created_task._doc
            }
        },
        
       async updateTask (_, {id, editeTaskInput: {task_title, status, description}}) {
            const updated_task = (await todoModel.updateOne({_id: id}, {task_title, status, description})).modifiedCount;

            return updated_task
        },

        async deleteTask (_, {id}) {
            const deleted_task = (await todoModel.deleteOne({_id: id})).deletedCount;

            return deleted_task;
        },

        async registerUser(_, {userInput: {username, password, confirm_password, email}}) {

            if (!username || !password || !confirm_password || !email) {
                console.log(username);
                return new ApolloError('All field must be field', 417);
            }
            
            else {
                if (!validator.isEmail(email)) {
                    return new ApolloError('Invalid email address supplied', 417);
                }
                else {
                    if (!validator.isStrongPassword(password || !validator.isStrongPassword(confirm_password))) {
                        return new ApolloError('Password not strong enough');
                    }
                    else {
                        if (password !== confirm_password) {
                            return new ApolloError('Password mismatch', 417);
                        }

                        let user = await User.findOne({$or: [{email, username}]});


                        if (user) {
                            return new ApolloError('Email already taken');
                        }

                        const salt = await genSalt(10);
                        const hashed_password = await encrypter(password, salt);
                        const hashed_confirm_password = await encrypter(confirm_password, salt);


                        user = await User.create({username, password: hashed_password, confirm_password: hashed_confirm_password, email});

                        return {
                            id: user.id,
                            ...user._doc
                        }
                    }
                }
            }
        },

        async loginUser(_, {loginInput: {email, password}}) {

            if (!email || !password) {
                return new ApolloError('All fields must be filled', 417);
            };

            if (!validator.isEmail(email)) {
                return new ApolloError('Invalid email address supplied', 417);
            }

            let user = await User.findOne({email});

            if (!user) {
                return new ApolloError('User not registered, please signup');
            }

            const match = await compare(password, user.password);

            if (!match) {
                return new ApolloError('Incorrect login crednetials', 404);
            }

            const token  = tokenIssuer(user.id, user.username, user.email);

            if (!token) {
                return new ApolloError('Error generating token', 417);
            }

            return {
                id: user._id,
                ...user._doc,
                token
            }
        }
        
    }
}


export default resolvers;
