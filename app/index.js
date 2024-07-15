import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  Bars3BottomRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "react-native-heroicons/solid";
import Category from "../components/Category";
import { apiCall } from "../api/fetch";
import { Categories } from "../assets/data/categories";
import ImageGrid from "../components/ImageGrid";
import { randomFetch } from "../api/fetch";
import { debounce } from "lodash";
import FiltersModal from "../components/FiltersModal";
import { useRouter } from "expo-router";

const index = () => {
  const [categories, setCategories] = useState(Categories);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);
  const [filters, setFilters] = useState(null);
  const inputRef = useRef(null);
  const bottomSheetModalRef = useRef(null);
  const [isEndReached, setIsEndReached] = useState(false);
  const [page, setPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    randomFetchImages();
  }, []);
  //   console.log(images);

  const handleChangeCategory = (category) => {
    setPage(2)
    setActiveCategory(category);
    fetchImages({ page: 1, category });
  };

  const fetchImages = async (params = { page: 1 }, append = false) => {
    try {
      const response = await apiCall(params);
      if (response.success && response?.data?.hits) {
        if (append) setImages([...images, ...response?.data?.hits]);
        else setImages([...response?.data?.hits]);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const randomFetchImages = async () => {
    try {
      const response = await randomFetch();
      if (response.success && response?.data?.hits) {
        setImages(response?.data?.hits);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleSearch = (text) => {
    setPage(2)
    setSearch(text);
    if (text.length > 2) fetchImages({ page: 1, q: text });

    if (text == "") {
      inputRef.current.clear();
      randomFetchImages();
    }
  };

  const openFilterModal = () => {
    bottomSheetModalRef.current.present();
  };

  const closeFilterModal = () => {
    bottomSheetModalRef.current.close();
  };

  const applyFilter = (filters) => {
    if (!filters) {
      closeFilterModal();
      return;
    }
    setPage(2)
    let params = filters;

    if (search) {
      params.q = search;
    }
    if (activeCategory) {
      params.category = activeCategory;
    }

    fetchImages({ page: 1, ...params });
    closeFilterModal();
  };
  const resetFilter = () => {
    setFilters(null);
    setPage(2);
    let params = {};
    if (search) {
      params.q = search;
      fetchImages({ page: 1, ...params });
      return;
    }
    if (activeCategory) {
      params.category = activeCategory;
      fetchImages({ page: 1, ...params });
      return;
    }

    randomFetchImages();

    closeFilterModal();
  };

  const removeFilter = (title) => {
    let filterz = { ...filters };
    delete filterz[title];
    setFilters({ ...filterz });
    applyFilter(filterz);
  };

  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const verticalOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;

    if (verticalOffset >= bottomPosition - 1) {
      if (!isEndReached) {
        let params = {};
        if (filters) {
          params = { ...filters };
        }
        if (search) {
          params.q = search;
        }
        if (activeCategory) {
          params.category = activeCategory;
        }
        let nextPage = page + 1;
        setPage(nextPage);
        params.page = page;
        console.log(params);
        fetchImages({ ...params }, (append = true));
      }
    }
  };
  console.log(page);

  // console.log(isEndReached);

  const handleTextChange = useCallback(debounce(handleSearch, 600), []);

  return (
    <View>
      <StatusBar style={"dark"} />
      <SafeAreaView style={styles.header}>
        <Text style={styles.headerText}>Pixel</Text>
        <Bars3BottomRightIcon
          onPress={openFilterModal}
          color={"grey"}
          size={hp(4)}
          style={{ fontWeight: "bold" }}
        />
      </SafeAreaView>

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: hp(1) }}
      >
        {/* Search  */}
        <View style={styles.inputContainer}>
          <View style={{ marginRight: hp(0.8) }}>
            <MagnifyingGlassIcon
              color={"grey"}
              size={hp(3)}
              fontWeight={"bold"}
            />
          </View>
          <TextInput
            ref={inputRef}
            onChangeText={handleTextChange}
            style={styles.input}
            placeholder={"Search here..."}
          />
          {search && (
            <Pressable
              onPress={() => handleSearch("")}
              style={styles.clearButton}
            >
              <XMarkIcon size={hp(3.1)} color={"grey"} />
            </Pressable>
          )}
        </View>

        {/* categories */}

        <ScrollView
          horizontal
          contentContainerStyle={{
            paddingHorizontal: hp(1),
            gap: hp(2),
            borderWidth: 2,
            marginVertical: hp(1),
          }}
          showsHorizontalScrollIndicator={false}
        >
          {categories.map((category, index) => (
            <Category
              isActive={category === activeCategory ? true : false}
              key={index}
              category={category}
              handleChangeCategory={handleChangeCategory}
            />
          ))}
        </ScrollView>

        {/* Applied Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: hp(1),
            alignItems: "center",
            gap: hp(1.3),
          }}
          style={{ flexDirection: "row" }}
        >
          {filters &&
            Object.keys(filters).map((title) => {
              return (
                <View
                  key={title}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: hp(0.9),
                    padding: hp(0.6),
                    borderWidth: 1,
                    borderColor: "lightgrey",
                    borderRadius: 17,
                    backgroundColor: "lightgrey",
                  }}
                >
                  {title != "colors" ? (
                    <Text style={{ fontWeight: "light", color: "black" }}>
                      {filters[title]}
                    </Text>
                  ) : (
                    <View
                      style={{
                        backgroundColor: filters[title],
                        height: hp(2.9),
                        width: hp(3.3),
                        borderRadius: 7,
                        borderColor: "grey",
                        borderWidth: 1,
                      }}
                    ></View>
                  )}
                  <Pressable
                    onPress={() => {
                      removeFilter(title);
                    }}
                    style={styles.filterClearButton}
                  >
                    <XMarkIcon size={hp(2.1)} color={"black"} />
                  </Pressable>
                </View>
              );
            })}
        </ScrollView>

        {/* Masonry List */}
        <ImageGrid images={images} router={router} />

        <View style={{ height: hp(6), width: "100%" }}>
          <ActivityIndicator
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            size={hp(7)}
          />
        </View>
        {/* Filters Modal */}
        <FiltersModal
          bottomSheetModalRef={bottomSheetModalRef}
          filters={filters}
          setFilters={setFilters}
          applyFilter={applyFilter}
          resetFilter={resetFilter}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    alignItems: "center",
  },
  headerText: {
    fontSize: hp(3.2),
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: hp(0.5),
    borderRadius: 18,
    borderColor: "lightgrey",
    borderWidth: 1,
    paddingHorizontal: hp(0.7),
  },
  input: {
    padding: hp(1.2),
    fontSize: hp(1.7),
    backgroundColor: "white",
    flex: 1,
    borderRadius: 17,
  },
  clearButton: {
    padding: hp(0.8),
    borderRadius: 18,
    marginRight: hp(0.6),
    backgroundColor: "lightgrey",
  },
  filterClearButton: {
    padding: hp(0.8),
    borderRadius: 10,
    marginRight: hp(0.6),
    backgroundColor: "grey",
  },
});

export default index;
