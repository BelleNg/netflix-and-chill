import * as React from "react";
import { View, Text } from "react-native";
import MoviesFlatList from "./features/moviesFlatList";
import store from "./store";
import { Provider } from "react-redux";

export default function App() {

  
  return (
    <Provider store={store}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor:"blue",
        }}
      >
        <Text>Hello World</Text>
        <MoviesFlatList/>
      </View>
    </Provider>
  );
}
