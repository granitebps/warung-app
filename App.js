import React, { useState } from "react";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { Root, Container } from "native-base";

import Home from "./screens/Home";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const loadFont = async () => {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font,
    });
  };

  if (!isReady) {
    return (
      <AppLoading
        startAsync={loadFont}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <Root>
      <Container>
        <Home />
      </Container>
    </Root>
  );
}
