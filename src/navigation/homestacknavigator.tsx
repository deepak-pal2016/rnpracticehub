import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackProps } from 'src/@types';
import {
  Audiocall,
  Dashboard,
  IncomingCallScreen,
  Notification,
  Pdfviewer,
  Taskdetails,
  Tasklist,
  Taskstatus,
  Userchat,
  VideoCallScreen,
} from '@screens/index';
import BottomTabNavigator from '../navigation/bottomtabnavigator';
import Colors from '@constant/colors';
import Typography from '@constant/fontSize';

const Homestacknavigator: FC = () => {
  const HomeStack = createNativeStackNavigator<HomeStackProps>();
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
      />
      <HomeStack.Screen name="Dashboard" component={Dashboard} />
      <HomeStack.Screen name="Tasklist" component={Tasklist} />
      <HomeStack.Screen name="Notification" component={Notification} />
      <HomeStack.Screen
        name="Taskdetails"
        component={Taskdetails}
        options={{
          headerShown: true,
          headerTitle: 'Task Details',
          headerTitleStyle: {
            color: Colors.SECONDARY[200],
            ...Typography.BodyRegular13,
          },
        }}
      />
      <HomeStack.Screen
        name="Taskstatus"
        component={Taskstatus}
        options={{
          headerShown: true,
          headerTitle: 'Mark Task Status',
          headerTitleStyle: {
            color: Colors.SECONDARY[200],
            ...Typography.BodyRegular13,
          },
        }}
      />

      <HomeStack.Screen
        name="Userchat"
        component={Userchat}
        options={{
          headerShown: false,
          headerTitle: 'Chats',
          headerTitleStyle: {
            color: Colors.SECONDARY[200],
            ...Typography.BodyRegular13,
          },
        }}
      />

      <HomeStack.Screen
        name="VideoCallScreen"
        component={VideoCallScreen}
        options={{
          headerShown: false,
          headerTitle: 'Video Call',
          headerTitleStyle: {
            color: Colors.SECONDARY[200],
            ...Typography.BodyRegular13,
          },
        }}
      />

      <HomeStack.Screen
        name="IncomingCallScreen"
        component={IncomingCallScreen}
        options={{
          headerShown: false,
          headerTitle: 'Receiving Video call',
          headerTitleStyle: {
            color: Colors.SECONDARY[200],
            ...Typography.BodyRegular13,
          },
        }}
      />

      <HomeStack.Screen
        name="Audiocall"
        component={Audiocall}
        options={{
          headerShown: false,
          headerTitle: 'Receiving Audio call',
          headerTitleStyle: {
            color: Colors.SECONDARY[200],
            ...Typography.BodyRegular13,
          },
        }}
      />

       <HomeStack.Screen
        name="Pdfviewer"
        component={Pdfviewer}
       
      />
    </HomeStack.Navigator>
  );
};

export default Homestacknavigator;
