import { View, Text, StyleSheet } from "react-native";
import Header from "@/components/header";

export default function About() {
  return (
    <View style={styles.container}>
      <Header title="About" />
      <View style={styles.aboutView}>
        <Text style={styles.aboutText}>
          WasteNot app aims to help users minimize food waste by providing tools
          to track food items in their kitchen, and offering reminders for
          expiration dates. It promotes awareness of food consumption habits and
          helps users make more sustainable decisions to reduce waste, save
          money, and lower their environmental footprint, thus directly supporting SDG
          12. It helps individuals make smarter food choices, reduce the
          environmental impact of food production, and save money, ultimately
          leading to less waste sent to landfills.
        </Text>
      </View>
    </View>
  );
}

const shadow = {
  offsetX: 0,
  offsetY: 4,
  blurRadius: 6,
  spreadDistance: "0px",
  color: "rgba(0,0,0,0.10)",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#e5ebdd",
  },

  aboutView: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 9,
    marginBottom: "20%",
    marginTop: "10%",
    width: "90%",
    boxShadow: [shadow],
    justifyContent: "center",
    paddingHorizontal: "3%",
  },

  aboutText: {
    color: "#7c8c74",
    fontFamily: "LexendDeca_600SemiBold",
    fontSize: 18,
    textAlign: "center",
  },
});
