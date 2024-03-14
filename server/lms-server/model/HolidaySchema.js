const { model, Schema } = require("mongoose");

const holidaySchema = new Schema({
    date:{
        type: Date,
        required: true,
    },
    type:{
        type:String,
        require:true
    },
    note: {
      type: String,
    }
})


const Holiday = model('Holiday', holidaySchema);

module.exports = Holiday;