const db = require('./db');

async function sendBirthdayMessage(sock, contact, message) {
  try {
    await sock.sendMessage(contact + '@s.whatsapp.net', { text: message });
    console.log(`🎉 Sent birthday message to ${contact}`);
  } catch (err) {
    console.error('❌ Failed to send message:', err);
  }
}

async function checkAndSendBirthdays(sock) {
  const today = new Date().toISOString().slice(5, 10); // MM-DD

  try {
    const [rows] = await db.query(
      'SELECT name, phone, message FROM birthdays WHERE DATE_FORMAT(birthday, "%m-%d") = ?',
      [today]
    );

    for (const row of rows) {
        const message = row.message || `Happy Birthday ${row.name}! 🎉🎂

Wishing you a day filled with love, laughter, and all the things that make you smile. May this year bring you success, good health, and endless happiness.
        
Regards,  
BGI`;
        
      await sendBirthdayMessage(sock, row.phone, message);
    }

    

    if (!rows.length) console.log('📭 No birthdays today.');
  } catch (err) {
    console.error('❌ Error checking birthdays:', err);
  }
}

module.exports = { checkAndSendBirthdays };
