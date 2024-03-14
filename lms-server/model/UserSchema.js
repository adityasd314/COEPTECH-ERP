const { model, Schema } = require("mongoose");

const userSchema = new Schema({
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
      joiningdate:{
        type:Date,
        required:true
      },
      department: {
        type: String,
        required: true,
      },
      manager: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    },
    accumulatedLeaves: {
      type: Number,
      required: true,
    },
    assignedAccumulatedLeaves: [{
      date: {
        type: Date,
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
    }],
    leaves: [{
      type: Schema.Types.ObjectId,
      ref: 'Leave', 
    }],
  })


  userSchema.statics.login = async function (email, password) {

    if (!email || !password) {
      throw Error("All fields must be filled");
    }
  
    const user = await this.findOne({ email });
    if (!user) {
      throw Error("Incorrect email");
    }
  
    if (password !== user.password) {
      throw Error("Incorrect password");
    }

  
    return user;
  };
  

const User = model('User', userSchema);

module.exports = User;