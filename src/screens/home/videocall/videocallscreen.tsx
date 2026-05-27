/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  RTCView,
  mediaDevices,
  MediaStream,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc';

import { useNavigation, useRoute } from '@react-navigation/native';
import Socket from '@services/socket/socket';
import { Colors, Icon, Typography } from '@constant/index';
import { DarkTheme, LightTheme, TextView } from '@components/index';
import { ThemeContext } from './../../../context/themeContext';
import videoStyles from '@styles/videoStyles';
import { HomeStackProps } from 'src/@types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type VideoCallScreenNavigationType = NativeStackNavigationProp<
  HomeStackProps,
  'VideoCallScreen'
>;

const VideoCallScreen: FC = () => {
  const navigation = useNavigation<VideoCallScreenNavigationType>();
  const route: any = useRoute();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;
  const styles = videoStyles(currentTheme);

  const peerconnection: any = useRef(
    new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    }),
  ).current;

  useEffect(() => {
    initCall();

    peerconnection.onicecandidate = (event: any) => {
      if (event?.candidate) {
        Socket.emit('ice_candidate', {
          candidate: event.candidate,
          receiverId: route?.params?.receiverId,
        });
      }
    };

    peerconnection.ontrack = (event: any) => {
      console.log('ONTRACK FIRED');

      setRemoteStream(prevStream => {
        let stream = prevStream;

        if (!stream) {
          stream = new MediaStream();
        }
        event.track && stream.addTrack(event.track);

        return stream;
      });
    };

    // CALL ACCEPTED
    Socket.on('call_accepted', () => {
      if (route?.params?.isCaller) {
        createOffer();
      }
    });

    // OFFER
    Socket.on('offer', async data => {
      try {
        await peerconnection.setRemoteDescription(
          new RTCSessionDescription(data.offer),
        );

        const answer = await peerconnection.createAnswer();
        await peerconnection.setLocalDescription(answer);

        Socket.emit('answer', {
          answer,
          receiverId: data.callerId,
        });
      } catch (e) {
        console.log('Offer Error', e);
      }
    });

    // ANSWER
    Socket.on('answer', async data => {
      try {
        await peerconnection.setRemoteDescription(
          new RTCSessionDescription(data.answer),
        );
      } catch (e) {
        console.log('Answer Error', e);
      }
    });

    // ICE
    Socket.on('ice_candidate', async data => {
      try {
        if (peerconnection.remoteDescription) {
          await peerconnection.addIceCandidate(data.candidate);
        }
      } catch (e) {
        console.log('ICE Error', e);
      }
    });

    return () => {
      localStream?.getTracks().forEach(t => t.stop());
      peerconnection.close();

      Socket.off('call_accepted');
      Socket.off('offer');
      Socket.off('answer');
      Socket.off('ice_candidate');
    };
  }, []);

  // ---------------- CAMERA ----------------
  const initCall = async () => {
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: {
          facingMode: 'user',
          width: 640,
          height: 480,
        },
      });

      stream.getTracks().forEach(track => {
        track.enabled = true;   
        peerconnection.addTrack(track, stream);
      });

      setLocalStream(stream);
    } catch (error) {
      console.log('Camera Error', error);
    }
  };

  const createOffer = async () => {
    try {
      const offer = await peerconnection.createOffer();
      await peerconnection.setLocalDescription(offer);

      Socket.emit('offer', {
        offer,
        receiverId: route?.params?.receiverId,
        callerId: route?.params?.callerId,
        callerName: route?.params?.callerName,
      });
    } catch (e) {
      console.log('Offer Error', e);
    }
  };

  // ---------------- END CALL ----------------
  const endCall = () => {
    localStream?.getTracks().forEach(t => t.stop());
    remoteStream?.getTracks().forEach(t => t.stop());
    peerconnection.close();
    navigation.goBack();
  };

  const displayName = route?.params?.isCaller
    ? route?.params?.receiverName
    : route?.params?.callerName;

  const switchCamera = () => {
    const track = localStream?.getVideoTracks?.()[0] as any;
    if (track) track._switchCamera();
  };

  // ---------------- UI ----------------
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <View
        style={{
          position: 'absolute',
          top: 60,
          alignSelf: 'center',
          zIndex: 99,
        }}
      >
        <TextView
          style={{ color: Colors.SECONDARY[100], ...Typography.BodyRegular13 }}
        >
          {displayName}
        </TextView>

        <TextView style={styles.remotetextview}>
          {remoteStream ? 'Connected' : 'Calling...'}
        </TextView>
      </View>

      {remoteStream && (
        <RTCView
          key={remoteStream.toURL()}
          streamURL={remoteStream.toURL()}
          style={{ flex: 1, backgroundColor: '#000' }}
          objectFit="cover"
        />
      )}

      {localStream && (
        <RTCView
          streamURL={localStream?.toURL()}
          style={{
            position: 'absolute',
            width: 120,
            height: 180,
            right: 20,
            top: 80,
            borderRadius: 12,
            overflow: 'hidden',
            backgroundColor: '#000',
          }}
          objectFit="cover"
          mirror={true}
        />
      )}

      <View style={styles.multiviewbtn}>
        <TouchableOpacity
          style={[
            styles.endcallbtn,
            { backgroundColor: Colors.FLOATINGINPUT[100] },
          ]}
        >
          <Icon
            family="Ionicons"
            name="volume-mute"
            size={30}
            color={Colors.SECONDARY[100]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={switchCamera}
          style={[
            styles.endcallbtn,
            { backgroundColor: Colors.FLOATINGINPUT[100] },
          ]}
        >
          <Icon
            family="Ionicons"
            name="camera-reverse"
            size={30}
            color={Colors.SECONDARY[100]}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={endCall} style={styles.endcallbtn}>
          <Icon
            family="Ionicons"
            name="call"
            size={30}
            color={Colors.SECONDARY[100]}
            style={{ transform: [{ rotate: '135deg' }] }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VideoCallScreen;
