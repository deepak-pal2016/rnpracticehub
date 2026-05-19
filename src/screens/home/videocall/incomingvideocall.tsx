/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, { FC } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HomeStackProps } from 'src/@types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Socket from '@services/socket/socket';

type IncomingCallScreenNavigationType = NativeStackNavigationProp<
  HomeStackProps,
  'IncomingCallScreen'
>;

const IncomingCallScreen: FC = () => {
  const navigation: any = useNavigation();
  const route: any = useRoute();

  const callerName = route?.params?.callerName || 'Unknown';

  const callerId = route?.params?.callerId;

  const acceptCall = () => {
    Socket.emit('call_accepted', {
      callerId: route?.params?.callerId,
    });

    navigation.replace('VideoCallScreen', {
      isCaller: false,
      callerId: route?.params?.callerId,
      receiverId: route?.params?.receiverId,
      callerName: route?.params?.callerName,
    });
  };

  const rejectCall = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200',
      }}
      style={{
        flex: 1,
      }}
      blurRadius={10}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'space-between',
          paddingVertical: 80,
          alignItems: 'center',
        }}
      >
        {/* Top */}
        <View
          style={{
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
            }}
          >
            Incoming Video Call
          </Text>

          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: '#ffffff30',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 30,
            }}
          >
            <Icon name="account" size={70} color="#fff" />
          </View>

          <Text
            style={{
              color: '#fff',
              fontSize: 28,
              fontWeight: '700',
              marginTop: 20,
            }}
          >
            {callerName}
          </Text>

          <Text
            style={{
              color: '#ddd',
              marginTop: 10,
            }}
          >
            Video Calling...
          </Text>
        </View>

        {/* Bottom Buttons */}
        <View
          style={{
            flexDirection: 'row',
            width: '70%',
            justifyContent: 'space-between',
          }}
        >
          {/* Reject */}
          <TouchableOpacity
            onPress={rejectCall}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: 'red',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon name="phone-hangup" size={35} color="#fff" />
          </TouchableOpacity>

          {/* Accept */}
          <TouchableOpacity
            onPress={acceptCall}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: 'green',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon name="video" size={35} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default IncomingCallScreen;
