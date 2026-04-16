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
import { TaskSchema } from '@helpers/validations';
import { AddTask, Getallusertask } from '@redux/slices/taskSlice';
import { showError, showSuccess } from '@components/Flashmessge';
import { UserData, UserDataContext } from '../../../context/userDataContext';
import { HomeStackProps } from 'src/@types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AddtaskscreenNavigationType = NativeStackNavigationProp<
  HomeStackProps,
  'Addtask'
  >

const Addtask: FC = () => {
  const dispatch = useDispatch<any>();
  const insets = useSafeAreaInsets();
  const { theme, themetoggle } = useContext(ThemeContext);
  const [fromDatePickerOpen, setFromDatePickerOpen] = useState(false);
  const format = (date: Date) => moment(date).format('DD/MM/YYYY');
  const { userData, setIsLoggedIn } = useContext<UserData>(UserDataContext);
  const userState = useSelector(
    (state: any) => state?.userlist?.userlist?.data,
  );

    const userlistArr = userState?.filter((item:any) => item?._id !== userData?._id).map((item: any) => ({
      label: item?.name,
      value: item?._id,
    }));

  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;
  const styles = addtaskStyles(currentTheme);
  const colorchoose =
    theme === 'dark' ? Colors.FLOATINGINPUT[100] : Colors.FLOATINGINPUT[100];
  const taskcategoiresState = useSelector(
    (state: any) => state?.staticdata?.taskCategories,
  );
  const priorityoptionsState = useSelector(
    (state: any) => state?.staticdata?.priorityOptions,
  );

  const formatDate = (dateStr) => {
  if (!dateStr) return null;

  const [day, month, year] = dateStr.split('/');
  return new Date(`${year}-${month}-${day}`);
};

  const { values, errors, touched,resetForm, handleChange, handleSubmit, setFieldValue } =
    useFormik({
      validationSchema: TaskSchema,
      initialValues: {
        userid: '',
        taskname: '',
        description: '',
        category: '',
        duedate: '',
        priority: '',
      },
      onSubmit: async (values: any) => {  
        try {
          const params = {
            title: values.taskname,
            description: values.description,
            dueDate:  moment(values.duedate).toISOString(),
            priority: values.priority,
            userId: values.userid,
            category: values.category,
            assignedBy: userData?._id,
          };
          const response: any = await dispatch(AddTask(params)).unwrap();
          // console.log(response,'response=111deepak');
          
          if(response?.status === true){
            showSuccess('Task assign to user successfully..')
            dispatch(Getallusertask(userData?._id))
            resetForm()
          }else{
            showError('Sorry try again something went wrong...')
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'An error occurred while adding the task';
          showError(errorMessage);
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
      <Header
        title="Add Task"
        screenname="Add Task"
        showicons={true}
        showheader={false}
      />
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
              <CustomDropdown
                dropDownLable="Select User"
                placeholder="choose options"
                items={userlistArr}
                value={values.userid} // ✅ formik value
                setValue={val => setFieldValue('userid', val)} // ✅ formik update
                isRequired={true}
                error={
                  touched.userid
                    ? (errors.userid as string | undefined)
                    : undefined
                }
              />
            </View>

            <View style={styles.inputwraper}>
              <FloatingTextInput
                lefticon={Images.ic_email}
                style={{ width: wp(80) }}
                label={'Task Name'}
                placeholder="task"
                value={values.taskname}
                onChangeText={(text: any) => setFieldValue('taskname', text)}
                error={errors.taskname}
                touched={touched.taskname}
              />
            </View>

            <View style={styles.inputwraper}>
              <FloatingTextInput
                lefticon={Images.ic_email}
                style={{ width: wp(80) }}
                label={'DESCRIPTION'}
                placeholder="type description"
                isMultiline={true}
                value={values.description}
                onChangeText={(text: any) => setFieldValue('description', text)}
                error={errors.description}
                touched={touched.description}
              />
            </View>
            <View style={styles.inputwraper}>
              <CustomDropdown
                dropDownLable="CATEGORY"
                placeholder="choose options"
                items={taskcategoiresState}
                value={values.category}
                setValue={val => setFieldValue('category', val)}
                isRequired={true}
                error={
                  touched.category
                    ? (errors.category as string | undefined)
                    : undefined
                }
              />
            </View>

            <View style={styles.inputwraper}>
              <Pressable
                style={styles.textinput}
                onPress={() => setFromDatePickerOpen(true)}
              >
                <TextView style={styles.datetext}>Due Date</TextView>
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
                      values.duedate
                        ? moment(values.duedate).format('DD/MM/YYYY')
                        : moment().format('DD/MM/YYYY')
                    }
                    placeholder="select date"
                  />
                </View>
                {errors.duedate && touched.duedate && (
                  <TextView
                    style={{
                      color: Colors.ERROR[100],
                      marginLeft: hp(0.5),
                      marginTop: hp(1.4),
                      ...Typography.BodyRegular13,
                    }}
                  >
                    {errors.duedate}
                  </TextView>
                )}
              </Pressable>
            </View>

            <View style={styles.inputwraper}>
              <CustomDropdown
                dropDownLable="TASK PRIORITY"
                placeholder="choose options"
                items={priorityoptionsState}
                value={values.priority}
                setValue={val => setFieldValue('priority', val)}
                isRequired={true}
                error={
                  touched.priority
                    ? (errors.priority as string | undefined)
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
              title={'Add Task'}
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
          values.duedate
            ? moment(values.duedate, 'YYYY-MM-DD').toDate()
            : new Date()
        }
        minimumDate={new Date()}
        mode="date"
        onConfirm={date => {
          setFromDatePickerOpen(false);
          const formatted = moment(date).format('YYYY-MM-DD');
          setFieldValue('duedate', formatted);
        }}
        onCancel={() => setFromDatePickerOpen(false)}
      />
    </View>
  );
};

export default Addtask;
