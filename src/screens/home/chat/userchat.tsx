/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, { FC, useState, useEffect, useContext, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import chatStyles from '@styles/chatStyles';
import { UserData, UserDataContext } from '../../../context/userDataContext';
import { ThemeContext } from '../../../context/themeContext';
import {
  CommonLoader,
  DarkTheme,
  Header,
  LightTheme,
  TextView,
  Attachment,
  Voicerecorder,
} from '@components/index';
import { cardShadow, Colors, Icon, Typography } from '@constant/index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '@constant/dimentions';
import Socket from '@services/socket/socket';
import { fetchuserchat } from '@redux/slices/chatSlice';
import { useDispatch, useSelector } from 'react-redux';
//@ts-ignore
import type { AppDispatch } from '../../../redux/store';
import { showError, showSuccess } from '@components/Flashmessge';
import APiService from '@services/apiservice';
import AudioPlayer from '@components/Voicerecording/playrecording';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackProps } from 'src/@types';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { pick } from '@react-native-documents/picker';

type UserchatscreenNavigationType = NativeStackNavigationProp<
  HomeStackProps,
  'Userchat'
>;

const Userchat: FC<any> = props => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<UserchatscreenNavigationType>();
  const dispatch = useDispatch<AppDispatch>();
  const { reciever } = props.route.params;
  const { showLoader, hideLoader } = CommonLoader();
  const { userData, setIsLoggedIn } = useContext<UserData>(UserDataContext);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;
  const styles = chatStyles(currentTheme);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const chatState = useSelector(
    (state: any) => state?.fetchchat?.data?.data || [],
  );
  const flatlistRef = useRef<FlatList>(null);
  const onlineusers = useSelector((state: any) => state?.onlineuser?.users);
  const isonlineuser = onlineusers.includes(String(reciever?._id));
  const [typing, setTyping] = useState<boolean>(false);
  const [incomingcall, setIncomingCall] = useState<any>('');
  const typingtimeoutRef = useRef<any>(null);

  //audio call code
  const startAudiocall = () => {
    if (!userData?._id || !reciever?._id) return;

    Socket.emit('audio_call', {
      callerId: userData._id,
      receiverId: reciever._id,
      callerName: userData.name,
      receiverName: reciever.name,
      type: 'audio',
    });

    console.log('Audio calling...');
    // navigation.navigate('Audiocall', {
    //   //@ts-ignore
    //   callerId: userData._id,
    //   callerName: userData.name,
    //   receiverId: reciever._id,
    //   receiverName: reciever.name,
    //   isCaller: true,
    //   callType: 'audio',
    // });
  };

  useEffect(() => {
    const handleacceptcall = async () => {
      console.log('audi call accepted');
      await startAudiocall();

      navigation.navigate('Audiocall', {
        //@ts-ignore
        callerId: userData?._id,
        callerName: userData?.name,
        receiverId: reciever?._id,
        receiverName: reciever?.name,
        isCaller: true,
      });
    };

    Socket.on('audio_call_accepted', handleacceptcall);
    return () => {
      Socket.off('audio_call_accepted', handleacceptcall);
    };
  }, []);

  useEffect(() => {
    const handleIncomingAudiocall = (data: any) => {
      console.log('incoming audio call', data);
      // setIncomingCall(data);
      navigation.navigate('Audiocall', {
        //@ts-ignore
        callerId: data?.callerId,
        callerName: data?.callerName,
        receiverId: data?.receiverId,
        isCaller: false,
        incomingCall: true,
        callType: 'audio',
      });
    };
    Socket.on('incoming_audio_call', handleIncomingAudiocall);
    return () => {
      Socket.off('incoming_audio_call', handleIncomingAudiocall);
    };
  }, []);

  // video call code
  const startvideocall = () => {
    Socket.emit('video_call', {
      callerId: userData?._id,
      receiverId: reciever?._id,
      callerName: userData?.name,
    });

    navigation.navigate('VideoCallScreen', {
      //@ts-ignore
      callerId: userData?._id,
      callerName: userData?.name,
      receiverId: reciever?._id,
      receiverName: reciever?.name,
      isCaller: true,
    });
  };

  useEffect(() => {
    Socket.on('incoming_video_call', data => {
      // console.log(data, 'incoming call');
      navigation.navigate('IncomingCallScreen', {
        //@ts-ignore
        callerId: data?.callerId,
        receiverId: userData?._id,
        callerName: data?.callerName,
      });
    });

    return () => {
      Socket.off('incoming_video_call');
    };
  }, []);

  useEffect(() => {
    const handleTyping = (data: { senderId: any; recieverId: any }) => {
      if (
        String(data.senderId) === String(reciever?._id) &&
        String(data.recieverId) === String(userData?._id)
      ) {
        setTyping(true);

        if (typingtimeoutRef.current) {
          clearTimeout(typingtimeoutRef.current);
        }

        typingtimeoutRef.current = setTimeout(() => {
          setTyping(false);
        }, 1000);
      }
    };
    Socket.on('user_typing', handleTyping);
    return () => {
      Socket.off('user_typing', handleTyping);
    };
  }, [reciever?._id, userData?._id]);

  // connet user with cahat
  useEffect(() => {
    Socket.on('connect', () => {
      // console.log('Socket connected:', Socket.id);
    });

    return () => {
      Socket.off('connect');
    };
  }, []);

  useEffect(() => {
    if (userData?._id) {
      Socket.emit('user_online', userData._id);
      // console.log('USER JOINED SOCKET ROOM');
    }
  }, [userData?._id]);

  useEffect(() => {
    if (chatState?.length) {
      setMessages(prev => {
        const ids = new Set(prev.map(m => m._id));
        //@ts-ignore
        const newData = chatState.filter(m => !ids.has(m._id));
        return [...prev, ...newData];
      });
    }
  }, [chatState]);

  // useEffect(() => {
  //   flatlistRef.current?.scrollToEnd({ animated: true });
  // }, [messages]);

  useEffect(() => {
    const fetchchat = async () => {
      try {
        showLoader();
        const body = {
          senderId: userData?._id,
          receiverId: reciever?._id,
        };

        const resp = await dispatch(fetchuserchat(body));
        if (resp?.payload?.success === true) {
          // showSuccess('chat fetched successfully..');
        } else {
          showError('failed to fetch chat');
        }
      } catch (error) {
        console.log('error', error);
      } finally {
        hideLoader();
      }
    };

    fetchchat();
  }, [dispatch, userData?._id, reciever?._id]);

  useEffect(() => {
    Socket.on('receivemessage', msg => {
      if (!msg._id) {
        msg._id = Date.now().toString();
      }
      setMessages(prev => [msg, ...prev]);
    });

    return () => {
      Socket.off('receivemessage');
    };
  }, []);

  const sendMessage = () => {
    if (!text.trim()) return;
    const msg = {
      tempId: Date.now().toString(),
      senderId: userData?._id,
      receiverId: reciever?._id,
      message: text,
      messageType: 'text',
      createdAt: new Date().toISOString(),
    };
    Socket.emit('sendmessage', msg);
    setMessages(prev => [msg, ...prev]);
    setText('');
  };

  const pickGallery = async () => {
    try {
      const response = await launchImageLibrary({
        mediaType: 'mixed',
        selectionLimit: 1,
      });

      if (response.assets?.length) {
        console.log(response.assets[0]);

        // upload api call
        // const res = await APiService.uploadfile(response.assets[0])

        setShowAttachmentModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openCamera = async () => {
    try {
      const response = await launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
      });

      if (response.assets?.length) {
        console.log(response.assets[0]);

        setShowAttachmentModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const pickDocument = async () => {
    try {
      const [file] = await pick();

      console.log(file);

      setShowAttachmentModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  // const sendAudioMessage = (filePath: string) => {
  //   const msg = {
  //     tempId: Date.now().toString(),
  //     senderId: userData?._id,
  //     receiverId: reciever?._id,
  //     message: '',
  //     messageType: 'audio',
  //     mediaUrl: filePath, // ⚠️ abhi local path hai
  //     createdAt: new Date().toISOString(),
  //   };

  //   Socket.emit('sendmessage', msg);
  //   setMessages(prev => [msg, ...prev]);
  // };

  const renderItem = ({ item }: any) => {
    const isMe = item.senderId === userData?._id;
    // console.log(item.mediaUrl, '===');

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: isMe ? 'flex-end' : 'flex-start',
          marginVertical: 4,
          paddingHorizontal: 10,
        }}
      >
        <View
          style={{
            backgroundColor: isMe ? Colors.PRIMARY[100] : '#fff',
            padding: 10,
            borderRadius: 12,

            // WhatsApp style bubble shape
            borderTopRightRadius: isMe ? 0 : 12,
            borderTopLeftRadius: isMe ? 12 : 0,

            maxWidth: wp(80),
            ...cardShadow, // Android shadow
          }}
        >
          {/* Message */}
          <TextView
            style={{
              color: isMe ? Colors.SECONDARY[100] : Colors.SECONDARY[200],
            }}
          >
            {item.message}
          </TextView>

          {item.messageType === 'audio' && <AudioPlayer url={item.mediaUrl} />}

          <TextView
            style={{
              fontSize: 10,
              color: isMe ? '#e0e0e0' : '#888',
              alignSelf: 'flex-end',
              marginTop: 4,
            }}
          >
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </TextView>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.background }}>
      <Header
        showheader
        title={`${reciever?.name || 'User'} \n ${
          typing ? 'typing...' : isonlineuser ? 'online' : 'offline'
        }`}
        showicons={true}
        receiverid={reciever?._id}
        onVideocallpress={startvideocall}
        onAudiocallpress={startAudiocall}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={{ flex: 1 }}>
          <FlatList
            data={[...(messages.length ? messages : chatState)]}
            keyExtractor={(item, index) =>
              item?._id?.toString() ||
              item?.tempId?.toString() ||
              index.toString()
            }
            renderItem={renderItem}
            inverted
            ref={flatlistRef}
            onContentSizeChange={() =>
              flatlistRef.current?.scrollToOffset({
                offset: 0,
                animated: false,
              })
            }
            showsVerticalScrollIndicator={false}
            maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingTop: hp(2),
              paddingBottom: hp(14),
            }}
          />
        </View>
        <View style={[styles.inputbar, { paddingBottom: insets.bottom || 8 }]}>
          {/* INPUT */}
          <TextInput
            style={styles.inputtext}
            placeholder="Type a message"
            placeholderTextColor={Colors.FLOATINGINPUT[100]}
            value={text}
            onChangeText={value => {
              setText(value);
              if (!value.trim()) return;
              Socket.emit('user_typing', {
                senderId: userData?._id,
                recieverId: reciever?._id,
              });
            }}
          />

          {/* <TouchableOpacity
            onPressIn={startrecording}
            onPressOut={stoprecording}
            // style={styles.sendBtn}
            style={{right:hp(1)}}
          >
            <Icon
              name={isRecording ? 'mic-off' : 'mic'}
              size={22}
              color={currentTheme.background}
              family="Ionicons"
            />
          </TouchableOpacity> */}
          <View style={styles.itemwidth}>
            <Voicerecorder
              onSend={async (filePath: string) => {
                const res: any = await APiService.uplaodaudio(filePath);
                //  console.log('=====3res', res);

                const msg = {
                  tempId: Date.now().toString(),
                  senderId: userData?._id,
                  receiverId: reciever?._id,
                  messageType: 'audio',
                  mediaUrl: res.url,
                  createdAt: new Date().toISOString(),
                };

                Socket.emit('sendmessage', msg);
                setMessages(prev => [msg, ...prev]);
              }}
            />

            <TouchableOpacity
              onPress={() => setShowAttachmentModal(true)}
              style={{ right: hp(1.2) }}
            >
              <Icon
                name="attach"
                size={22}
                color={currentTheme.background}
                family="Ionicons"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowAttachmentModal(true)}
              style={{ marginLeft: hp(0.7) }}
            >
              <Icon
                name="camera"
                size={22}
                color={currentTheme.background}
                family="Ionicons"
              />
            </TouchableOpacity>

            {/* 😊 */}
            {/* <TouchableOpacity>
            <TextView style={{ fontSize: 18 }}>😊</TextView>
          </TouchableOpacity> */}

            {/* SEND */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => sendMessage()}
              style={styles.sendBtn}
            >
              <Icon
                family="Ionicons"
                name="send"
                color={currentTheme.background}
                size={18}
              />
            </TouchableOpacity>
          </View>
          <Attachment
            visible={showAttachmentModal}
            onClose={() => setShowAttachmentModal(false)}
            onGallery={pickGallery}
            onCamera={openCamera}
            onDocument={pickDocument}
            onLocation={() => {
              setShowAttachmentModal(false);
            } }
            onContact={() => {
              setShowAttachmentModal(false);
            } } icon={''} title={''} color={''} onPress={function (): void {
              throw new Error('Function not implemented.');
            } } family={undefined}          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Userchat;
