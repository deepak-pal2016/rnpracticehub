/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import React, { FC, useContext, useMemo, useState } from 'react';
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
import { cardShadow, Colors, Images, Typography } from '@constant/index';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { TaskSchema } from '@helpers/validations';
import { AddTask, Getallusertask } from '@redux/slices/taskSlice';
import { showError, showSuccess } from '@components/Flashmessge';
import { UserData, UserDataContext } from '../../../context/userDataContext';
import { HomeStackProps } from 'src/@types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type TaskdetailsscreenNavigationType = NativeStackNavigationProp<
  HomeStackProps,
  'Taskdetails'
>;

const Taskdetails: FC = ({ route }: any) => {
  const { showLoader, hideLoader } = CommonLoader();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();
  const { theme, themetoggle } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;
  const styles = addtaskStyles(currentTheme);
  const {  userData } = useContext<UserData>(UserDataContext);
  const task: any = route.params?.detailstask;
  console.log(task, '=3=3=3',userData);

  return (
    <ScrollView style={styles.containertaskdtails}>
      <View
        style={{
          backgroundColor: Colors.SECONDARY[100],
          borderRadius: 12,
          padding: wp(4),
          margin: wp(3),
          // ...cardShadow
        }}
      >
        {/* Title */}
        <TextView
          style={{
            ...Typography.H4SemiBold20,
            color: Colors.SECONDARY[200],
            marginBottom: hp(1),
          }}
        >
          {(task?.title || '').charAt(0).toUpperCase() +
            (task?.title || '').slice(1)}
        </TextView>

        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: Colors.SECONDARY[100],
            marginVertical: hp(1),
          }}
        />

        {/* Description */}
        <TextView style={styles.label}>Description</TextView>
        <TextView
          style={[
            styles.value,
            {
              marginTop: hp(0.5),
              lineHeight: hp(2.5),
            },
          ]}
        >
          {task?.description || '-'}
        </TextView>

        {/* Category */}
        <View style={styles.row}>
          <TextView style={styles.label}>Category</TextView>
          <TextView style={styles.value}>{task?.category}</TextView>
        </View>

        {/* Status */}
        <View style={styles.row}>
          <TextView style={styles.label}>Status</TextView>
          <TextView
            style={[
              styles.value,
              {
                color:
                  task?.status === 'pending'
                    ? '#FFA500'
                    : task?.status === 'completed'
                    ? '#4CAF50'
                    : Colors.SECONDARY[200],
              },
            ]}
          >
            {(task?.status || '').charAt(0).toUpperCase() +
              (task?.status || '').slice(1)}
          </TextView>
        </View>

        {/* Priority */}
        <View style={styles.row}>
          <TextView style={styles.label}>Priority</TextView>
          <TextView style={[styles.value, { color: task?.priorityColor }]}>
            {task?.priority}
          </TextView>
        </View>

        {/* Assigned By */}
        <View style={styles.row}>
          <TextView style={styles.label}>Assigned By</TextView>
          <TextView style={styles.value}>{task?.assignedBy?.name}</TextView>
        </View>

        {/* Assigned To */}
        <View style={styles.row}>
          <TextView style={styles.label}>Assigned To</TextView>
          <TextView style={styles.value}>{task?.userId?.name}</TextView>
        </View>

        {/* Created Date */}
        <View style={styles.row}>
          <TextView style={styles.label}>Created</TextView>
          <TextView style={styles.value}>
            {moment(task?.createdAt).format('DD MMM YYYY, hh:mm A')}
          </TextView>
        </View>

        {/* Updated Date */}
        <View style={styles.row}>
          <TextView style={styles.label}>Updated</TextView>
          <TextView style={styles.value}>
            {moment(task?.updatedAt).format('DD MMM YYYY, hh:mm A')}
          </TextView>
        </View>

        {/* Completed */}
        <View style={styles.row}>
          <TextView style={styles.label}>Completed</TextView>
          <TextView style={styles.value}>
            {task?.isCompleted ? 'Yes ✅' : 'No ❌'}
          </TextView>
        </View>

        {task?.remarks && (
          <View>
            <View style={styles.row}>
              <TextView style={styles.label}>Remarks of Task</TextView>
              <TextView style={styles.value}>{task?.remarks}</TextView>
            </View>

            <View style={styles.row}>
              <TextView style={styles.label}>Done By Task:</TextView>
              <TextView style={styles.value}>{task?.userId?.name}</TextView>
            </View>
          </View>
        )}
      
        {userData?._id != task?.assignedBy?._id && task?.isCompleted !== true && (
          <Button
            gradientColors={[
              Colors.PRIMARY[100],
              Colors.PRIMARY[200],
              Colors.PRIMARY[300],
            ]}
            title="Mark as Completed"
            onPress={() =>
              navigation.navigate('Taskstatus', { detailstask: task })
            }
            style={{ marginTop: hp(4) }}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default Taskdetails;
