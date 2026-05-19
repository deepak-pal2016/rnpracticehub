/* eslint-disable react-hooks/exhaustive-deps */
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
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackProps } from 'src/@types';
import taskliststyles from '@styles/taskStyles';
import { ThemeContext } from '../../../context/themeContext';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@constant/colors';
import { cardShadow, Icon, Images, Typography } from '@constant/index';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Menu, Divider } from 'react-native-paper';
import debounce from 'lodash/debounce';

type TasklistscreenNavigationType = NativeStackNavigationProp<
  HomeStackProps,
  'Tasklist'
>;

const Tasklist: FC = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;
  const styles = taskliststyles(currentTheme);
  const { showLoader, hideLoader } = CommonLoader();
  const [visible, setVisible] = useState<any>(false);
  const [getselectedid, setGetSelectedId] = useState<any>(0);
  const [menuid, setMenuId] = useState<any>('');
  const alltaskState = useSelector(
    (state: any) => state?.getalltask?.data?.data || [],
  );
  const taskproritys = [
    'All',
    ...new Set(alltaskState?.map((item: any) => item?.category)),
  ];
  const [recenttaskArr, setRecentTaskArr] = useState<any>(alltaskState);

  const searchtask = useCallback(
    (keyword: string) => {
      if (!keyword?.trim()) {
        setRecentTaskArr(alltaskState);
        return;
      }
      showLoader();
      const filterdata = alltaskState?.filter((item: any) =>
        item?.title?.toLowerCase().includes(keyword?.toLowerCase()),
      );
      hideLoader();
      setRecentTaskArr(filterdata);
    },
    [alltaskState],
  );

  useEffect(() => {
    return () => {
      debouncesearch.cancel();
    };
    //@ts-ignore
  }, [debouncesearch]);

  const debouncesearch = useMemo(
    () => debounce(searchtask, 500),
    [alltaskState],
  );

  const openMenu = (id: any) => {
    if (!id) {
      return;
    }
    setMenuId(id);
    if (id === menuid) {
      setVisible(true);
    }
  };

  const closeMenu = () => setVisible(false);

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
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
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
                color:
                  item?.isCompleted === true
                    ? Colors.PRIMARY[100]
                    : item?.priorityColor,
                ...Typography.BodyRegular13,
                marginTop: hp(0.4),
                left: hp(6),
              }}
            >
              {item?.status.charAt(0)?.toUpperCase() + item?.status?.slice(1)}
            </TextView>
          </View>
        </View>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity
              onPress={() => openMenu(index)}
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
            </TouchableOpacity>
          }
        >
          <Menu.Item
            onPress={() => {
              closeMenu();
              console.log('Edit');
            }}
            title="Edit"
            leadingIcon="pencil"
          />

          <Divider />

          <Menu.Item
            onPress={() => {
              closeMenu();
              console.log('Delete');
            }}
            title="Delete"
            leadingIcon="delete"
          />
        </Menu>
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
      <Header showheader={true} showicons={false} title="Task List" />
      <TouchableWithoutFeedback>
        <View style={{ marginTop: hp(1), flex: 1 }}>
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
                placeholder="Search task"
                placeholderTextColor={Colors?.FLOATINGINPUT[400]}
                style={styles.searchinput}
                //@ts-ignore
                onChangeText={(text: any) => debouncesearch(text)}
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
              contentContainerStyle={{ paddingBottom: hp(20) }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Tasklist;
