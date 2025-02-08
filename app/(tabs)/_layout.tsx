import { StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
//import FontAwesome6 from "@expo/vector-icons/FontAwesome6";


const iconSize: number = 22;

export default function TabLayout() {
  

  return (
    
      <Tabs
        screenOptions={{
          tabBarStyle: styles.tab,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarLabelStyle: styles.tabBarLabel,
            tabBarActiveTintColor: "#000000",
            tabBarInactiveTintColor: "#ffffff",
            tabBarIcon: ({ color }) => (
              <FontAwesome5 size={iconSize} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="items"
          options={{
            title: "Items",
            tabBarLabelStyle: styles.tabBarLabel,
            tabBarActiveTintColor: "#000000",
            tabBarInactiveTintColor: "#ffffff",
            tabBarIcon: ({ color }) => (
              <FontAwesome5 size={iconSize} name="list" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            title: "About",
            tabBarLabelStyle: styles.tabBarLabel,
            tabBarActiveTintColor: "#000000",
            tabBarInactiveTintColor: "#ffffff",
            tabBarIcon: ({ color }) => (
              <FontAwesome5 size={iconSize} name="info-circle" color={color} />
            ),
          }}
        />
      </Tabs>
    
  );
}


const styles = StyleSheet.create({
  tab: {
    backgroundColor: "#7c8c74",
    paddingTop: 7,
    paddingLeft: 3,
    paddingRight: 3,
    height: "10%",
  },

  tabBarLabel: {
    fontFamily: "LexendDeca_400Regular",
    fontSize: 12,
    width: "100%",
  },
});
