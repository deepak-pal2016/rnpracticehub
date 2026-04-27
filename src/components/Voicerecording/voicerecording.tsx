import React, { FC, useEffect, useState, useRef } from 'react';
import { TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import AudioRecord from 'react-native-audio-record';
import { Icon } from '@constant/index';

type voiceRecordProps = {
  onSend: (filepath: string) => void;
};

const Voicerecorder: FC<voiceRecordProps> = ({ onSend }) => {
  const [recording, setRecording] = useState<boolean>(false);
  const isReady = useRef(false);

  useEffect(() => {
    const init = async () => {
      AudioRecord.init({
        sampleRate: 16000,
        channels: 1,
        bitsPerSample: 16,
        wavFile: 'voice.wav',
      });

      isReady.current = true;
    };

    init();
  }, []);

  const requestpermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
    }
  };

  const startrecording = async () => {
    try {
      if (!isReady.current) {
        console.log('AudioRecord not ready');
        return;
      }

      await requestpermission();

      AudioRecord.start();
      setRecording(true);
    } catch (error) {
      console.log('start error:', error);
    }
  };

  const stoprecording = async () => {
    try {
      const filepath = await AudioRecord.stop();
      setRecording(false);

      console.log('record file', filepath);

      onSend(filepath);
    } catch (err) {
      console.log('stop error:', err);
    }
  };

  return (
    <TouchableOpacity
      onPressIn={startrecording}
      onPressOut={stoprecording}
      style={{ padding: 10 }}
    >
      <Icon
        name={recording ? 'mic' : 'mic-outline'}
        size={26}
        family="Ionicons"
        color={recording ? 'red' : 'black'}
      />
    </TouchableOpacity>
  );
};

export default Voicerecorder;