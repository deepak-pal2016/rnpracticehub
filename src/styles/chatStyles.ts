/* eslint-disable @typescript-eslint/no-unused-vars */
import { StyleSheet } from 'react-native';
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
      marginRight: 10,
      marginBottom: 5,
      width: 35,
      height: 35,
      borderRadius: 18,
      backgroundColor: Colors.PRIMARY[100],
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default chatStyles;