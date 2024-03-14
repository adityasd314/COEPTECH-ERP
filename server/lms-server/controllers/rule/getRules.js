const Rule = require("../../model/RuleSchema");

exports.getRules = async (req, res) => {
    try {
      const allRules = await Rule.find();
      res.status(200).json(allRules);
    } catch (error) {
      console.error('Error retrieving rules:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  