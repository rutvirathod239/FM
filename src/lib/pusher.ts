// lib/pusher.js
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || '', // Set this in your .env.local
  key: process.env.PUSHER_APP_KEY || '',  // Set this in your .env.local
  secret: process.env.PUSHER_APP_SECRET || '',  // Set this in your .env.local
  cluster: process.env.PUSHER_APP_CLUSTER || '',  // Set this in your .env.local
  useTLS: true,
});

export default pusher;
