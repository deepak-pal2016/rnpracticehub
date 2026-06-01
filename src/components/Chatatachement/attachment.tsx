/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { TextView } from '@components/index';
import { Colors, Icon } from '@constant/index';

interface AttachmentProos {
  visible?: boolean;
  onClose?: () => void;
  onGallery: () => void;
  onCamera: () => void;
  onDocument: () => void;
  onLocation: () => void;
  onContact: () => void;
  icon: string;
  title: string;
  color: string;
  onPress: () => void;
  family: any;
}

const Attachment: FC<AttachmentProos> = ({
  visible,
  onClose,
  onGallery,
  onCamera,
  onDocument,
  onLocation,
  onContact,
  family,
}) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={styles.dragBar} />
        <Text style={styles.title}>Share Attachment</Text>

        <View style={styles.row}>
          <AttachmentItem
            icon="camera"
            family={'MaterialCommunityIcons'}
            title="Camera"
            color="#ff6b6b"
            onPress={onCamera}
          />

          <AttachmentItem
            icon="image"
            family={'MaterialCommunityIcons'}
            title="Gallery"
            color="#4caf50"
            onPress={onGallery}
          />

          <AttachmentItem
            icon="file-document"
            title="Document"
            family={'MaterialCommunityIcons'}
            color="#2196f3"
            onPress={onDocument}
          />
        </View>

        <View style={styles.row}>
          <AttachmentItem
            icon="map-marker"
            title="Location"
            family={'MaterialCommunityIcons'}
            color="#ff9800"
            onPress={onLocation}
          />

          <AttachmentItem
             icon="account"
            title="Contact"
            family={'MaterialCommunityIcons'}
            color="#9c27b0"
            onPress={onContact}
          />
        </View>
      </View>
    </Modal>
  );
};

const AttachmentItem: FC<AttachmentProos> = ({
  icon,
  title,
  color,
  onPress,
  family,
}) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Icon
          name={icon}
          family={family}
          size={28}
          color={Colors.SECONDARY[200]}
        />
      </View>

      <TextView style={styles.itemText}>{title}</TextView>
    </TouchableOpacity>
  );
};

export default Attachment;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 35,
  },
  dragBar: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 25,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  item: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
  },
});
