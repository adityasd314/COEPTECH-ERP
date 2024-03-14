const Leave = require("../../model/LeaveSchema");

exports.getAllLeaves = async(req, res) => {
    try {

        const allLeaves = await Leave.find();
    
        if (!allLeaves) {
          return res.status(404).json({ error: "No Leaves found" });
        }
    
        res.status(200).json(allLeaves);
      } catch (error) {
        console.error("Error fetching Leaves:", error);
        res.status(500).json({ error: "Internal server error" });
      }
}