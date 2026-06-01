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
import { Colors, Images, Typography } from '@constant/index';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { TaskstatusSchema } from '@helpers/validations';
import {
  AddTask,
  Getallusertask,
  MarkedcompletedtaskReducers,
  Markedcompletetask,
} from '@redux/slices/taskSlice';
import { showError, showSuccess } from '@components/Flashmessge';
import { UserData, UserDataContext } from '../../../context/userDataContext';
import { HomeStackProps } from 'src/@types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type TaskstatusscreenNavigationType = NativeStackNavigationProp<
  HomeStackProps,
  'Taskstatus'
>;

const Taskstatus: FC = ({ route }: any) => {
  const navigation = useNavigation<TaskstatusscreenNavigationType>();
  const { showLoader, hideLoader } = CommonLoader();
  const dispatch = useDispatch<any>();
  const insets = useSafeAreaInsets();
  const { theme, themetoggle } = useContext(ThemeContext);
  const [fromDatePickerOpen, setFromDatePickerOpen] = useState(false);
  const format = (date: Date) => moment(date).format('DD/MM/YYYY');
  const { userData, setIsLoggedIn } = useContext<UserData>(UserDataContext);
  const task: any = route.params?.detailstask;

  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;
  const styles = addtaskStyles(currentTheme);
  const colorchoose =
    theme === 'dark' ? Colors.FLOATINGINPUT[100] : Colors.FLOATINGINPUT[100];

  const taskstatusState = useSelector(
    (state: any) => state?.staticdata?.taskstatus,
  );

  const {
    values,
    errors,
    touched,
    resetForm,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    validationSchema: TaskstatusSchema,
    initialValues: {
      remarks: '',
      taskdate: '',
      taskstatus: '',
    },
    onSubmit: async (values: any) => {
      try {
        showLoader();
        const params = {
          taskId: task?._id,
          remarks: values.remarks,
          taskdate: values.taskdate,
          taskstatus: values.taskstatus,
        };

        const response: any = await dispatch(
          Markedcompletetask(params),
        ).unwrap();
        hideLoader();
        if (response?.status === true) {
          showSuccess(response?.message || 'Task marked as completed');
          dispatch(Getallusertask(userData?._id));
          resetForm();
          navigation.popToTop();
        } else {
          showError(
            response?.message || 'Sorry try again something went wrong...',
          );
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
    },
  });

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
          <View
            style={{
              marginTop: hp(0),
              justifyContent: 'space-evenly',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <View style={styles.inputwraper}>
              <FloatingTextInput
                lefticon={Images.ic_email}
                style={{ width: wp(80) }}
                label={'Task Assign By'}
                placeholder="task"
                value={task?.assignedBy?.name || ''}
                editable={false}
                onChangeText={function (text: string): void {
                  throw new Error('Function not implemented.');
                }}
              />
            </View>

            <View style={styles.inputwraper}>
              <FloatingTextInput
                lefticon={Images.ic_email}
                style={{ width: wp(80) }}
                label={'Task Name'}
                placeholder="task"
                value={task?.title || ''}
                editable={false}
                onChangeText={function (text: string): void {
                  throw new Error('Function not implemented.');
                }}
              />
            </View>

            <View style={styles.inputwraper}>
              <FloatingTextInput
                lefticon={Images.ic_email}
                style={{ width: wp(80) }}
                label={'Remarks'}
                placeholder="type remarks here"
                isMultiline={true}
                value={values.remarks}
                onChangeText={(text: any) => setFieldValue('remarks', text)}
                error={errors.remarks}
                touched={touched.remarks}
              />
            </View>

            <View style={styles.inputwraper}>
              <Pressable
                style={styles.textinput}
                onPress={() => setFromDatePickerOpen(true)}
              >
                <TextView style={styles.datetext}>Complete Task Date</TextView>
                <View style={styles.datecontainer}>
                  <Image
                    source={Images.ic_calendar}
                    style={styles.dateimg}
                    resizeMode="contain"
                  />
                  <TextInput
                    placeholderTextColor={colorchoose}
                    editable={false}
                    value={
                      values.taskdate
                        ? moment(values.taskdate).format('DD/MM/YYYY')
                        : moment().format('DD/MM/YYYY')
                    }
                    placeholder="select date"
                  />
                </View>
                {errors.taskdate && touched.taskdate && (
                  <TextView
                    style={{
                      color: Colors.ERROR[100],
                      marginLeft: hp(0.5),
                      marginTop: hp(1.4),
                      ...Typography.BodyRegular13,
                    }}
                  >
                    {errors.taskdate as string | undefined}
                  </TextView>
                )}
              </Pressable>
            </View>

            <View style={styles.inputwraper}>
              <CustomDropdown
                dropDownLable="Task Status"
                placeholder="choose options"
                items={taskstatusState}
                value={values.taskstatus}
                setValue={val => setFieldValue('taskstatus', val)}
                isRequired={true}
                error={
                  touched.taskstatus
                    ? (errors.taskstatus as string | undefined)
                    : undefined
                }
              />
            </View>

            <Button
              style={styles.buttonview}
              onPress={() => handleSubmit()}
              titleStyle={{
                color: Colors.SECONDARY[100],
                ...Typography.BodyMedium14,
              }}
              title={'Marked Task'}
              gradientColors={[
                Colors.PRIMARY[100],
                Colors.PRIMARY[200],
                Colors.PRIMARY[300],
              ]}
            />
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>

      <DatePicker
        modal
        open={fromDatePickerOpen}
        date={
          values.taskdate
            ? moment(values.taskdate, 'YYYY-MM-DD').toDate()
            : new Date()
        }
        minimumDate={moment().startOf('day').toDate()}
        mode="date"
        onConfirm={date => {
          setFromDatePickerOpen(false);
          const formatted = moment(date).format('YYYY-MM-DD');
          setFieldValue('taskdate', formatted);
           console.log('Selected Date =>', formatted)
        }}
        onCancel={() => setFromDatePickerOpen(false)}
      />
    </View>
  );
};

export default Taskstatus;
