import { model, Schema } from "mongoose";


const todoSchema  = new Schema({
    task_title: {
        type: String,
        trim: true,
        required: [true, `Task title can't be empty !!!!!!!`],
        maxlegth: [50, `Tast tittle can't be more than 50 characters !!!!!!!`]
    },
    status: {
        type: String,
        default: 'Uncompleted',
        trim:true,
        required: [true, `The status field can't be empty`]
    },

    description: {
        type: String,
        trim:true,
        required: [true, `The description field can't be empty`]
    },

    user_id: {
        type: String
    }
}, {timestamps: true}

);

const todoModel = model('todo', todoSchema);
export default todoModel;
