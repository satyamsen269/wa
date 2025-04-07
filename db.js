const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'sql111.infinityfree.com',
  user: 'if0_36942383',
  password: 'hMs26FhQx5n',
  database: 'if0_36942383_wa',
});

module.exports = pool;
