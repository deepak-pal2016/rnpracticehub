/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import InCallManager from 'react-native-incall-manager';
import { TextView } from '@components/index';
import Socket from '@services/socket/socket';
import React, { FC, useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import {
  mediaDevices,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc';
import { HomeStackProps } from 'src/@types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type AudiocallscreenNavigationType = NativeStackNavigationProp<
  HomeStackProps,
  'Audiocall'
>;

const Audiocall: FC<any> = ({ route }) => {
  const navigation = useNavigation<AudiocallscreenNavigationType>();
  const callData = route?.params || {};
  const [localStream, setLocalStream] = useState<any>(null);
  const isCaller = callData?.isCaller;
  const incomingCall = callData?.incomingCall;
  const [callstatus, setCallStatus] = useState<any>('Calling...');
  const [callTime, setCallTime] = useState<any>(0);
  const timerRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const startCalltimer = () => {
    timerRef.current = setInterval(() => {
      setCallTime((prev: any) => prev + 1);
    }, 1000);
  };

  useEffect(() => {
    if (!isCaller && incomingCall && !isConnected) {
      InCallManager.startRingtone();
    }

    return () => {
      InCallManager.stopRingtone();
    };
  }, [isCaller, incomingCall, isConnected]);
  const peerconnection: any = useRef(
    new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    }),
  ).current;

  useEffect(() => {
    Socket.on('audio_offer_received', async data => {
      try {
        await peerconnection.setRemoteDescription(
          new RTCSessionDescription(data?.offer),
        );

        const answer = await peerconnection.createAnswer();
        await peerconnection.setLocalDescription(answer);
        Socket.emit('audio_answer', {
          answer,
          callerId: data.callerId,
        });
        setIsConnected(true);
        setCallStatus('Connected');
        startCalltimer();
        console.log('answer created...');
      } catch (error: any) {
        console.log(error);
      }
    });

    return () => {
      Socket.off('audio_offer_received');
    };
  }, []);

  useEffect(() => {
    const handleAudioAnswer = async (data: any) => {
      try {
        console.log('audio_answer_received', data);
        await peerconnection.setRemoteDescription(
          new RTCSessionDescription(data?.answer),
        );

        setIsConnected(true);
        setCallStatus('Connected');
        startCalltimer();
        console.log('call connected');
      } catch (error) {
        console.log(error, 'connected call');
      }
    };

    Socket.on('audio_answer_received', handleAudioAnswer);

    return () => {
      Socket.off('audio_answer_received', handleAudioAnswer);
    };
  }, []);

  useEffect(() => {
    peerconnection.onicecandidate = (event: any) => {
      if (event?.candidate) {
        Socket.emit('audio_ice_candidate', {
          candidate: event?.candidate,
          receiverId: route?.params?.receiverId,
        });
      }
    };

    const handleIceCandidate = async (data: any) => {
      try {
        await peerconnection.addIceCandidate(data?.candidate);
      } catch (error: any) {
        console.log(error);
      }
    };

    Socket.on('audio_ice_candidate', handleIceCandidate);
    return () => {
      Socket.off('audio_ice_candidate', handleIceCandidate);
    };
  }, []);

  const createOffer = async () => {
    try {
      const offer = await peerconnection.createOffer();
      await peerconnection.setLocalDescription(offer);
      Socket.emit('audio_offer', {
        offer,
        receiverId: callData?.receiverId,
        callerId: callData?.callerId,
      });

      console.log('Offer created');
    } catch (error) {
      console.log('Offer error', error);
    }
  };

  const startAudioStream = async (createRtcOffer = false) => {
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      setLocalStream(stream);

      stream.getTracks().forEach(track => {
        peerconnection.addTrack(track, stream);
      });

      if (createRtcOffer) {
        createOffer();
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(isCaller, 'isCaller');
  useEffect(() => {
    if (isCaller) {
      startAudioStream(true);
    }
  }, []);

  const acceptAudioCall = async () => {
    await startAudioStream(false);
    InCallManager.start({ media: 'audio' });
    InCallManager.stopRingtone();

    Socket.emit('accept_audio_call', {
      callerId: callData?.callerId,
    });

    console.log('Call Accepted');
  };

  const rejectAudioCall = () => {
    InCallManager.stopRingtone();
    Socket.emit('reject_audio_call', {
      callerId: callData?.callerId,
    });
    navigation.goBack();
  };

  const endcall = () => {
    clearInterval(timerRef.current);
    peerconnection.close();
    localStream?.getTracks()?.forEach((track: any) => {
      track.stop();
    });
    InCallManager.stopRingtone();
    InCallManager.stop();
    setLocalStream(null);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{
            uri: callData?.profile || 'https://i.pravatar.cc/300',
          }}
          style={styles.avatar}
        />

        <TextView style={styles.name}>
          {isCaller ? callData?.receiverName : callData?.callerName}
        </TextView>

        <TextView style={styles.callingText}>
          {callstatus === 'Connected'
            ? `${Math.floor(callTime / 60)
                .toString()
                .padStart(2, '0')}:${(callTime % 60)
                .toString()
                .padStart(2, '0')}`
            : isCaller
            ? 'Calling...'
            : 'Incoming Call...'}
        </TextView>

        {/* Receiver Side */}
        {!isCaller && incomingCall && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.rejectBtn]}
              onPress={rejectAudioCall}
            >
              <Text style={styles.btnText}>Decline</Text>
            </TouchableOpacity>

            {!isConnected && (
              <TouchableOpacity
                style={[styles.button, styles.acceptBtn]}
                onPress={acceptAudioCall}
              >
                <TextView style={styles.btnText}>Accept</TextView>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Caller Side */}
        {isCaller && (
          <TouchableOpacity
            style={[styles.button, styles.rejectBtn, { marginTop: 40 }]}
            onPress={() => endcall()}
          >
            <TextView style={styles.btnText}>End Call</TextView>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Audiocall;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 24,
    paddingVertical: 40,
    alignItems: 'center',
    elevation: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
  },
  callingText: {
    color: '#CBD5E1',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 30,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectBtn: {
    backgroundColor: '#EF4444',
  },
  acceptBtn: {
    backgroundColor: '#22C55E',
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
