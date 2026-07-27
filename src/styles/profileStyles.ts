/* eslint-disable @typescript-eslint/no-unused-vars */
import { StyleSheet } from 'react-native';
import { cardShadow, Colors, Typography } from '@constant/index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '@constant/dimentions';

const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      // justifyContent: 'center',
    },
    conentview: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      paddingHorizontal: hp(4),
      bottom:hp(3)
    },
    imgview: {
      
      width: wp(30),
      height: wp(30),
      borderRadius: wp(15),
      resizeMode: 'cover',
    },
    nametext: {
      textAlign: 'center',
      color: theme?.text,
      ...Typography.BodyRegular16,
    },
    itemview: {
      marginTop: hp(2),
      backgroundColor: '#1f2937',
      borderRadius: 16,
      paddingVertical: hp(1),
      marginHorizontal: wp(5),
    },
    menuitem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: hp(1),
      paddingHorizontal: wp(5),
      borderBottomWidth: 0.5,
      borderBottomColor: '#374151',
    },
    logoutview: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingVertical: hp(1),
      paddingHorizontal: wp(5),
    },
    emailtext: {
      color: theme?.text,
      ...Typography.BodyRegular13,
      textAlign: 'center',
      padding: hp(1),
    },
  });

export default styles;
