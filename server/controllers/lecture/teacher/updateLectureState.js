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

const updateLectureState = async (lectureId, state) => {
  try {
    if (!lectureId || !state) {
      res.status(400).json({
        message: 'Invalid data',
        dataFormat: { lectureId: 'string', state: 'string' },
      });
      return;
    }
    await db
      .update(lectures)
      .set({ state })
      .where(eq(lectures.lectureId, lectureId));
    return { message: 'Lecture state updated' };
  } catch (err) {
    console.log(err);
    return { message: 'Internal Server Error' };
  }
};

module.exports = {
  updateLectureState,
};
