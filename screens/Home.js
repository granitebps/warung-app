import React, { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Camera } from "expo-camera";
import Product from "../models/Products";
import {
  Content,
  Form,
  H1,
  Input,
  Item,
  Label,
  Button,
  Text,
  H3,
  Toast,
} from "native-base";

const windowHeight = Dimensions.get("window").height;

export default function Home() {
  const [hasPermission, setHasPermission] = useState(null);
  const [barcode, setBarcode] = useState("");
  const [exists, setExists] = useState(true);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");

      await Product.createTable();
    })();
  }, []);

  const saveData = async () => {
    if (name === "" || barcode === "" || price === "") {
      Toast.show({
        text: "Name and Price Cannot Empty",
        duration: 3000,
        type: "danger",
      });
    } else {
      await Product.create({
        code: barcode,
        name,
        price: price.toString(),
      });
      Toast.show({
        text: "Product Saved",
        duration: 3000,
        type: "success",
      });
      setExists(true);
    }
  };

  const checkBarcode = async (data) => {
    const code = data.data;
    setBarcode(code);
    const product = await Product.findBy({ code_eq: code });

    if (!product) {
      setExists(false);
      setName("");
      setPrice("");
    } else {
      console.log(product);
      setExists(true);
      setName(product.name);
      setPrice(product.price.toString());
    }
  };

  const destroyData = async () => {
    await Product.destroyAll();
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <Content style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onBarCodeScanned={checkBarcode}
      />
      {exists ? (
        <View style={styles.dataContainer}>
          <H1>Name : {name}</H1>
          <H1>Price : {price}</H1>
          <H1>Code : {barcode}</H1>
        </View>
      ) : (
        <View style={styles.dataContainer}>
          <H1>New Product</H1>
          <H3>Code : {barcode}</H3>
          <Form>
            <Item floatingLabel style={styles.form}>
              <Label>Name</Label>
              <Input value={name} onChangeText={setName} />
            </Item>
            <Item floatingLabel style={styles.form}>
              <Label>Price</Label>
              <Input
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </Item>
          </Form>
          <View style={styles.buttonContainer}>
            <Button onPress={saveData} success>
              <Text>Save Data</Text>
            </Button>
          </View>
        </View>
      )}
      {/* <Button title="Destroy Data" onPress={destroyData} /> */}
    </Content>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    height: windowHeight / 2,
  },
  dataContainer: {
    alignItems: "center",
    width: "100%",
  },
  form: {
    width: "100%",
  },
  buttonContainer: {
    marginTop: 20,
  },
});
