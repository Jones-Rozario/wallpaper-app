import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from "./ImageCard";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function ImageGrid({ images, router }) {
  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images}
        numColumns={2}
        initialNumToRender={1000}
        renderItem={({ item, index }) => (
          <ImageCard router={router} image={item} index={index} />
        )}
        estimatedItemSize={200}
      />
        
    </View>
  );
}

const styles = StyleSheet.create({
  listContainerStyle: {
    paddingHorizontal: hp(0.9),
    height: hp(5),
    width: wp(10),
  },
  container: {
    minHeight: 3,
    width: wp(100),
    marginVertical: hp(1),
    paddingHorizontal: hp(0.7),
  },
});
