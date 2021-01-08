import React, { useEffect, useState } from "react";
import { View, Image, FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectMoviesAsArray } from "../selectors/movies";
// import moviesData from "../moviesData";
import { loadMovies } from "../slices/movies";


const Item = ({ item, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <Text style={styles.title}>{item.title}</Text>
  </TouchableOpacity>
);

const MoviesFlatList = () => {
  const [selectedId, setSelectedId] = useState(null);

  // const movies = useSelector(state => state.movies.byId);
  const dispatch = useDispatch(); //creates dispatch action
  useEffect( () => {
    dispatch(loadMovies);
  },[])

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";

    return (
        <View>
            <Item
              item={item}
              onPress={() => setSelectedId(item.id)}
              style={{ backgroundColor }}
            />
            <Image
                source={{
                    uri: `https://image.tmdb.org/t/p/original${item.poster_path}`,
                    method: 'POST',
                    headers: {
                    Pragma: 'no-cache'
                    },
                    body: 'Your Body goes here'
                }}
                style={{ width: 100, height: 135}}
            />
        </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={useSelector(selectMoviesAsArray)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default MoviesFlatList;