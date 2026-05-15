/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { FC, useContext, useMemo, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackProps } from 'src/@types';
import taskliststyles from '@styles/taskStyles';
import { ThemeContext } from '../../../context/themeContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '@constant/dimentions';
import { DarkTheme, Header, LightTheme, TextView } from '@components/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@constant/colors';
import { cardShadow, Icon, Images, Typography } from '@constant/index';
import { useSelector } from 'react-redux';
import moment from 'moment';

type TasklistscreenNavigationType = NativeStackNavigationProp<
  HomeStackProps,
  'Tasklist'
>;

const Tasklist: FC = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;
  const styles = taskliststyles(currentTheme);
  const [getselectedid, setGetSelectedId] = useState<any>(0);
  const alltaskState = useSelector(
    (state: any) => state?.getalltask?.data?.data || [],
  );
  const taskproritys = [
    'All',
    ...new Set(alltaskState?.map((item: any) => item?.category)),
  ];
  const [recenttaskArr, setRecentTaskArr] = useState<any>(alltaskState);

  const searchtask = (keyword: any) => {
    if (!keyword) {
      setRecentTaskArr(taskproritys);
      return;
    }
    const filterdata = recenttaskArr?.filter((item: any) =>
      item?.nametask?.toLowerCase().includes(keyword.toLowerCase()),
    );
    if (filterdata) {
      setRecentTaskArr(filterdata);
    } else {
      setRecentTaskArr(recenttaskArr);
    }
  };

  const findbycategory = (cat: any, index: any) => {
    setGetSelectedId(index);
    let data = alltaskState;
    if (cat !== 'All') {
      data = alltaskState.filter((item: any) => item?.category === cat);
    }
    setRecentTaskArr(data);
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View style={styles.taskcontentview}>
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
              tintColor:
                item?.isCompleted === true
                  ? Colors.PRIMARY[100]
                  : item?.priorityColor,
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
              ...Typography.BodyMedium14,
            }}
          >
            {item?.title}
          </TextView>
          <View style={{flexDirection:'row', alignItems:'flex-start'}}>
            <TextView
              style={{
                color: Colors.FLOATINGINPUT[100],
                ...Typography.BodyRegular13,
                marginTop: hp(0.4),
              }}
            >
              {moment(item?.dueDate).format('DD/MM/YYYY')}
            </TextView>

            <TextView
              style={{
                color:  item?.isCompleted === true
                  ? Colors.PRIMARY[100]
                  : item?.priorityColor,
                ...Typography.BodyRegular13,
                marginTop: hp(0.4),
                left:hp(6)
              }}
            >
              {item?.status.charAt(0)?.toUpperCase() + item?.status?.slice(1)}
            </TextView>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            paddingHorizontal: hp(1),
          }}
        >
          <Icon
            family="Feather"
            name="more-horizontal"
            size={25}
            color={Colors.SECONDARY[200]}
          />
        </View>
      </View>
    );
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
      <Header showheader={true} showicons={true} title="Task List" />
      <TouchableWithoutFeedback>
        <View style={{ marginTop: hp(2), flex: 1 }}>
          <View style={styles.searchcontainer}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <Icon
                family="Ionicons"
                name="search"
                color={Colors?.FLOATINGINPUT[400]}
                size={22}
              />
              <TextInput
                placeholder="Search tasks"
                placeholderTextColor={Colors?.FLOATINGINPUT[400]}
                style={styles.searchinput}
                onChangeText={(text: any) => searchtask(text)}
              />
            </View>
          </View>
          <View
            style={{
              margin: hp(1),
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'flex-start',
            }}
          >
            {taskproritys?.map((item: any, index: any) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => findbycategory(item, index)}
                  key={index}
                  style={[
                    styles.prioritymenu,
                    {
                      backgroundColor:
                        index === getselectedid
                          ? Colors.PRIMARY[100]
                          : '#dee3eb',
                    },
                  ]}
                >
                  <TextView
                    style={{
                      color:
                        index === getselectedid
                          ? Colors.SECONDARY[100]
                          : Colors.SECONDARY[200],
                      ...Typography.BodyRegular12,
                      textAlign: 'center',
                    }}
                  >
                    {' '}
                    {item?.charAt(0)?.toUpperCase() + item?.slice(1)}
                  </TextView>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{ marginTop: hp(1) }}>
            <FlatList
              data={recenttaskArr}
              keyExtractor={(item, index) =>
                item?.id?.toString() || index.toString()
              }
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={7}
              removeClippedSubviews
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Tasklist;
