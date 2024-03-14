const Employee = require("../../model/UserSchema");

exports.getManagers = async (req, res) => {
  try {
    const managers = await Employee.find({ role: 'hod' });

    if (!managers || managers.length === 0) {
      return res.status(404).json({ error: "No Managers found" });
    }

    res.status(200).json(managers);
  } catch (error) {
    console.error("Error fetching Managers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
