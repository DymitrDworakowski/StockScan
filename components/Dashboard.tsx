// react hooks imported below
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import stuff from "../assets/images/data/stuff.json";

type StuffItem = {
  id?: number | string;
  barcode?: string;
  name: string;
  fullName?: string;
  category?: string;
  price?: number;
  quantity?: number;
  image?: string;
};

function formatPrice(price?: number) {
  if (price == null || Number.isNaN(price)) return "-";
  return `$${price.toFixed(2)}`;
}

const renderItem = ({ item }: { item: StuffItem }) => (
  <View style={styles.item}>
    <Image source={{ uri: item.image }} style={{ width: 32, height: 32 }} />
    <View style={styles.name}>
      <Text>{item.name} </Text>
      <Text style={styles.fullName}>{item.fullName} </Text>
    </View>

    <Text>{item.category} </Text>
    <View style={styles.price}>
      <Text>Price: {formatPrice(item.price)} </Text>
      {(item.quantity ?? 0) <= 0 ? (
        <Text style={styles.low}>Out of stock</Text>
      ) : (
        <Text>Qty: {item.quantity} </Text>
      )}
    </View>
  </View>
);

export default function Dashboard() {
  const [text, setText] = useState("");

  const normalize = (s?: string) => (s ?? "").replace(/\D/g, "");

  const filtered = useMemo(() => {
    const q = normalize(text?.trim());
    if (!q) return null; 
    return (stuff as StuffItem[]).filter((s) => normalize(s.barcode) === q);
  }, [text]);

  const dataToShow = filtered ?? (stuff as StuffItem[]);

  return (
    <View style={styles.container}>
      <Text>Dashboard</Text>
      <TextInput
        placeholder="Search by barcode"
        onChangeText={(newText) => setText(newText)}
        value={text}
        style={{
          marginVertical: 8,
          padding: 8,
          borderWidth: 1,
          borderRadius: 6,
        }}
      />

      {filtered !== null && filtered.length === 0 ? (
        <Text>No matches</Text>
      ) : (
        <FlatList
          data={dataToShow}
          renderItem={renderItem}
          keyExtractor={(item) => item.id?.toString() ?? item.name}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
    marginVertical: 8,
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    height: 44,
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  name: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 2,
  },
  fullName: {
    fontSize: 12,
    color: "gray",
  },
  price: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 4,
  },
  low: {
    color: "red",
  },
});
