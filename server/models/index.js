const sql = require('mssql')
module.exports.connect = async (uri) => {
  try {
    const pool = await sql.connect(uri)
    return pool;
  } catch (err) {
    throw err;
  }
};
