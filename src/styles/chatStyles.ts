/* eslint-disable @typescript-eslint/no-unused-vars */
import { Platform, StyleSheet } from 'react-native';
import { cardShadow, Colors, Typography } from '@constant/index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '@constant/dimentions';

const chatStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },

    sendBtn: {
      marginLeft: 10,
      backgroundColor: Colors.PRIMARY[100],
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputbar: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      borderTopWidth: 0.5,
      borderColor: '#ccc',
      backgroundColor: theme.text,
      justifyContent: 'space-around',
    },
    inputtext: {
      // flex: 1,
      marginHorizontal: wp(2.3),
      backgroundColor: Colors.SECONDARY[100],
      borderRadius: hp(2),
      width: wp(59),
      paddingHorizontal: 20,
      paddingVertical: Platform.OS === 'ios' ? 10 : hp(1.8),
      color: '#000',
      right: hp(1.2),
    },
    itemwidth: {
      flexDirection: 'row',
      marginHorizontal: wp(2.3),
      // backgroundColor: Colors.SECONDARY[100],
      borderRadius: hp(2),
      justifyContent:'center',
      alignItems:'center',
      width: wp(28),
      paddingHorizontal: 20,
      paddingVertical: Platform.OS === 'ios' ? 10 : hp(.2),
      color: '#000',
      right: hp(1.6),
    },
  });

export default chatStyles;
