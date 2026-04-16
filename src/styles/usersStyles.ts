/* eslint-disable @typescript-eslint/no-unused-vars */
import { StyleSheet } from 'react-native';
import { cardShadow, Colors, Typography } from '@constant/index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '@constant/dimentions';

const styles =(theme:any) => StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: "#fff",
  },

   card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
    left:hp(1)
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  message: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },

  rightSection: {
    alignItems: "flex-end",
  },

  time: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 6,
  },
})

export default styles