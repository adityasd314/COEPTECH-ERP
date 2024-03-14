const User = require("../../model/UserSchema");
const ObjectId = require('mongodb').ObjectId;

exports.updateEmployee = async (req, res) => {
    try {
      const { _id, name, age, email, position, phone_number, manager, role } = req.body;
  
      if (!ObjectId.isValid(_id)) {
        return res.status(400).json({ error: "Invalid employee ID" });
      }
  
      const employee = await User.findByIdAndUpdate(
        { _id: new ObjectId(_id) },
        {
          $set: {
            'info.name': name,
            'info.age': age,
            'email': email,
            'info.position': position,
            'info.phone_number': phone_number,
            'info.manager': manager,
            'role': role
          }
        },
        { new: true }
      );
  
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
  
      console.log("updated employee:", employee);
      res.status(200).json(employee);
  
    } catch (error) {
      console.error('Error updating user:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };