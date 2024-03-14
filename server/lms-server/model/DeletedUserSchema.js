const { model, Schema } = require("mongoose");

const deletedUserSchema = new Schema({
    role: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    info: {
      name: {
        type: String,
        required: true,
      },
      age: {
        type: Number,
        required: true,
      },
      phone_number: {
        type: String,
        required: true,
      },
      position: {
        type: String,
        required: true,
      },
      manager: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    },
    attendance: [{
      date: {
        type: Date,
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
      paid: {
        type: Number,
        required: true,
      },
    }],
    accumulatedLeaves: {
      type: Number,
      required: true,
    },
    leaves: [{
      type: Schema.Types.ObjectId,
      ref: 'Leave', 
    }],
    dateOfDeletion:{
        type: Date,
        required: true,
      },
  })
  

const DeletedUser = model('DeletedUser', deletedUserSchema);

module.exports = DeletedUser;