const { updateLectureState } = require('./teacher/updateLectureState');
const { updatePracticalState } = require('./teacher/updatePracticalState');
const { updateTutorialState } = require('./teacher/updateTutorialState');
const { getProfessorIdByUserId } = require('./teacher/getProfessorIdByUserId');
const {
  getScheduleForProfessor,
} = require('./teacher/getScheduleForProfessor');
const { updateState } = require('./teacher/updateState');
module.exports = {
  updateState,
  updateLectureState,
  updateTutorialState,
  updatePracticalState,
  getProfessorIdByUserId,
  getScheduleForProfessor,
};
