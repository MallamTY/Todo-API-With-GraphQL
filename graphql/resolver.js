import todoModel from "../model/todo.js";


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

        getAllTasks: async () => {
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
        }
    }
}


export default resolvers;
