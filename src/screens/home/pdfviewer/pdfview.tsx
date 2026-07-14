/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import Pdf from 'react-native-pdf';
import { HomeStackProps } from 'src/@types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '@components/index';

type PdfviewscreenNavigationType = NativeStackNavigationProp<
  HomeStackProps,
  'Pdfviewer'
>;

const Pdfviewer: any = ({ route }: any) => {
  const { mediaUrl } = route.params?.data;
  console.log(mediaUrl, '===');

  return (
    <View style={{ flex: 1 }}>
      <Header showheader={true} showicons={false} title="View Document" receiverid={undefined} />
      <Pdf
        source={{ uri: mediaUrl }}
        style={{ flex: 1 }}
        trustAllCerts={false}
        onLoadComplete={pages => {
          console.log('Pages:', pages);
        }}
        onError={error => {
          console.log('PDF Error:', error);
        }}
      />
    </View>
  );
};

export default Pdfviewer;
