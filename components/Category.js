import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, { FadeInLeft, FadeInRight } from "react-native-reanimated";
import { apiCall } from "../api/fetch";

export default function Category({
  index,
  category,
  isActive,
  handleChangeCategory,
}) {
  const ActiveCategoryBackground = { backgroundColor: "black" };
  const ActiveCategoryColor = { color: "white" };

  return (
    <Animated.View
      entering={FadeInRight.duration(300)
        .delay(150 * index)
        .springify()}
      style={[
        styles.container,
        isActive ? ActiveCategoryBackground : { backgroundColor: "white" },
      ]}
    >
      <TouchableOpacity
        onPress={() => handleChangeCategory(isActive? null: category)}
        style={{padding: hp(0.7)}}>
        <Text style={isActive ? ActiveCategoryColor : { color: "black" }}>
          {category}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: hp(0.5),
    borderRadius: 18,
    borderColor: "lightgrey",
    borderCurve: "continuous",
    borderWidth: 1,
  },
});
