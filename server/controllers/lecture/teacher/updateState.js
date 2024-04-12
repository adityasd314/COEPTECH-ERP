const { eq } = require('drizzle-orm');
const db = require('../../../lib/drizzle-client');
const {
  users,
  feedback,
  students,
  courses,
  lectures,
  practicals,
  tutorials,
  professors,
} = require('../../../db/schema');
const { updateLectureState } = require('./updateLectureState');
const { updateTutorialState } = require('./updateTutorialState');
const { updatePracticalState } = require('./updatePracticalState');
// lets do proper error handling
const updateState = async (req, res) => {
  try {
    const { type, id, state } = req.body;

    console.log(type, id, state);
    if (!id || !state || !type) {
      res.status(400).json({
        message: 'Invalid data',
        dataFormat: { id: 'string', state: 'string', type: 'string' },
      });
      return;
    }

    if (type === 'LECTURE') {
      const result = await updateLectureState(id, state);
      return res.status(200).json(result);
    }
    if (type === 'TUTORIAL') {
      const result = await updateTutorialState(id, state);
      return res.status(200).json(result);
    }
    if (type === 'LAB') {
      const result = await updatePracticalState(id, state);
      return res.status(200).json(result);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  updateState,
};
