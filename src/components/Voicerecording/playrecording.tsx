import React, { useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Sound from 'react-native-sound';

const AudioPlayer = ({ url }: { url: string }) => {
  const [sound, setSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    if (sound) {
      sound.stop(() => {
        sound.release();
        setSound(null);
        setIsPlaying(false);
      });
      return;
    }

    const audio = new Sound(url, null, (error:any) => {
      if (error) {
        console.log('play error', error);
        return;
      }

      audio.play(() => {
        audio.release();
        setSound(null);
        setIsPlaying(false);
      });
    });

    setSound(audio);
    setIsPlaying(true);
  };

  return (
    <TouchableOpacity onPress={playAudio}>
      <Text>{isPlaying ? '⏸ Pause' : '▶️ Play Audio'}</Text>
    </TouchableOpacity>
  );
};

export default AudioPlayer;