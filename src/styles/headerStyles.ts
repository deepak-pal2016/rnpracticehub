import { StyleSheet } from 'react-native';
import { cardShadow, Colors, Typography } from '@constant/index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '@constant/dimentions';

const styles =(theme:any) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    borderBottomWidth:0.3,
    borderBottomColor:Colors.FLOATINGINPUT[100]
  },

  usercontainer: {
    position: 'absolute',
    top: hp(.5),
    right: wp(2),
    zIndex: 10,
    alignSelf:'center',
    flexDirection:'row',
    justifyContent:'space-evenly'
  },

  radiusview: {
    paddingVertical: hp(2.5),
    paddingHorizontal: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: Colors.PRIMARY[800],
    borderRadius: hp(1.2),
  },

  /* Screen Name Center */
  screenNameWrapper: {
    // position: 'absolute',
    paddingVertical:hp(2),
    top: hp(0),
    alignSelf: 'center',
  },

  screenname: {
    color: theme?.text,
    ...Typography.H5Medium18,
    padding:hp(1)
  },

  /* Back Header */
  screenheader: {
    flexDirection: 'row',
    alignItems: 'center',
    left: hp(2),
    backgroundColor: 'transparent',
    ...cardShadow,
  },

  headerTitle: {
    color: theme?.text,
    ...Typography.ButtonText16,
    textAlign:'justify',
    padding:hp(2)
  },

  backiconstyle: {
    width: wp(7.6),
    height: hp(4.2),
    borderRadius: hp(1),
    alignItems: 'center',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    top:hp(.4)
  
  },
});

export default styles;
