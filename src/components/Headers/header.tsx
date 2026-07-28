/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import createStyles from '@styles/headerStyles';
import { Colors, Icon, Typography } from '@constant/index';
import { useNavigation } from '@react-navigation/native';
import TextView from '@components/TextView/textView';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '@constant/dimentions';
// import { Logout, Signout } from '@redux/slices/authSlice';
import { useAppDispatch } from '@redux/store/hooks';
import { CommonLoader } from '@components/CommonLoader/commonLoader';
import { showError, showSuccess } from '@components/Flashmessge';
import { useFormik } from 'formik';
import { ThemeContext } from '../../context/themeContext';
import { DarkTheme, LightTheme } from '@components/theme/theme';


interface headerProps {
  showicons: boolean;
  showheader: boolean;
  title?: string;
  flexview?: number;
  onBackPress?: () => void;
  screenname?: string;
  receiverid: any;
  onVideocallpress?:()=> void
  onAudiocallpress?:() => void

}

const Header: React.FC<headerProps> = ({
  flexview,
  showicons,
  showheader,
  title,
  onBackPress,
  screenname,
  receiverid,
  onVideocallpress,
  onAudiocallpress
}) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { theme } = useContext(ThemeContext);
  // const { showLoader, hideLoader } = CommonLoader();
  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;
  const styles = createStyles(currentTheme);

  return (
    <View
      style={[
        styles.container,
        { flex: flexview, backgroundColor:
                    theme === 'dark' ? currentTheme?.background : Colors.SECONDARY[100] },
      ]}
    >
      {showicons && (
        // <TouchableOpacity
        //   activeOpacity={0.6}
        //   onPress={()=> navigation.navigate('Notification')}
        //   style={styles.usercontainer}
        // >
        //   <View style={styles.radiusview}>
        //     <Icon
        //       family="Ionicons"
        //       name="notifications-outline"
        //       size={26}
        //       color={currentTheme?.text}
        //     />
        //   </View>
        // </TouchableOpacity>
        <View style={styles.usercontainer}>
          <TouchableOpacity onPress={onVideocallpress} activeOpacity={0.7} style={styles.radiusview}>
            <Icon
              family="Ionicons"
              name="videocam-outline"
              size={23}
              color={Colors.SECONDARY[200]}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onAudiocallpress} activeOpacity={0.7} style={styles.radiusview}>
            <Icon
              family="Ionicons"
              name="call-outline"
              size={23}
              color={Colors.SECONDARY[200]}
            />
          </TouchableOpacity>
        </View>
      )}
      {screenname && (
        <View style={styles.screenNameWrapper}>
          <TextView style={styles.screenname}>{screenname}</TextView>
        </View>
      )}

      {showheader === true && (
        <View style={styles.screenheader}>
          <TouchableOpacity
            activeOpacity={0.6}
            disabled={isNavigating}
            onPress={onBackPress ?? (() => navigation.goBack())}
            style={styles.backiconstyle}
          >
            <Icon
              family="FontAwesome6"
              name="chevron-left"
              color={currentTheme?.text}
              size={20}
            />
          </TouchableOpacity>

          <TextView
            style={[
              styles.headerTitle,
              //@ts-ignore
              title?.length > 33 && Typography.BodyRegular16,
            ]}
          >
            {title}
          </TextView>
        </View>
      )}
    </View>
  );
};

export default Header;
