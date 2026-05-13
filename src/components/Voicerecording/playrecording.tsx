import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import TextView from '@components/TextView/textView';
import { Icon, Colors } from '@constant/index';
import Sound from 'react-native-sound';


let currentSound: Sound | null = null;
let currentUrl: string | null = null;

const AudioPlayer = ({ url }: { url: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    // 👉 Same audio pe click = stop
    if (currentUrl === url && currentSound) {
      currentSound.stop(() => {
        currentSound?.release();
        currentSound = null;
        currentUrl = null;
        setIsPlaying(false);
      });
      return;
    }

    
    if (currentSound) {
      currentSound.stop(() => {
        currentSound?.release();
        currentSound = null;
      });
    }

    const audio = new Sound(url, null, (error: any) => {
      if (error) {
        console.log('play error', error);
        return;
      }

      audio.play(() => {
        audio.release();
        currentSound = null;
        currentUrl = null;
        setIsPlaying(false);
      });
    });

    currentSound = audio;
    currentUrl = url;
    setIsPlaying(true);
  };

  const isCurrentPlaying = currentUrl === url && isPlaying;

  return (
    <TouchableOpacity onPress={playAudio}>
      <View style={{ flexDirection: 'row', alignItems: 'center',  }}>
        <Icon
          name={isCurrentPlaying ? 'pause' : 'play'}
          family="Ionicons"
          size={20}
          color={Colors.SECONDARY[100]}
        />
        {/* <TextView>
          {isCurrentPlaying ? 'Pause' : 'Play'}
        </TextView> */}
      </View>
    </TouchableOpacity>
  );
};

export default AudioPlayer;