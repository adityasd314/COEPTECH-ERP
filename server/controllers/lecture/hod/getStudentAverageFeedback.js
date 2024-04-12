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
  timetable
} = require('../../../db/schema');

const getStudentAverageFeedback = async (req, res) => {
    try {
      const { professorsId } = req.body;
        if (!professorsId) {
            return res.status(400).json({ message: "Please provide all the required fields", dataFormat: { professorsId: "string" } });
        }
        const feedbackData = await db.select().from(feedback).where(eq(feedback.professorId, professorsId));
        let totalFeedback = 0;
        let totalStudents = 0;
        const feedbackObjectDataRating = {
            "content clarity": 0,
            "engagement": 0,
            "delivery": 0,
            "relevance": 0,
            "materials": 0,
            "feedback and support": 0,
            "overall satisfaction": 0
        }
        feedbackData.forEach((feedback) => {
            const {feedbackText} =  feedback;
            const feedbackObject = JSON.parse(feedbackText);

            feedbackObjectDataRating["content clarity"] += parseInt(feedbackObject["content clarity"][0]["Was the content of the lecture presented clearly and effectively?"]);
            feedbackObjectDataRating["engagement"] += parseInt(feedbackObject["engagement"][0]["Did the lecturer keep you engaged throughout the session?"]);
            feedbackObjectDataRating["delivery"] += parseInt(feedbackObject["delivery"][0]["Did the lecturer deliver the lecture in a well-structured and organized manner?"]);
            feedbackObjectDataRating["relevance"] += parseInt(feedbackObject["relevance"][0]["Did the lecture cover relevant topics that align with the course syllabus?"]);
            feedbackObjectDataRating["materials"] += parseInt(feedbackObject["materials"][0]["Were the lecture materials (e.g., slides, handouts) helpful in understanding the content?"]);
            feedbackObjectDataRating["feedback and support"] += parseInt(feedbackObject["feedback and support"][0]["Was the lecturer approachable for questions and clarifications?"]);
            feedbackObjectDataRating["overall satisfaction"] += parseInt(feedbackObject["overall satisfaction"][0]["Overall, how satisfied are you with the lecture experience?"]);

            totalFeedback += feedback.rating;

            totalStudents++;
        });
        feedbackObjectDataRating["content clarity"] = feedbackObjectDataRating["content clarity"] / totalStudents;
        feedbackObjectDataRating["engagement"] = feedbackObjectDataRating["engagement"] / totalStudents;
        feedbackObjectDataRating["delivery"] = feedbackObjectDataRating["delivery"] / totalStudents;
        feedbackObjectDataRating["relevance"] = feedbackObjectDataRating["relevance"] / totalStudents;
        feedbackObjectDataRating["materials"] = feedbackObjectDataRating["materials"] / totalStudents;
        feedbackObjectDataRating["feedback and support"] = feedbackObjectDataRating["feedback and support"] / totalStudents;
        feedbackObjectDataRating["overall satisfaction"] = feedbackObjectDataRating["overall satisfaction"] / totalStudents;

        const averageFeedback = totalFeedback / totalStudents;
        res.status(200).json({ message: "Average feedback fetched", data: { averageFeedback, feedbackObjectDataRating } });
      
      
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
module.exports = {
    getStudentAverageFeedback
}