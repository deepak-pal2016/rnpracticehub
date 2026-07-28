/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '@constant/fonticons';
import Colors from '@constant/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '@constant/dimentions';

import { Dashboard, Addtask, Profile, Users } from '@screens/index';
import { cardShadow, Typography } from '@constant/index';
import { ThemeContext } from '../context/themeContext';
import { DarkTheme, LightTheme, TextView } from '@components/index';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackProps } from 'src/@types';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();
type BottomTabNavigatorscreenNavigationType = NativeStackNavigationProp<
  HomeStackProps,
  'BottomTabNavigator'
>;

const BottomTabNavigator: FC = () => {
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;

  const TabIcon = ({
    focused,
    children,
  }: {
    focused: boolean;
    children: React.ReactNode;
  }) => {
    return (
      <View style={{ alignItems: 'center' }}>
        {focused && (
          <View
            style={{
              position: 'absolute',
              top: hp(-1),
              width: wp(10),
              height: hp(0.3),
              borderRadius: hp(1),
              borderBottomLeftRadius:hp(3),
              borderBottomRightRadius:hp(3),
              backgroundColor: Colors.PRIMARY[100],
            }}
          />
        )}
        {children}
      </View>
    );
  };
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.PRIMARY[100],
        tabBarInactiveTintColor: Colors.FLOATINGINPUT[100],
        tabBarStyle: {
          height: hp(7.5),
          paddingBottom: hp(2),
          borderTopEndRadius: hp(0),
          borderTopStartRadius: hp(0),
          borderColor:
            theme === 'dark' ? currentTheme?.background : Colors.PRIMARY[800],
          backgroundColor:
            theme === 'dark' ? currentTheme?.background : Colors.PRIMARY[800],
          ...cardShadow,
        },
      }}
    >
      <Tab.Screen
        name="Task"
        component={Dashboard}
        options={{
          tabBarLabel: ({ focused }) => {
            return (
              <TextView
                style={{
                  color: focused
                    ? currentTheme?.text
                    : Colors.FLOATINGINPUT[100],
                  ...Typography.BodyRegular12,
                }}
              >
                Task
              </TextView>
            );
          },

          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon focused={focused}>
              <Icon
                family="Ionicons"
                name="time-outline"
                size={24}
                color={focused ? currentTheme?.text : Colors.FLOATINGINPUT[100]}
              />
            </TabIcon>
          ),
        }}
      />

      <Tab.Screen
        name="Chat"
        component={Users}
        options={{
          tabBarLabel: ({ focused }) => {
            return (
              <TextView
                style={{
                  color: focused
                    ? currentTheme?.text
                    : Colors.FLOATINGINPUT[100],
                  ...Typography.BodyRegular12,
                }}
              >
                Chat
              </TextView>
            );
          },

          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon focused={focused}>
              <Icon
                family="Ionicons"
                name="chatbubble-outline"
                size={24}
                color={focused ? currentTheme?.text : Colors.FLOATINGINPUT[100]}
              />
            </TabIcon>
          ),
        }}
      />

      <Tab.Screen
        name="Add Task"
        component={Addtask}
        options={{
          tabBarLabel: ({ focused }) => {
            return (
              <TextView
                style={{
                  color: focused
                    ? currentTheme?.text
                    : Colors.FLOATINGINPUT[100],
                  ...Typography.BodyRegular12,
                }}
              >
                Add Task
              </TextView>
            );
          },

          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon focused={focused}>
              <Icon
                family="FontAwesome"
                name="tasks"
                size={24}
                color={focused ? currentTheme?.text : Colors.FLOATINGINPUT[100]}
              />
            </TabIcon>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: ({ focused }) => {
            return (
              <TextView
                style={{
                  color: focused
                    ? currentTheme?.text
                    : Colors.FLOATINGINPUT[100],
                  ...Typography.BodyRegular12,
                }}
              >
                Profile
              </TextView>
            );
          },

          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon focused={focused}>
              <Icon
                family="Ionicons"
                name="person-outline"
                size={24}
                color={focused ? currentTheme?.text : Colors.FLOATINGINPUT[100]}
              />
            </TabIcon>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
