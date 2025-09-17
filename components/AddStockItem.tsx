import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import originalStuff from "../assets/images/data/stuff.json";

export type Item = {
  id?: string;
  barcode?: string;
  name: string;
  fullName?: string;
  price?: number;
  quantity?: number;
  category?: string;
  image?: string;
};

export default function AddStockItem() {
  const [barcode, setBarcode] = useState("");
  // create a local state copy so we can update quantities and re-render
  const [inventory, setInventory] = useState<Item[]>(
    (originalStuff as unknown as Item[]).map((i) => ({ ...i }))
  );

  const normalize = (s?: string) => (s ?? "").replace(/\D/g, "");

  const handleAdd = () => {
    const q = normalize(barcode.trim());
    if (!q) {
      Alert.alert("Enter barcode");
      return;
    }
    const idx = inventory.findIndex((i) => normalize(i.barcode) === q);
    if (idx === -1) {
      Alert.alert("Item not found");
      return;
    }
    const copy = inventory.slice();
    const item = copy[idx];
    copy[idx] = { ...item, quantity: (item.quantity ?? 0) + 1 };
    setInventory(copy);
    // optionally clear input
    setBarcode("");
  };

  return (
    <View>
      <Text>Add Stock Item</Text>
      <TextInput
        placeholder="Barcode"
        keyboardType="numeric"
        onChangeText={setBarcode}
        value={barcode}
      />
      <Button title="Add Item" onPress={handleAdd} />
      <View style={{ marginTop: 12 }}>
        <Text>Inventory snapshot (for debug):</Text>
        {inventory.map((it) => (
          <Text key={it.id ?? it.barcode}>
            {it.name} — Qty: {it.quantity ?? 0}
          </Text>
        ))}
      </View>
    </View>
  );
}