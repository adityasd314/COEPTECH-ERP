const { eq, lt, gte, ne, sql } = require('drizzle-orm');
const DrizzleClient = require('../lib/drizzle-client');

const { roles, users } = require('../db/schema');


const getTableData = async (req, res) => {
  const {name} = req.body;
  const tableData =  (await DrizzleClient.execute("SELECT * FROM users"));
  res.status(200).json({ tableData });
  
};

module.exports = { getTableData };
