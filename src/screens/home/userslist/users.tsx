/* eslint-disable @typescript-eslint/no-unused-vars */
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC, useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { HomeStackProps } from 'src/@types';
import { ThemeContext } from '../../../context/themeContext';
import { DarkTheme, Header, LightTheme, TextView } from '@components/index';
import usersStyles from '@styles/usersStyles';
import { useDispatch, useSelector } from 'react-redux';
import { UserData, UserDataContext } from '../../../context/userDataContext';
import Colors from '@constant/colors';
import Typography from '@constant/fontSize';
import { useNavigation } from '@react-navigation/native';
import Socket from '@services/socket/socket';
import { setOnlineUsers } from '@redux/slices/userSlice';
//@ts-ignore
import type { AppDispatch } from '@redux/store';

type UsersscreenNavigationType = NativeStackNavigationProp<
  HomeStackProps,
  'Users'
>;

const Users: FC = () => {
    const dispatch = useDispatch<AppDispatch>();
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation<UsersscreenNavigationType>()
  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;
  const styles = usersStyles(currentTheme);
  const { userData, setIsLoggedIn } = useContext<UserData>(UserDataContext);
  const onlineusers = useSelector(
  (state: any) => state?.onlineuser?.users
);
  
  const userState = useSelector(
    (state: any) => state?.userlist?.userlist?.data,
  );

  const userlistArr = userState?.filter(
    (item: any) => item?._id !== userData?._id,
  );

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    const first = parts[0]?.charAt(0) || '';
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (first + last).toUpperCase();
  };

  const colors = [
  '#FF5733',
  '#33B5FF',
  '#9C27B0',
  '#4CAF50',
  '#FF9800',
  '#E91E63',
];

const getColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const avatarBaseStyle = {
  width: 50,
  height: 50,
  borderRadius: 25,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};




  const renderItem = ({ item }: any) => {
    const isOnline = onlineusers.includes(String(item._id)); // ✅
    return (
      <TouchableOpacity onPress={()=> navigation.navigate('Userchat', {'reciever':item})} style={styles.card}>
        <View
          style={[
            avatarBaseStyle,
            { backgroundColor: getColor(item.name) },
          ]}
        >
          <TextView style={{color:Colors.SECONDARY[100],...Typography.BodyRegular13}}>
            {getInitials(item.name)}
          </TextView>
        </View>
        <View style={styles.textContainer}>
          <TextView style={styles.name}>{item.name}</TextView>
          {/* <TextView style={styles.message}>{item.message}</TextView> */}
        </View>
        <View style={styles.rightSection}>
          <TextView style={styles.time}>{item.time}</TextView>
          <Icon name="chatbubble-ellipses-outline" size={20} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header showicons={true} screenname="Chat List" showheader={false} />
      <FlatList
        data={userlistArr}
        keyExtractor={item => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Users;
