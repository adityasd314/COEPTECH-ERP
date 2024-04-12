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
// lets do proper error handling
const updateTutorialState = async (tutorialId, state) => {
  try {
    if (!tutorialId || !state) {
      res.status(400).json({
        message: 'Invalid data',
        dataFormat: { tutorialId: 'string', state: 'string' },
      });
      return;
    }
    await db
      .update(tutorials)
      .set({ state })
      .where(eq(tutorials.tutorialId, tutorialId));
    return { message: 'Tutorial state updated' };
  } catch (err) {
    console.log(err);
    return { message: 'Internal Server Error' };
  }
};

module.exports = {
  updateTutorialState,
};
