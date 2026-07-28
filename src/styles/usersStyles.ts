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
      backgroundColor: '#fff',
    },

    card: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      marginHorizontal: 16,
      marginVertical: 6,
      backgroundColor: '#fff',
      borderRadius: 12,
      elevation: 2,
    },

    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 12,
    },

    textContainer: {
      flex: 1,
      left: hp(1),
    },

    name: {
       color:Colors.SECONDARY[200],
       ...Typography.BodyRegular14,
       textAlignVertical:'top',
       padding:hp(1),
       bottom:hp(1)
    },

    message: {
      fontSize: 13,
      color: '#6B7280',
      marginTop: 3,
    },

    rightSection: {
      alignItems: 'flex-end',
    },

    time: {
      fontSize: 12,
      color: '#9CA3AF',
      marginBottom: 6,
    },
    userimglist: {
      width: wp(16),
      height: wp(16),
      borderRadius: wp(8),
      overflow: 'hidden',
      backgroundColor: Colors.SECONDARY[100],
      justifyContent: 'center',
      alignItems: 'center',
      ...cardShadow,
    },

    avatarimg: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
  });

export default styles;
