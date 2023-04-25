import { ApolloError } from "apollo-server";
import validator from "validator";
import todoModel from "../model/todo.js";
import User from "../model/user.js";
import { encrypter } from "../assessories/encrypter.js";
import { compare, genSalt } from "bcrypt";
import { tokenIssuer } from "../assessories/token.issuer.js";


const resolvers = {
    Query: {
        async getSingleTask (_, {id}, {current_user}, info) {
            
            const task = await todoModel.findOne({$and: [{_id: id}, {user_id: current_user.id}]});
            
            if (task) {
                return {
                    id: task.id,
                    ...task._doc
                }
            }

            return new ApolloError('Error getting task', 417);
           
            
        },

        async getTaskByAmount (_, {amount}, {current_user}, info) {
        
            const tasks = await todoModel.find({user_id: current_user.id}).sort({createdAt: 1}).limit(amount);

            if (tasks) {
                return tasks;
            }

            return new ApolloError('Error getting tasks', 417);
        },

        getAllTasks: async(parent, args, {current_user}, info) => {
            
            const tasks = await todoModel.find({user_id: current_user.id});

            if (tasks) {
                return tasks;
            }

            return new ApolloError('Error getting tasks', 417);
        
        }
    },

    Mutation: {
        async createTask (_, {taskInput: {task_title, status, description}}, {current_user}, info) {

            const created_task = await todoModel.create({task_title, user_id: current_user.id, status, description});

            return {
                id: created_task.id,
                ...created_task._doc
            }
        },
        
       async updateTask (_, {id, editeTaskInput: {task_title, status, description}}, {current_user}) {


            const updated_task = (await todoModel.updateOne({$and: [{_id: id}, {user_id: current_user.id}]}, {task_title, status, description})).modifiedCount;

            if (updated_task) {
                return `Task updated successfully`
            }

            return new ApolloError('Error updating this task')
        },

        async deleteTask (_, {id}, {current_user}) {
            const deleted_task = (await todoModel.deleteOne({$and: [{_id: id}, {user_id: current_user.id}]})).deletedCount;

            if (deleted_task) {
                return `Task successfully deleted`
            }
            return new ApolloError('Error deleting task this time', 417);
        },

        async registerUser(_, {userInput: {username, password, confirm_password, email}}) {

            if (!username || !password || !confirm_password || !email) {
                
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
