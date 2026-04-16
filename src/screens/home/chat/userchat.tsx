/* eslint-disable @typescript-eslint/no-unused-vars */
import { View, Platform, TouchableOpacity } from 'react-native';
import React, { FC, useCallback, useState, useEffect, useContext } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  GiftedChat,
  InputToolbar,
  Send,
  Bubble,
} from 'react-native-gifted-chat';

import chatStyles from '@styles/chatStyles';
import { ThemeContext } from '../../../context/themeContext';
import { DarkTheme, Header, LightTheme, TextView } from '@components/index';
import { Colors } from '@constant/index';

const Userchat: FC<any> = props => {
  const { userdata } = props.route.params;
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;
  const keyboardVerticalOffset = useKeyboardVerticalOffset();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello 👋',
        createdAt: new Date(),
        user: { _id: 2, name: 'System' },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages: any[] = []) => {
    setMessages(prev => GiftedChat.append(prev, newMessages));
  }, []);

  // ✅ WhatsApp bubble
  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: '#25D366' },
        left: { backgroundColor: '#f0f0f0' },
      }}
      textStyle={{
        right: { color: '#fff' },
        left: { color: '#000' },
      }}
    />
  );

  // ✅ Input fix (MOST IMPORTANT)
  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={{
        borderTopWidth: 0,
        padding: 6,
        backgroundColor: '#fff',
        paddingBottom: Platform.OS === 'android' ? 8 : 20,
      }}
    />
  );

  // ✅ Send button
  const renderSend = (props: any) => (
    <Send {...props}>
      <View
        style={{
          backgroundColor: '#25D366',
          borderRadius: 20,
          padding: 10,
          marginRight: 8,
          marginBottom: 5,
        }}
      >
        <TextView style={{ color: '#fff' }}>➤</TextView>
      </View>
    </Send>
  );

  // ✅ Actions (attach/camera/emoji)
  const renderActions = () => (
    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
      <TouchableOpacity>
        <TextView>📎</TextView>
      </TouchableOpacity>

      <TouchableOpacity style={{ marginLeft: 10 }}>
        <TextView>📷</TextView>
      </TouchableOpacity>

      <TouchableOpacity style={{ marginLeft: 10 }}>
        <TextView>😊</TextView>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          theme === 'dark' ? currentTheme?.background : Colors.PRIMARY[800],
      }}
    >
      <Header
        showheader
        title={`Chat with ${userdata?.name || 'User'}`}
        showicons={false}
      />

      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: 1 }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
        renderActions={renderActions}
        isCustomViewBottom
        isAlignedTop
        isAvatarOnTop
        messagesContainerStyle={{
          backgroundColor:
            theme === 'dark' ? currentTheme?.background : Colors.PRIMARY[800],
        }}
        textInputProps={{
          style: { color: theme === 'dark' ? currentTheme?.text : '#000' },
          onChangeText: setText,
        }}
        // alwaysShowSend
        // keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default Userchat;
