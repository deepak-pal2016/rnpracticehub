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
  Voicerecorder,
} from '@components/index';
import { cardShadow, Colors, Icon } from '@constant/index';
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

const Userchat: FC<any> = props => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { reciever } = props.route.params;
  const { showLoader, hideLoader } = CommonLoader();
  const { userData, setIsLoggedIn } = useContext<UserData>(UserDataContext);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;
  const styles = chatStyles(currentTheme);
  const chatState = useSelector(
    (state: any) => state?.fetchchat?.data?.data || [],
  );
  const flatlistRef = useRef<FlatList>(null);
  const onlineusers = useSelector((state: any) => state?.onlineuser?.users);
  const isonlineuser = onlineusers.includes(String(reciever?._id));

  // connet user with cahat
  useEffect(() => {
    Socket.on('connect', () => {
      console.log('Socket connected:', Socket.id);
    });

    return () => {
      Socket.off('connect');
    };
  }, []);

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

  useEffect(() => {
    flatlistRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

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
    console.log('Socket connected:', Socket.connected);
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

          {item.messageType === 'audio' ? (
            <AudioPlayer url={item.mediaUrl} />
          ) : (
            <TextView>{item.message}</TextView>
          )}

          {/* Media (optional) */}
          {item?.mediaUrl && (
            <TextView
              style={{
                marginTop: 5,
                color: isMe ? Colors.SECONDARY[100] : Colors.SECONDARY[200],
                fontSize: 12,
              }}
            >
              {item.mediaUrl}
            </TextView>
          )}

          {/* {item.messageType === 'audio' && (
            <TouchableOpacity onPress={() => playAudio(item.mediaUrl)}>
              <TextView>▶️ Play Voice</TextView>
            </TouchableOpacity>
          )} */}

          {/* Time */}

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
          isonlineuser ? 'online' : 'offline'
        }`}
        showicons={false}
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
              flatlistRef.current?.scrollToOffset({ offset: 0 })
            }
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingTop: hp(2),
              paddingBottom: hp(7),
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
            onChangeText={setText}
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

          <Voicerecorder
            onSend={async (filePath: string) => {
              const res: any = await APiService.uplaodaudio(filePath);
              console.log('=====3res', res);

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

          <TouchableOpacity style={{ right: hp(1.2) }}>
            <Icon
              name="attach"
              size={22}
              color={currentTheme.background}
              family="Ionicons"
            />
          </TouchableOpacity>

          <TouchableOpacity style={{ marginLeft: hp(0.7) }}>
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
      </KeyboardAvoidingView>
    </View>
  );
};

export default Userchat;
