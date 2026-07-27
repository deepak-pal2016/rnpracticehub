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
  PermissionsAndroid,
  Platform,
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
  Attachment,
  CommonLoader,
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
import { UseDispatch, useDispatch, useSelector } from 'react-redux';
import { Loginuser, Logout, Logoutuser } from '@redux/slices/authSlice';
import { UserData, UserDataContext } from '../../../context/userDataContext';
import { LocalStorage } from '@helpers/localstorage';
import { logout } from '@services/rtkquery/fetures/auth/authslice';
import { showError, showSuccess } from '@components/Flashmessge';
import { Socket } from 'socket.io-client';
import { Uploaduserimage } from '@redux/slices/userSlice';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import { AppDispatch } from '@redux/store/store';
type ProfilescreenNavigationType = NativeStackNavigationProp<
  HomeStackProps,
  'Profile'
>;

const Profile: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();
  const { showLoader, hideLoader } = CommonLoader();
  const { theme, themetoggle } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;
  const styles = createstyles(currentTheme);
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const { setIsLoggedIn, setUserData, userData } =
    useContext<UserData>(UserDataContext);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  console.log(userData, 'userData=2=2');

  // useEffect(() => {
  //  getvalue()
  // }, []);

  // const getvalue = async () => {
  //   let val = await LocalStorage.read('@login');
  //   let user = await LocalStorage.read('@user');
  //   console.log(val, user,'user===');
  // }

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
      await dispatch(Logout());
      (Socket as any).disconnect?.();
      setIsLoggedIn(false);
    } catch (error: any) {
      console.log(error, 'logout error');
      showError(error?.message || 'Something went wrong');
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const pickGallery = async () => {
    try {
      const response = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      if (response.didCancel || !response.assets?.length) return;
      setSelectedFile(response.assets[0]);
      setShowAttachmentModal(false);
    } catch (e) {
      setShowAttachmentModal(false);
      console.log(e);
    }
  };

  const openCamera = async () => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        console.log('Camera permission denied');
        return;
      }

      const response = await launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
        saveToPhotos: false,
        quality: 0.8,
      });

      if (response.didCancel || !response.assets?.length) {
        return;
      }
      setShowAttachmentModal(false);
      setSelectedFile(response.assets[0]);
      if (response) {
        showLoader();
        const formdata = new FormData();
        formdata.append('userId', userData?._id);
        formdata.append('image', {
          uri: response.assets[0].uri,
          type: response.assets[0].type || 'image/jpeg',
          name: response.assets[0].fileName || 'profile-image.jpg',
        } as any);
        const resp: any = await dispatch(Uploaduserimage(formdata)).unwrap();
        console.log(resp?.user, 'drepe====');
        if (resp?.success === true) {
          showSuccess('Profile image Updated successfully..');
          await LocalStorage.save('@user', resp?.user);
          setUserData(resp?.user);
        } else {
          showError('Profile image not updated..');
        }
      } else {
        showError('Please open camera take selfie..');
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while adding the task';
      showError(errorMessage);
    } finally {
      hideLoader();
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
      <Header
        showheader={true}
        title="Profile"
        showicons={false}
        receiverid={undefined}
      />
      <View style={{ marginTop: hp(7) }}>
        <View style={styles.conentview}>
          <View style={{ flexDirection: 'column',  }}>
            <Image
              source={
                userData ? { uri: userData?.profileImage } : Images?.ic_userimg
              }
              style={styles.imgview}
            />
          </View>
          <Pressable
            onPress={() => setShowAttachmentModal(true)}
            style={{
              width: wp(8),
              height: hp(4),
              borderRadius: hp(2),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors.PRIMARY[100],
              position: 'absolute',
              left: hp(18),
              bottom: hp(0),
            }}
          >
            <Icon
              family="Ionicons"
              name="camera"
              size={20}
              color={currentTheme?.text}
            />
          </Pressable>
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
            <Switch onChange={() => themetoggle()} value={theme === 'dark'} />
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
      <Attachment
        visible={showAttachmentModal}
        onClose={() => setShowAttachmentModal(false)}
        onGallery={pickGallery}
        onCamera={openCamera}
        icon={''}
        title={''}
        color={''}
        onPress={function (): void {
          throw new Error('Function not implemented.');
        }}
        family={undefined}
      />
    </View>
  );
};

export default Profile;
