const { model, Schema } = require("mongoose");

const attendanceSchema = new Schema({
    employeeID: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
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
        markerName:{
            type:String,
            required:true
        }
      }],
})


const Attendance = model('attendance', attendanceSchema);

module.exports = Attendance;