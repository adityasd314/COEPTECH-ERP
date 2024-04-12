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

const updatePracticalState = async (practicalId, state) => {
  try {
    if (!practicalId || !state) {
      res.status(400).json({
        message: 'Invalid data',
        dataFormat: { practicalId: 'string', state: 'string' },
      });
      return;
    }
    await db
      .update(practicals)
      .set({ state })
      .where(eq(practicals.practicalId, practicalId));
    return { message: 'Practical state updated' };
  } catch (err) {
    console.log(err);
    return { message: 'Internal Server Error' };
  }
};
module.exports = {
  updatePracticalState,
};
