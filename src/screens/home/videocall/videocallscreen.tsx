/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import {
  RTCView,
  mediaDevices,
  MediaStream,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc';
import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Socket from '@services/socket/socket';
import { Icon } from '@constant/index';

const VideoCallScreen: FC =
  () => {
    const navigation =
      useNavigation();

    const route: any =
      useRoute();

    const [
      localStream,
      setLocalStream,
    ] =
      useState<MediaStream | null>(
        null,
      );

    const [
      remoteStream,
      setRemoteStream,
    ] =
      useState<MediaStream | null>(
        null,
      );

    const peerconnection: any =
      useRef(
        new RTCPeerConnection({
          iceServers: [
            {
              urls:
                'stun:stun.l.google.com:19302',
            },
          ],
        }),
      ).current;

    useEffect(() => {
      initCall();

      // ICE SEND
      peerconnection.onicecandidate =
        (
          event: any,
        ) => {
          if (
            event?.candidate
          ) {
            Socket.emit(
              'ice_candidate',
              {
                candidate:
                  event.candidate,
                receiverId:
                  route?.params
                    ?.receiverId,
              },
            );

            console.log(
              'ICE Sent',
            );
          }
        };

      // REMOTE STREAM
      peerconnection.ontrack =
        (
          event: any,
        ) => {
          console.log(
            'Remote Stream Connected',
          );

          if (
            event?.streams?.[0]
          ) {
            setRemoteStream(
              event.streams[0],
            );
          }
        };

      // OFFER RECEIVE
      Socket.on(
        'offer',
        async data => {
          try {
            console.log(
              'Offer Received',
            );

            await peerconnection.setRemoteDescription(
              new RTCSessionDescription(
                data.offer,
              ),
            );

            const answer =
              await peerconnection.createAnswer();

            await peerconnection.setLocalDescription(
              answer,
            );

            Socket.emit(
              'answer',
              {
                answer,
                receiverId:
                  data.callerId,
              },
            );

            console.log(
              'Answer Sent',
            );
          } catch (error) {
            console.log(
              'Offer Error',
              error,
            );
          }
        },
      );

      // ANSWER RECEIVE
      Socket.on(
        'answer',
        async data => {
          try {
            console.log(
              'Answer Received',
            );

            await peerconnection.setRemoteDescription(
              new RTCSessionDescription(
                data.answer,
              ),
            );
          } catch (error) {
            console.log(
              'Answer Error',
              error,
            );
          }
        },
      );

      // ICE RECEIVE
      Socket.on(
        'ice_candidate',
        async data => {
          try {
            if (
              data?.candidate
            ) {
              await peerconnection.addIceCandidate(
                data.candidate,
              );

              console.log(
                'ICE Received',
              );
            }
          } catch (error) {
            console.log(
              'ICE Error',
              error,
            );
          }
        },
      );

      return () => {
        localStream
          ?.getTracks()
          .forEach(track =>
            track.stop(),
          );

        peerconnection.close();

        Socket.off(
          'offer',
        );
        Socket.off(
          'answer',
        );
        Socket.off(
          'ice_candidate',
        );
      };
    }, []);

    const initCall =
      async () => {
        await startCamera();

        if (
          route?.params
            ?.isCaller
        ) {
          createOffer();
        }
      };

    const startCamera =
      async () => {
        try {
          const stream =
            await mediaDevices.getUserMedia(
              {
                audio: true,
                video: true,
              },
            );

          stream
            .getTracks()
            .forEach(
              (
                track,
              ) => {
                peerconnection.addTrack(
                  track,
                  stream,
                );
              },
            );

          setLocalStream(
            stream,
          );
        } catch (error) {
          console.log(
            'Camera Error',
            error,
          );
        }
      };

    const createOffer =
      async () => {
        try {
          const offer =
            await peerconnection.createOffer();

          await peerconnection.setLocalDescription(
            offer,
          );

          Socket.emit(
            'offer',
            {
              offer,
              receiverId:
                route
                  ?.params
                  ?.receiverId,
              callerId:
                route
                  ?.params
                  ?.callerId,
            },
          );

          console.log(
            'Offer Sent',
          );
        } catch (error) {
          console.log(
            'Offer Error',
            error,
          );
        }
      };

    const endCall = () => {
      localStream
        ?.getTracks()
        .forEach(track =>
          track.stop(),
        );

      remoteStream
        ?.getTracks()
        .forEach(track =>
          track.stop(),
        );

      peerconnection.close();

      navigation.goBack();
    };

    return (
      <View
        style={{
          flex: 1,
          backgroundColor:
            '#000',
        }}
      >
        {/* Remote Video */}
        {remoteStream && (
          <RTCView
            streamURL={remoteStream.toURL()}
            style={{
              flex: 1,
            }}
            objectFit="cover"
            zOrder={0}
          />
        )}

        {/* Local Video */}
        {localStream && (
          <RTCView
            streamURL={localStream.toURL()}
            style={{
              width: 120,
              height: 180,
              position:
                'absolute',
              top: 50,
              right: 20,
              borderRadius: 10,
            }}
            objectFit="cover"
            mirror={true}
            zOrder={1}
          />
        )}

        {/* End Call Button */}
        <TouchableOpacity
          onPress={
            endCall
          }
          style={{
            position:
              'absolute',
            bottom: 50,
            alignSelf:
              'center',
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor:
              'red',
            justifyContent:
              'center',
            alignItems:
              'center',
          }}
        >
          <Icon
            family="Ionicons"
            name="call"
            size={30}
            color="#fff"
            style={{
              transform: [
                {
                  rotate:
                    '135deg',
                },
              ],
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

export default VideoCallScreen;