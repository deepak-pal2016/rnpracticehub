/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@redux/store/store';
import Route from './src/routes/index';
import { CommonAlertProvider } from '@components/CommonAlertModal/commonAlertModal';
import { CommonLoaderProvider } from '@components/CommonLoader/commonLoader';
import { ThemeProvider } from './src/context/index';
import FlashMessage from 'react-native-flash-message';
import { UserDataContextProvider } from './src/context/index';
import { LogBox, PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Appwrapwer from './src/context/appwrapper';
import notifee, { EventType } from '@notifee/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { navigationRef } from './src/utils/NavigationService';
import { MenuProvider } from 'react-native-popup-menu';

LogBox.ignoreLogs(['InteractionManager has been deprecated']);

const App = () => {
  useEffect(() => {
    requestpermission();
  }, []);

  useEffect(() => {
    async function createChannel() {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
    }
    createChannel();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      const data = remoteMessage?.data;

      if (data?.screen === 'Userchat') {
        //@ts-ignore
        navigationRef.navigate('Userchat', {
          reciever: {
            _id: data?._id,
            name: data?.name,
          },
        });
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        const data = detail.notification?.data;
        if (data?.screen === 'Userchat') {
          //@ts-ignore
          navigationRef.navigate('Userchat', {
            reciever: {
              _id: data?._id,
              name: data?.name,
            },
          });
        }
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    async function checkInitialNotification() {
      const initialNotification:any = await notifee.getInitialNotification();
      const data = initialNotification?.notification?.data;
      if (data?.screen === "Userchat") {
        const interval = setInterval(() => {
          if (navigationRef.isReady()) {
            clearInterval(interval);
            //@ts-ignore
            navigationRef.navigate('Userchat', {
              reciever: {
                _id: data?._id,
                name: data?.name,
              },
            });
          }
        }, 500);
      }
    }

    checkInitialNotification();
  }, []);

  const requestpermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      // console.log('granted', granted);
    }
  };

  return (
    <Provider store={store}>
      <PaperProvider>
        <ThemeProvider>
          <MenuProvider>
            <UserDataContextProvider>
              <CommonLoaderProvider>
                <CommonAlertProvider>
                  <Appwrapwer />
                  <Route />
                  <FlashMessage position="bottom" />
                </CommonAlertProvider>
              </CommonLoaderProvider>
            </UserDataContextProvider>
          </MenuProvider>
        </ThemeProvider>
      </PaperProvider>
    </Provider>
  );
};

export default App;
