/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  TouchableWithoutFeedback,
  Switch,
  TouchableOpacity,
} from 'react-native';
import React, { FC, useContext, useEffect, useState } from 'react';
import {
  Button,
  FloatingTextInput,
  TextView,
  DividerWithText,
  LightTheme,
  DarkTheme,
  Header,
  Dropdownmultiselect,
  CustomDropdown,
} from '@components/index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '@constant/dimentions';
import { useFormik } from 'formik';
import { ThemeContext } from '../../../context/themeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import addtaskStyles from '@styles/addtaskStyles';
import { cardShadow, Colors, Icon, Images, Typography } from '@constant/index';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import createstyles from '@styles/profileStyles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackProps } from 'src/@types';
import { useDispatch, useSelector } from 'react-redux';
import { Loginuser, Logout, Logoutuser } from '@redux/slices/authSlice';
import { UserData, UserDataContext } from '../../../context/userDataContext';
import { LocalStorage } from '@helpers/localstorage';
import { logout } from '@services/rtkquery/fetures/auth/authslice';
import { showError, showSuccess } from '@components/Flashmessge';
import { Socket } from 'socket.io-client';
type ProfilescreenNavigationType = NativeStackNavigationProp<
  HomeStackProps,
  'Profile'
>;

const Profile: FC = () => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [darkmode, setDarkmode] = useState(false);
  const { theme, themetoggle } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;
  const styles = createstyles(currentTheme);
  const { userData, setIsLoggedIn } = useContext<UserData>(UserDataContext);

  // useEffect(() => {
  //  getvalue()
  // }, []);

  // const getvalue = async () => {
  //   let val = await LocalStorage.read('@login');
  //   let user = await LocalStorage.read('@user');
  //   console.log(val, user,'user===');
  // }

  const changecolor = () => {
    if (darkmode === true) {
      setDarkmode(false);
      themetoggle();
    } else {
      setDarkmode(true);
      themetoggle();
    }
  };

  // rtk query logout
  //   const handleLogout = async () => {
  //   dispatch(logout());
  //   setIsLoggedIn(false);
  //   await LocalStorage.save('@login', false);
  //   await LocalStorage.flushQuestionKeys();
  //   showSuccess('Logout Successfully..');
  // };

  const handlelogout = async () => {
    try {
      // const response: any = dispatch(Logoutuser(userData?._id) as any).unwrap();
      // console.log(response, 'logout response');
      await dispatch(Logout());
      (Socket as any).disconnect?.();
      setIsLoggedIn(false);
    } catch (error: any) {
      console.log(error, 'logout error');
      showError(error?.message || 'Something went wrong');
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor:
            theme === 'dark' ? currentTheme?.background : Colors.PRIMARY[800],
        },
      ]}
    >
      <Header showheader={true} title="Profile" showicons={true} />
      <View style={{ marginTop: hp(0) }}>
        <View style={styles.conentview}>
          <View>
            <Image source={Images?.ic_userimg} style={styles.imgview} />
          </View>
          <View style={{ flexDirection: 'column' }}>
            <TextView style={styles.nametext}>{userData?.name}</TextView>
            <TextView style={styles.emailtext}>{userData?.email}</TextView>
          </View>
        </View>
        <View style={styles.itemview}>
          <TouchableOpacity style={styles.menuitem}>
            <View
              style={{
                alignSelf: 'flex-start',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <Image
                source={Images.ic_edit}
                style={{
                  width: wp(5),
                  height: hp(5),
                  resizeMode: 'contain',
                  tintColor: 'white',
                }}
              />
              <TextView
                style={{
                  color: Colors.SECONDARY[100],
                  ...Typography.BodyRegular13,
                  left: hp(1),
                }}
              >
                Edit Profile
              </TextView>
            </View>
            <Icon
              family="FontAwesome6"
              name="chevron-right"
              color={currentTheme?.text}
              size={20}
            />
          </TouchableOpacity>

          <View style={styles.menuitem}>
            <View
              style={{
                alignSelf: 'flex-start',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <Image
                source={Images.ic_mode}
                style={{
                  width: wp(5),
                  height: hp(5),
                  resizeMode: 'contain',
                  tintColor: 'white',
                }}
              />
              <TextView
                style={{
                  color: Colors.SECONDARY[100],
                  ...Typography.BodyRegular13,
                  left: hp(1),
                }}
              >
                Dark Mode
              </TextView>
            </View>
            <Switch onChange={() => changecolor()} value={darkmode} />
          </View>
        </View>

        <View style={[styles.itemview, { top: hp(2) }]}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.logoutview}
            onPress={() => handlelogout()}
          >
            <Image
              source={Images.ic_logout}
              style={{
                width: wp(5),
                height: hp(5),
                resizeMode: 'contain',
                tintColor: 'white',
              }}
            />
            <TextView
              style={{
                color: Colors.SECONDARY[100],
                ...Typography.BodyRegular13,
                alignSelf: 'center',
                left: hp(1),
              }}
            >
              Logout
            </TextView>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Profile;
