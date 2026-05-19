/* eslint-disable @typescript-eslint/no-unused-vars */
import { StyleSheet } from 'react-native';
import { cardShadow, Colors, Typography } from '@constant/index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '@constant/dimentions';

const taskStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    searchcontainer: {
      width: wp(85),
      alignSelf: 'center',
      height: hp(7),
      borderColor: Colors.FLOATINGINPUT[100],
      borderWidth: hp(0.1),
      borderRadius: hp(1.8),
      justifyContent: 'space-evenly',
      alignItems: 'center',
      // ...cardShadow,
      backgroundColor: 'white',
      margin: hp(1),
    },
    searchinput: {
      width: wp(75),
      height: hp(5),
      paddingHorizontal: hp(1.3),
      ...Typography.BodyMedium13,
      color: Colors?.SECONDARY[200],
      backgroundColor: theme?.backgroundColor,
    },
    prioritymenu: {
      paddingHorizontal: wp(2.8),
      paddingVertical: hp(0.8),
      borderRadius: hp(1.2),
      marginRight: hp(1.5),
      left: hp(3.2),
      ...cardShadow,
    },
    taskcontentview: {
      alignSelf: 'center',
      marginTop: hp(0.1),
      flexDirection: 'row',
      width: wp(100),
      height: hp(10),
      // borderRadius: 0,
      backgroundColor: Colors.SECONDARY[100],
      ...cardShadow,
      alignItems: 'center',
      paddingHorizontal: wp(8),
      justifyContent: 'space-between',
    },
  });

export default taskStyles;
