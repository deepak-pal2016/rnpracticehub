/* eslint-disable no-catch-shadow */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import { View, Image, TouchableWithoutFeedback, Pressable } from 'react-native';
import React, { FC, useContext, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import loginStyles from '@styles/loginStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors, Images, Typography } from '@constant/index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '@constant/dimentions';
import {
  Button,
  FloatingTextInput,
  TextView,
  DividerWithText,
  LightTheme,
  DarkTheme,
  CommonLoader,
} from '@components/index';
import { ThemeContext } from '../../context/themeContext';
import { AuthStackProps } from 'src/@types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import { SignInValidationSchema } from '@helpers/validations';
import { Loginuser } from '@redux/slices/authSlice';
import {
  getMessaging,
  getToken,
  requestPermission,
  onTokenRefresh,
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import { useDispatch } from 'react-redux';
import { useAppDispatch } from '@redux/store/hooks';
import { showError, showSuccess } from '@components/Flashmessge';
import { LocalStorage } from '@helpers/localstorage';
import { UserDataContext } from '../../context';
import { UserData } from '../../context/userDataContext';
import { useLoginMutation } from '@services/rtkquery/apis/authapi';
import Socket from '@services/socket/socket';
type LoginscreenNavigationType = NativeStackNavigationProp<
  AuthStackProps,
  'Login'
>;

const Login: FC = () => {
  // const [login, { data, error, isLoading }] = useLoginMutation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { setIsLoggedIn, setUserData } = useContext<UserData>(UserDataContext);
  const { showLoader, hideLoader } = CommonLoader();
  const { theme, themetoggle } = useContext(ThemeContext);
  const [isSecure, setIsSecure] = useState<boolean>(true);
  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;
  const styles = loginStyles(currentTheme);

  const { values, errors, touched, handleSubmit, handleChange, setFieldValue } =
    useFormik({
      validationSchema: SignInValidationSchema,
      initialValues: {
        email: '',
        password: '',
      },
      onSubmit: async (data: any) => {
        const token = await getfcmtoken();
        const addwihtfmcdta = { ...data, fcmtoken: token };
        showLoader();
        // try {  rtk query code
        //   const response: any = await login(addwihtfmcdta).unwrap();
        //   console.log(response?.success, '==addwihtfmcdta==', response?.data);
        //   if (response?.success === true) {
        //     await LocalStorage.save('@user', response?.data);
        //     await LocalStorage.save('@login', true);
        //     setUserData(response?.data)
        //     showSuccess('Login Successfully');
        //   } else {
        //     showError('Login Failed try again..');
        //   }
        // } catch (error: any) {
        //   console.log(error, 'error==');
        // } finally {
        //   hideLoader();
        // }
        try {
          const response: any = await dispatch(
            Loginuser(addwihtfmcdta),
          ).unwrap();
          if (response?.success === true) {
            await LocalStorage.save('@user', response?.data);
            await LocalStorage.save('@token', response?.data?.token);
            await LocalStorage.save('@login', true);
            setIsLoggedIn(true)
            setUserData(response?.data);
            Socket.emit('join', response?.data?._id)
            showSuccess('Login Successfully');
          } else {
            showError(response?.message || 'Login failed');
          }
        } catch (error: any) {
          console.log('ERROR FULL:', error);
          showError('Login Failed');
          if (error?.status === 500) {
            showError('Internal Server Error');
          } else if (error?.status === 404) {
            showError(error?.message || 'User not found');
          } else {
            showError(
              error?.data?.message ||
                error?.message ||
                'Something went wrong. Please try again later.',
            );
          }
        } finally {
          hideLoader();
        }
      },
    });

  const getfcmtoken = async () => {
    const app = getApp();
    const messageingInstance = getMessaging(app);

    const authstatus = await requestPermission(messageingInstance);
    const enabled = authstatus === 1 || authstatus === 2;
    if (!enabled) {
      console.log('permission not granted');
      return;
    }

    const token = await getToken(messageingInstance);
    return token;

    // onTokenRefresh(messageingInstance, newtoken => {
    //   console.log('refresh token', newtoken);
    // });
  };

  return (
    <TouchableWithoutFeedback>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor:
            theme === 'dark' ? currentTheme?.background : Colors.PRIMARY[800],
        }}
        enableOnAndroid={false}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={hp(1)}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <View style={{ alignSelf: 'center', top: hp(2) }}>
            <Image source={Images.ic_logo} style={styles.logostyles} />
            <View style={{ alignSelf: 'center', marginTop: hp(3) }}>
              <TextView style={styles.apptitle}>Welcome</TextView>
              <TextView style={[styles.apptitle, { ...Typography.H6Medium16 }]}>
                Login to manage your tasks
              </TextView>
            </View>
          </View>
          <View style={styles.panel}>
            <View style={styles.inputWrapper}>
              <FloatingTextInput
                lefticon={Images.ic_email}
                style={{ width: wp(80) }}
                label={'Email'}
                placeholder="email"
                value={values.email}
                error={errors.email}
                touched={touched.email}
                onChangeText={(text: any) =>
                  setFieldValue('email', text.replace(/\s/g, '').toLowerCase())
                }
              />
            </View>
            <View style={styles.inputWrapper}>
              <FloatingTextInput
                lefticon={Images.ic_lock}
                style={{ width: wp(80) }}
                label={'Password'}
                placeholder="password"
                value={values.password}
                error={errors.password}
                touched={touched.password}
                isSecure={isSecure}
                onSecureTextPress={() => setIsSecure(!isSecure)}
                onChangeText={(text: any) =>
                  setFieldValue('password', text.replace(/\s/g, ''))
                }
              />
            </View>
          </View>
          <Button
            style={styles.buttonview}
            onPress={() => handleSubmit()}
            titleStyle={{
              color: Colors.SECONDARY[100],
              ...Typography.BodyMedium14,
            }}
            title={'SIGN IN'}
            gradientColors={[
              Colors.PRIMARY[100],
              Colors.PRIMARY[200],
              Colors.PRIMARY[300],
            ]}
          />

          <DividerWithText title="Or sign in with" />

          <Button
            style={styles.buttonview}
            onPress={() => console.log('ddf')}
            titleStyle={{
              color: Colors.SECONDARY[200],
              ...Typography.BodyMedium14,
            }}
            title={'Google'}
            gradientColors={[Colors.SECONDARY[100], Colors.SECONDARY[100]]}
            showIcon={Images.ic_google}
          />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: hp(2),
            }}
          >
            <TextView style={styles.accounttext}>
              Don't have an account?
            </TextView>
            <Pressable onPress={() => navigation.navigate('Signup')}>
              <TextView style={styles.singuptitle}>Sign up</TextView>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

export default Login;
