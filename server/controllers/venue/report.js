const { eq } = require('drizzle-orm');
const DrizzleClient = require("../../lib/drizzle-client");
const { reports } = require("../../db/schema");

const storeReport = async(req, res) => {
    try{
        const {url, id} = req.body;
        if(!url){
            res.status(400).json({ error: 'All fields must be filled' });
        }
        const currentDate = new Date();
        data = {
            reportName: 'Permission Letter',
            reportDate: currentDate,
            reportType: 'letter',
            generatedBy: id,
            cloudinaryLink: url,
        }
        const report = await DrizzleClient.insert(reports).values(data).returning({
            reportUrl : reports.cloudinaryLink
        })
        res.status(200).json({report})
    }catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { storeReport };