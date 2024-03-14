const Rule = require("../../model/RuleSchema");
const User = require("../../model/UserSchema");

exports.editRules = async (req, res) => {
  try {
    const { editedRules, id, password } = req.body;
    console.log("Received edited rules:", editedRules);

    const admin = await User.findOne({ _id: id });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (admin.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized Access: You are not an admin" });
    }

    if (admin.password !== password) {
      return res.status(401).json({ error: "Unauthorized Access: Incorrect password" });
    }

    if (!editedRules || !Array.isArray(editedRules)) {
      return res.status(400).json({ error: 'Invalid input. Expecting an array of edited rules.' });
    }

    const updatedRules = [];

    for (const editedRule of editedRules) {
      try {
        const { _id, title, content } = editedRule;

        const updatedRule = await Rule.findByIdAndUpdate(_id, { title, content }, { new: true });

        if (!updatedRule) {
          console.error('Rule not found for editing:', _id);
          return res.status(404).json({ error: 'Rule not found for editing' });
        }

        updatedRules.push(updatedRule);
        console.log("Rule edited:", updatedRule);
      } catch (error) {
        console.error('Error editing rule:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }

    res.status(200).json({ updatedRules });
  } catch (error) {
    console.error('Unexpected error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
