/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackProps } from 'src/@types';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dashboardstyle from '@styles/dashboardStyles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '@constant/dimentions';
import {
  CommonLoader,
  DarkTheme,
  Header,
  LightTheme,
  TextView,
} from '@components/index';
import { Colors, Icon, Typography, Images } from '@constant/index';
import { cardShadow } from '@constant/index';
import { ThemeContext } from '../../../context/themeContext';
import { useDispatch, useSelector } from 'react-redux';
import { Getuserlist } from '@redux/slices/userSlice';
import { UserData, UserDataContext } from '../../../context/userDataContext';
import { LocalStorage } from '@helpers/localstorage';
import { UsePagination } from '../../../hooks/usepagination';
import { Logoutuser } from '@redux/slices/authSlice';
import { showError, showSuccess } from '@components/Flashmessge';
import { Getallusertask } from '@redux/slices/taskSlice';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import moment from 'moment';
type DashboardscreenNavigationType = NativeStackNavigationProp<
  HomeStackProps,
  'Dashboard'
>;

const Dashboard: FC = () => {
  const dispatch = useDispatch<any>();
  const { showLoader, hideLoader } = CommonLoader();
  const navigation = useNavigation<DashboardscreenNavigationType>();
  const { theme, themetoggle } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;
  const styles = dashboardstyle(currentTheme);
  const alltasklist = useSelector(
    (state: any) => state?.getalltask?.data?.data,
  );
  const pagesize = alltasklist?.length > 10 ? 5 : 3;
  const { data, loading, hasMore, loadMore } = UsePagination(
    alltasklist,
    pagesize,
  );
  const { userData, setIsLoggedIn } = useContext<UserData>(UserDataContext);
  const [tasklist, setTaskList] = useState<any>([]);
  const pendingtask = useMemo(() => {
    return (alltasklist || []).filter(
      (item: any) => item?.status === 'pending',
    );
  }, [alltasklist]);

  const completetask = useMemo(() => {
    return (alltasklist || []).filter(
      (item: any) => item?.status === 'completed',
    );
  }, [alltasklist]);

  useEffect(() => {
    fetchuserliset();
  }, [userData?.email]);

  useEffect(() => {
    setTaskList([
      {
        taskname: 'Total Tasks',
        taskcount: alltasklist?.length || 0,
        color: Colors.PRIMARY[600],
      },
      {
        taskname: 'Completed',
        taskcount: completetask.length || 0,
        color: Colors.PRIMARY[500],
      },
      {
        taskname: 'Pending',
        taskcount: pendingtask.length || 0,
        color: Colors.PRIMARY[100],
      },
    ]);
  }, [alltasklist]);

  const fetchuserliset = async () => {
    try {
      showLoader();
      const resp: any = await dispatch(Getallusertask(userData?._id));
      console.log(resp, '-3-3-3');

      if (resp?.payload?.status === true) {
        await dispatch(Getuserlist(userData?.email)).unwrap();
      } else if (
        resp?.payload === 'Token expired or invalid' ||
        resp?.payload === 'Token expired'
      ) {
        handlelogout(userData);
      } else {
        showError('somehting went wrong,  down refresh.');
      }
    } catch (error: any) {
      if (error?.status === 401) {
        showError(error?.message);
        handlelogout(userData);
      } else {
      }
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      dispatch(Getallusertask(userData?._id));
      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId: 'default',
          smallIcon: 'ic_launcher',
        },
      });
    });

    return unsubscribe;
  }, []);

  const handlelogout = async (userData: any) => {
    try {
      // const response: any = dispatch(Logoutuser(userData)).unwrap();
      // console.log(response, 'logout response');
      setIsLoggedIn(false);
      await LocalStorage.save('@login', false);
      await LocalStorage.flushQuestionKeys();
    } catch (error: any) {
      console.log(error, 'logout error');
      showError(error?.message || 'Something went wrong');
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View
        style={{
          marginTop: hp(1),
          backgroundColor: Colors.SECONDARY[100],
          alignSelf: 'center',
          paddingHorizontal: wp(5),
          width: wp(88),
          borderRadius: 12,
          ...cardShadow,
          paddingVertical: hp(2),
          flexDirection: 'column',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left Icon */}
          <View
            style={{
              width: wp(8),
              height: wp(8),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              source={Images.ic_check}
              style={{
                width: wp(9),
                height: wp(9),
                resizeMode: 'contain',
                tintColor: item?.priorityColor,
              }}
            />
          </View>

          {/* Task Info */}
          <View
            style={{
              flex: 1,
              marginLeft: wp(4),
              top: hp(0.6),
            }}
          >
            <TextView
              style={{
                color: Colors.SECONDARY[200],
                ...Typography.BodyRegular15,
              }}
            >
              {(item?.title || '').charAt(0).toUpperCase() +
                (item?.title || '').slice(1)}
            </TextView>

            <TextView
              style={{
                color: Colors.FLOATINGINPUT[100],
                ...Typography.BodyRegular13,
                marginTop: hp(0.4),
              }}
            >
              {moment(item?.createdAt).format('DD/MM/YYYY')}
            </TextView>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              paddingHorizontal: hp(1),
            }}
          >
            {/* Right Avatar */}
            <Image source={Images.ic_userimg} style={styles.avatarview} />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: hp(1),
          }}
        >
          <View
            style={{
              backgroundColor:
                item?.status === 'completed'
                  ? Colors.PRIMARY[500]
                  : Colors.PRIMARY[100],
              borderRadius: hp(2),
              right: hp(1),
              alignSelf: 'flex-end',
              top: hp(1),
              paddingHorizontal: wp(3),
              paddingVertical: hp(1),
              bottom: hp(0),
            }}
          >
            <TextView
              style={{
                color: Colors.SECONDARY[100],
                ...Typography.BodyRegular12,
              }}
            >
              {item?.status?.charAt(0).toUpperCase() + item?.status?.slice(1)}
            </TextView>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.PRIMARY[100],
              borderRadius: hp(2),
              left: hp(1),
              alignSelf: 'flex-end',
              top: hp(1),
              paddingHorizontal: wp(3),
              paddingVertical: hp(1),
              bottom: hp(0),
            }}
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate('Taskdetails' as any, { detailstask: item });
            }}
          >
            <TextView
              style={{
                color: Colors.SECONDARY[100],
                ...Typography.BodyRegular12,
              }}
            >
              View Details
            </TextView>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const insets = useSafeAreaInsets();
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
        title="Dashboard"
        showicons={true}
        screenname="Dashboard"
        showheader={false}
      />
      <View style={styles.contentStyle}>
        <View
          style={{
            alignSelf: 'flex-start',
            paddingLeft: hp(6),
            flexDirection: 'row',
          }}
        >
          <TextView style={styles.greeings}>
            Hello {`${userData?.name}`}
          </TextView>
          <Image source={Images.ic_hi} style={styles.hiimg} />
        </View>
        <View
          style={{
            marginTop: hp(2),
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          {tasklist?.map((item: any, index: any) => {
            return (
              <View key={index} style={styles.taskview}>
                <View
                  style={{
                    width: wp(27),
                    height: hp(12),
                    borderRadius: hp(1),
                    backgroundColor: item?.color,
                    alignItems: 'center',
                    padding: hp(1),
                  }}
                >
                  <TextView style={styles.tasknamestyle}>
                    {item?.taskname}
                  </TextView>
                  <TextView
                    style={[
                      styles.tasknamestyle,
                      {
                        ...Typography.H1Bold32,
                        alignSelf: 'flex-start',
                        padding: hp(1),
                      },
                    ]}
                  >
                    {item?.taskcount}
                  </TextView>
                </View>
              </View>
            );
          })}
        </View>
        <Pressable
          onPress={() => navigation.navigate('Tasklist')}
          style={{
            padding: hp(2),
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          }}
        >
          <TextView
            style={{
              color: currentTheme?.text,
              ...Typography.BodyRegular13,
              textAlign: 'right',
              textDecorationLine: 'underline',
            }}
          >
            View All Task{' '}
          </TextView>
        </Pressable>
        <View style={styles.taskcontainer}>
          <TextView style={styles.recenttile}>Recent Task</TextView>
          <View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <TextView
                style={[styles.recenttile, { ...Typography.BodyRegular13 }]}
              >
                Today
              </TextView>
              <Icon
                family="Ionicons"
                name="chevron-forward-sharp"
                color={Colors.SECONDARY[200]}
                size={15}
              />
            </View>
          </View>
        </View>
        <View style={{ bottom: hp(3) }}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: hp(33) + insets.bottom,
            }}
            removeClippedSubviews={true}
            onEndReached={loadMore}
            windowSize={5}
            maxToRenderPerBatch={2}
            initialNumToRender={2}
            ListFooterComponent={
              loading ? (
                <ActivityIndicator size="large" color={Colors.PRIMARY[100]} />
              ) : !hasMore ? (
                <TextView
                  style={{
                    textAlign: 'center',
                    padding: 10,
                    color: Colors.SECONDARY[400],
                    ...Typography.BodyRegular12,
                  }}
                >
                  No more records available!
                </TextView>
              ) : null
            }
          />
        </View>
      </View>
    </View>
  );
};

export default Dashboard;
