import React, { FC, useEffect, useState, useRef } from 'react';
import { TouchableOpacity, PermissionsAndroid, View } from 'react-native';
import AudioRecord from 'react-native-audio-record';
import { Icon } from '@constant/index';

type voiceRecordProps = {
  onSend: (filepath: string) => void;
};

const Voicerecorder: FC<voiceRecordProps> = ({ onSend }) => {
  const [recording, setRecording] = useState<boolean>(false);
  const isReady = useRef(false);
  const isRecordingRef = useRef(false);

  useEffect(() => {
    AudioRecord.init({
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      audioSource: 6, // 🔥 better for voice
      wavFile: 'voice.wav',
    });

    isReady.current = true;

    return () => {
      AudioRecord.stop();
    };
  }, []);

  const requestpermission = async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);

    return (
      granted['android.permission.RECORD_AUDIO'] === 'granted'
    );
  };

  const startrecording = async () => {
    try {
      if (!isReady.current || isRecordingRef.current) return;

      const hasPermission = await requestpermission();
      if (!hasPermission) {
        console.log('Mic permission denied');
        return;
      }

      await AudioRecord.start();

      isRecordingRef.current = true;
      setRecording(true);

      AudioRecord.on('data', data => {
        // console.log('mic working...');
        console.log(data,'deepk');
        
      });

    } catch (error) {
      console.log('start error:', error);
    }
  };

  const stoprecording = async () => {
    try {
      if (!isRecordingRef.current) return;
      const filepath = await AudioRecord.stop();
      isRecordingRef.current = false;
      setRecording(false);

      if (filepath) {
     //   console.log('record file:', filepath);
        onSend(filepath);
      }
    } catch (err) {
      console.log('stop error:', err);
    }
  };

  return (
    <TouchableOpacity
      onPressIn={startrecording}
      onPressOut={() => {
        setTimeout(stoprecording, 200);
      }}
      style={{ padding: 10 }}
    >
      <View style={{right:6}}>
        <Icon
          name={recording ? 'mic' : 'mic-outline'}
          size={26}
          family="Ionicons"
          color={recording ? 'red' : 'white'}
        />
      </View>
    </TouchableOpacity>
  );
};

export default Voicerecorder;