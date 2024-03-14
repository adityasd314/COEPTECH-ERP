const { model, Schema } = require("mongoose");

const leavesSchema = new Schema({
    employeeID: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
    },
    reason:{
        type:String,
        require:true
    },
    duration: [{
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
        }
      }],
    status:{
        type:String,
        require:true
    },
    note: {
      type: String,
    }
})


const Leave = model('Leave', leavesSchema);

module.exports = Leave;