import admin from './firebaseadmin.mjs';

const sendNotification = async (token, payload) => {
  try {
    await admin.messaging().sendToDevice(
        token, payload
        );
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Example usage
const token = 'dcMTh585RMm0e4QIL2cNfk:APA91bGmH7rs_Vk9lr1jkvO2-hHSmJew-VAv0QsoXJ31-pFJM-WSyYvLrPlGUanhReoaYJiAv0GthRJXZuBwtdFfGV7mYpYWNV5BqDNtPKuBhCc4_v3n_6Gouk4N25NKCTehrcW-6VJ-';

const payload = {
  notification: {
    title: 'Hello',
    body: 'This is a test notification',
  },
  data: {
    screen_id: '42',
    screen: '/aptilr',
    anotherKey: 'anotherValue'
  },
};

// sendNotification(token,payload)

export default sendNotification




