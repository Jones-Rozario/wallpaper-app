import { Alert, Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  ArrowDownTrayIcon,
  ShareIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import Toast from "react-native-toast-message";

const image = () => {
  const image = useLocalSearchParams();
  const fileName = image?.previewURL.split("/").pop();
  const filePath = `${FileSystem.documentDirectory}${fileName}`;

  const getSize = () => {
    const aspectRatio = image?.imageWidth / image?.imageHeigth;

    let calculatedHeight = hp(50);
    let calculatedWidth = wp(92);

    if (aspectRatio < 1) {
      calculatedWidth = wp(70);
    }

    return {
      height: calculatedHeight,
      width: calculatedWidth,
    };
  };

  //   console.log(image);

  const handleDownload = async () => {
    const uri = await downloadImage();
    if (uri) {
      showToast("Image Downloaded Successfully !");
    }
  };

  const handleSharing = async () => {
    console.log("sharing image");
    const uri = await downloadImage();

    if (uri) await Sharing.shareAsync(uri);
  };

  const downloadImage = async () => {
    try {
      const { uri } = await FileSystem.downloadAsync(
        image?.webformatURL,
        filePath
      );
      return uri;
    } catch (e) {
      console.log(e.message);
      Alert.alert("Download Error", e.message);
    }
  };

  const showToast = (message) => {
    Toast.show({
      type: 'success',
      text1: message,
      position: "bottom",
    });
  };

  const toastConfig = {
    success: ({ text1, props, ...rest }) => (
      <View
        style={{
          padding: hp(1),
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderColor: "rgba(255, 255, 255, 0.35)",
          borderWidth: 1,
          borderRadius: 16
        }}
      >
        <Text style={{ fontSize: hp(1), fontWeight: "600", color: 'white' }}>{text1}</Text>
      </View>
    ),
  };

  return (
    <BlurView
      style={styles.container}
      tint="dark"
      blurReductionFactor={0.3}
      intensity={120}
    >
      <Image
        source={{ uri: image?.webformatURL }}
        style={[styles.imageView, getSize()]}
      />

      <View style={{ flexDirection: "row", gap: hp(2.6), marginTop: hp(2.6) }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.button}>
          <XMarkIcon size={hp(5)} color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDownload} style={styles.button}>
          <ArrowDownTrayIcon size={hp(5)} color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSharing} style={styles.button}>
          <ShareIcon size={hp(5)} color={"white"} />
        </TouchableOpacity>
      </View>
      <Toast config={toastConfig} />
    </BlurView>
  );
};

export default image;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageView: {
    borderRadius: 17,
    objectFit: "cover",
  },
  button: {
    padding: hp(1.2),
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderCurve: "continuous",
    borderRadius: 13,
  },
});
