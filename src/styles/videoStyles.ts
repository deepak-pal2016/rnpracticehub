/* eslint-disable @typescript-eslint/no-unused-vars */
import { Platform, StyleSheet } from 'react-native';
import { cardShadow, Colors, Typography } from '@constant/index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '@constant/dimentions';

const videoStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },

    endcallbtn: {
      //   position: 'absolute',
      //   bottom: 50,
      alignSelf: 'center',
      width: wp(14),
      height: wp(14),
      borderRadius: wp(7),
      backgroundColor: Colors.ERROR[100],
      justifyContent: 'center',
      alignItems: 'center',
    },
    multiviewbtn: {
      position: 'absolute',
      bottom: hp(4),
      borderRadius: hp(2),
      justifyContent: 'space-evenly',
      flexDirection: 'row',
      alignSelf: 'center',
      width: wp(78),
      height: hp(8),
      backgroundColor: Colors.SECONDARY[200],
    },
    localstreamview: {
      width: 120,
      height: 180,
      position: 'absolute',
      top: 50,
      right: 20,
      borderRadius: 10,
    },
    remotetextview: {
      color: Colors.SECONDARY[100],
      ...Typography.BodyRegular13,
      textAlign: 'center',
      marginTop: 5,
    },
  });

export default videoStyles;
