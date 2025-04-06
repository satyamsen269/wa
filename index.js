const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const { checkAndSendBirthdays } = require('./scheduler');

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth'); // multi-file auth

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('Scan QR Code:');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'open') {
      console.log('✅ Connected to WhatsApp.');
      await checkAndSendBirthdays(sock);
      process.exit(0); // Exit after sending messages
    }

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);
      console.log('❌ Disconnected.', shouldReconnect ? 'Trying again...' : 'Not reconnecting.');
      process.exit(1);
    }
  });
}

start();
