import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackProps } from 'src/@types';
import { Dashboard, Notification, Taskdetails, Tasklist, Taskstatus, Userchat } from '@screens/index';
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
          headerTitleStyle:{
            color:Colors.SECONDARY[200],
            ...Typography.BodyRegular13
          },
        }}
      />
      <HomeStack.Screen
        name="Taskstatus"
        component={Taskstatus}
        options={{
          headerShown: true,
          headerTitle:'Mark Task Status',
          headerTitleStyle:{
            color:Colors.SECONDARY[200],
            ...Typography.BodyRegular13
          },
        }}
      />

        <HomeStack.Screen
        name="Userchat"
        component={Userchat}
        options={{
          headerShown:false,
          headerTitle:'Chats',
          headerTitleStyle:{
            color:Colors.SECONDARY[200],
            ...Typography.BodyRegular13
          },
        }}
      />
    </HomeStack.Navigator>
  );
};

export default Homestacknavigator;
