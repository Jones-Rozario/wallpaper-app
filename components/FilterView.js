import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { capitalize } from "lodash";

const FilterView = ({ title, sectionView }) => {
  return (
    <View style={styles.filterWrapper}>
      <Text style={styles.filterHeader}>{capitalize(title)}</Text>
      <View>{sectionView}</View>
    </View>
  );
};

export default FilterView;

const styles = StyleSheet.create({
  filterWrapper: {
    display: 'flex',
    gap: hp(1.4),
    marginVertical: hp(0.7)
  },
  filterHeader: {
    fontSize: hp(1.6),
    fontWeight: "semibold"
  }
});
