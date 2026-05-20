/* eslint-disable no-undef */
/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(
    'Background Notification Full:',
    JSON.stringify(remoteMessage, null, 2),
  );
  await notifee.displayNotification({
    title: remoteMessage?.data?.title || 'New Message',
    body: remoteMessage?.data?.body || 'You have a message',
    data: {
      screen: remoteMessage?.data?.screen || '',
      senderId: remoteMessage?.data?.senderId || '',
      receiverId: remoteMessage?.data?.receiverId || '',
      type: remoteMessage?.data?.type || '',
      _id: remoteMessage?.data?._id || '',
      name: remoteMessage?.data?.name || '',
    },

    android: {
      channelId: 'default',
      pressAction: {
        id: 'default',
      },
    },
  });
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    console.log('Background Click:', detail.notification?.data);
  }
});
AppRegistry.registerComponent(appName, () => App);
