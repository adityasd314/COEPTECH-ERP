const Rule = require("../../model/RuleSchema");
const User = require("../../model/UserSchema");

exports.addRules = async (req, res) => {
  try {
    const { rules, id, password } = req.body;
    console.log("Received rules:", rules, id, password);

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

    if (!rules || !Array.isArray(rules)) {
      return res.status(400).json({ error: 'Invalid input. Expecting an array of rules.' });
    }

    const savedRules = [];

    for (const ruleData of rules) {
      try {
        const { title, content } = ruleData;

        const rule = {
          title,
          content,
        };

        const savedRule = await Rule.create(rule);
        savedRules.push(savedRule);

        console.log("Rule created:", savedRule);
      } catch (error) {
        console.error('Error adding rule:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }

    res.status(201).json({ savedRules });
  } catch (error) {
    console.error('Unexpected error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
