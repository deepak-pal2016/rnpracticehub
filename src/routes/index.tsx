/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Homestacknavigator,
  Authstacknavigator,
  BottomTabNavigator,
} from '@navigation/index';
import { StatusBar, BackHandler } from 'react-native';
const Stack = createNativeStackNavigator();
import { LocalStorage } from '@helpers/localstorage';
import { UserData, UserDataContext } from '../context/userDataContext';
import { Colors } from '../constant';
import NetInfo from '@react-native-community/netinfo';
// import SplashScreen from 'react-native-splash-screen';
import { CommonLoader, CommonAlertModal } from '@components/index';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Userauthenticate } from '@redux/slices/authSlice';
import { AppDispatch } from '@redux/store/store';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import Socket from '@services/socket/socket';

const Route: FC = () => {
  const [userLogin, setUserLogin] = useState<any>(undefined);
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn } = useContext<UserData>(UserDataContext);
  const { showAlert, hideAlert } = CommonAlertModal();
  const loginState = useSelector((state: any) => state.auth.data);
  const { userData, setIsLoggedIn } = useContext<UserData>(UserDataContext);

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
    if (userData?._id) {
      Socket.emit('join', userData?._id);
    }
  }, [userData]);

  useEffect(() => {
    getAsync();
  }, [isLoggedIn]);

  const getAsync = async () => {
    try {
      let val = await LocalStorage.read('@login');
      setUserLogin(val);
    } catch (error) {
      console.error('Error fetching user login status:', error);
      setUserLogin('false');
    }
  };

  //For Fetch Internet Connectvity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        showAlert(
          'Internet Issue',
          `No Internet Connection. Make sure that Wi-Fi or mobile data is turned on then`,
          'Try Again',
          () => tryAgainWithInternet(),
          'internet',
        );
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  //For Check Internet Connection And Try Again

  const tryAgainWithInternet = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        hideAlert();
      }
    });
  };

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then((remoteMessage: any) => {
        if (remoteMessage) {
          console.log('App opened from quit:', remoteMessage);

          // 👉 yaha navigation bhi kar sakte ho
          // example:
          // navigation.navigate('Taskdetails', {
          //   id: remoteMessage?.data?.taskId,
          // });
        }
      });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('App opened from background:', remoteMessage);

      // 👉 yaha navigation bhi kar sakte ho
      // example:
      // navigation.navigate('Taskdetails', {
      //   id: remoteMessage?.data?.taskId,
      // });
    });

    return unsubscribe;
  }, []);

  //removed loading authscreen in first instance because of the null(false) for userLogin
  //if (loginState === undefined || loginState === 'null') return <></>;
  if (userLogin === undefined || userLogin === 'null') return <></>;

  //
  return (
    <>
      <NavigationContainer>
        <StatusBar barStyle={'default'} backgroundColor={Colors.PRIMARY[100]} />
        <SafeAreaView style={{ flex: 1 }}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {userLogin ? (
              <>
                <Stack.Screen
                  name="Homestacknavigator"
                  component={Homestacknavigator}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="AuthStackNavigator"
                  component={Authstacknavigator}
                />
              </>
            )}
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </>
  );
};
export default Route;
