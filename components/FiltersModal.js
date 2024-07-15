import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useRef } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { filtersData } from "../assets/data/filters";
import FilterView from "./FilterView";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { capitalize } from "lodash";

const FiltersModal = ({ bottomSheetModalRef, filters, setFilters, applyFilter, resetFilter }) => {
  
  const BackDrop = (animatedIndex, style) => {
    const dropStyle = [
      style,
      StyleSheet.absoluteFill,
      { backgroundColor: "rgba(0,0,0,0.5)" },
    ];

    return (
      <View style={dropStyle}>
        <BlurView style={StyleSheet.absoluteFill} tint="dark" intensity={50} />
      </View>
    );
  };

  const snapPoints = useMemo(() => ["75%"], []);

  const sections = {
    order: (props) => <Section {...props} />,
    orientation: (props) => <Section {...props} />,
    type: (props) => <Section {...props} />,
    colors: (props) => <ColorSection {...props} />,
  };

  const Section = ({ sectionName,content, filters, setFilters }) => {
    
    const setFilter = (item, sectionName) => {
      setFilters({...filters, [sectionName]: item})
    }

    return (
      <View style={styles.filterWrapper}>
        {content?.map((item) =>{
          const isActive = filters && filters[sectionName] == item;
          const backgroundColor = isActive ? {backgroundColor: 'black'} : {backgroundColor: 'white'}
          const color = isActive ? {color: 'white'} : {color: 'black'};
           return (
          <Pressable onPress={() => setFilter(item, sectionName)} key={item} style={[styles.filterButton,backgroundColor ]}>
            <Text style={{ fontSize: hp(1.3), ...color }}>
              {capitalize(item)}
            </Text>
          </Pressable>
        )})}
      </View>
    );
  };

  const ColorSection = ({sectionName, content, filters, setFilters }) => {
    
    const setFilter = (color, sectionName) => {
      setFilters({...filters, [sectionName]: color})
    }

    return (
      <View style={styles.colorWrapper}>
        {content.map((color) => {
          const isActive = filters && filters[sectionName] == color;
          const borderColor = isActive ? {borderColor: 'black'} : {borderColor: 'lightgrey'}
          return (
          <Pressable onPress={() => setFilter(color, sectionName)} key={color}>
            <View
              style={{
                backgroundColor: color,
                height: hp(3.1),
                width: hp(4.5),
                borderWidth: 2,
                borderRadius: 7,
                ...borderColor
              }}
            ></View>
          </Pressable>
        )})}
      </View>
    );
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={BackDrop}
    >
      <BottomSheetView style={styles.filterContainer}>
        <Text style={styles.filterHeader}>Filters</Text>
        <View>
          {Object.keys(filtersData).map((sectionName) => {
            let sectionView = sections[sectionName];
            let content = filtersData[sectionName];

            return (
              <FilterView
                key={sectionName}
                title={sectionName}
                sectionView={sectionView({
                  sectionName,
                  content,
                  filters,
                  setFilters,
                })}
              />
            );
          })}

          <View
            style={{ flexDirection: "row", gap: hp(1.8), marginTop: hp(1.7) }}
          >
            <TouchableOpacity onPress={resetFilter} style={styles.arButton}>
              <Text style={{ textAlign: "center", fontSize: hp(1.8) }}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => applyFilter(filters)} style={[styles.arButton, {backgroundColor: "black"}]}>
              <Text style={{ textAlign: "center", color: "white", fontSize: hp(1.8) }}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default FiltersModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  arButton: {
    width: hp(17),
    padding: hp(1.4),
    backgroundColor: "rgba(230, 250, 250, 0.5)",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1
  },
  filterContainer: {
    flex: 1,
    paddingHorizontal: heightPercentageToDP(1),
  },
  filterHeader: {
    fontSize: heightPercentageToDP(2.8),
    fontWeight: "700",
  },
  filterButton: {
    padding: hp(0.8),
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 16,
  },
  filterWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    gap: hp(1),
    alignItems: "center",
  },
  colorWrapper: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: hp(2.2),
    paddingHorizontal: hp(1),
  },
});
