/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import {ActivityIndicator, View} from 'react-native';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import styles from './styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '@constant/dimentions';
import {Colors, Images} from '@constant/index';

interface ModalProps {
  showLoader: () => void;
  hideLoader: () => void;
}

const ModalContext = createContext<ModalProps | undefined>(undefined);

interface ProviderProps {
  children: ReactNode;
}

export const CommonLoaderProvider: React.FC<ProviderProps> = ({children}) => {
  const [modalShow, setModalShow] = useState(false);

  const showLoader = useCallback(() => setModalShow(true), []);
  const hideLoader = useCallback(() => setModalShow(false), []);

  return (
    <ModalContext.Provider value={{showLoader, hideLoader}}>
      {children}

      <Modal
        style={styles.modalBackground}
        isVisible={modalShow}
        coverScreen
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0.3}>
        <View style={styles.loaderView}>
          <ActivityIndicator size={'large'} color={Colors.PRIMARY[100]}  />
          {/* <LottieView
            source={Images.ic_loader} 
            autoPlay
            loop
            style={{width: wp(45), height: hp(20)}}
          /> */}
        </View>
      </Modal>
    </ModalContext.Provider>
  );
};

export const CommonLoader = (): ModalProps => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('CommonLoader must be used within a CommonLoaderProvider');
  }
  return context;
};
