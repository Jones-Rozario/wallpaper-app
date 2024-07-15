import {  Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";

const ImageCard = ({ image, index, router }) => {
  const marginRight =
    index % 2 == 0 ? { marginRight: hp(1.1) } : { marginRight: 0 };

  const { imageHeight: height, imageWidth: width } = image;
  // console.log(image)

  const getImageHeight = () => {
    if (height > width) {
      // portrait image
      return 300;
    } else if (height < width) {
      //landscape image
      return 200;
    } else return 250;
  };

  // console.log(image);
  return (
    <Pressable
      onPress={() => router.push({ pathname: "image", params: { ...image } })}
      style={[
        marginRight,
        ,
        {
          overflow: "hidden",
          borderRadius: 15,
          borderColor: "lightgrey",
          borderWidth: 1,
          height: getImageHeight(),
          marginBottom: hp(0.8),
        },
      ]}
    >
      <Image
        style={[styles.image, { height: getImageHeight() }]}
        source={ image?.webformatURL }
        transition={300}
      />
    </Pressable>
  );
};

export default ImageCard;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    borderRadius: 15,
  },
});
