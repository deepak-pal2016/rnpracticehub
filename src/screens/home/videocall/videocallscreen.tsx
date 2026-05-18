/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect, useState } from 'react';
import { View } from 'react-native';
import {
  RTCView,
  mediaDevices,
  MediaStream,
} from 'react-native-webrtc';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackProps } from 'src/@types';

type VideocallNavigationType = NativeStackNavigationProp<
  HomeStackProps,
  'VideoCallScreen'
>;

const VideoCallScreen:FC = () => {
  const [localStream, setLocalStream] =
    useState<MediaStream | null>(null);

  useEffect(() => {
    startCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      setLocalStream(stream);
    } catch (error) {
      console.log('Camera Error', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {localStream && (
        <RTCView
          streamURL={localStream.toURL()}
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
};

export default VideoCallScreen;