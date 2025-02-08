import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import Header from "@/components/header";
import ItemExpired from "@/components/ItemExpired";
import ItemAdd from "@/components/ItemAdd";
//import { useSQLiteContext } from "expo-sqlite";
import { useContext, useState, useEffect } from "react";
import { AppContext, FoodItem } from "../main";
import { DateTime } from "luxon";


type AlmostExpired = {
  id: number;
  title: string;
  days: number;
};



export default function Home() {
  //const db = useSQLiteContext();
  const { data } = useContext(AppContext);
  const [aboutToExpire, setAboutToExpire] = useState<null | AlmostExpired[]>(null);
  const [showAddItem, setShowAddItem] = useState<boolean>(false);

  useEffect(() => {
    init();
  }, [data]);

  const init = async () => {
    try {
      /* let aboutToExpire: any = await db.getAllAsync(
        "SELECT id, name as 'title', ROUND(julianday(expire)-julianday()+0.5, 0) as 'days' FROM items WHERE days<8 AND days>0"
      ); */

      setAboutToExpire(getAlmostExpired(data));
    } catch (e: any) {
      console.log(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Home" />
      <ItemAdd isVisible={showAddItem} setVisibility={setShowAddItem} />
      <View style={styles.welcomeView}>
        <Text style={styles.welcomeText}>Welcome Back!</Text>
        <Text style={styles.secondText}>
          You have tracked {data?.length} food items
        </Text>
      </View>
      <View style={styles.expireView}>
        <Text
          style={{
            fontFamily: "LexendDeca_600SemiBold",
            color: "#dd510c",
            fontSize: 18,
          }}
        >
          Expiring Soon
        </Text>
        {data && (
          <FlatList
            data={aboutToExpire}
            renderItem={({ item }) => (
              <ItemExpired name={item.title} days={item.days} />
            )}
          />
        )}
      </View>
      <View style={styles.buttonsView}>
        <Pressable
          style={styles.button1}
          onPress={() => setShowAddItem(!showAddItem)}
        >
          <Text style={styles.buttonText}>Add items</Text>
        </Pressable>
      </View>
    </View>
  );
}

const getAlmostExpired = (data: FoodItem[] | null): AlmostExpired[] | null => {
  if (data) {
    const now: DateTime = DateTime.now();
    //console.log(`now: ${now}`)
    let filteredData = data.filter((item: FoodItem) => {
      let e: DateTime = DateTime.fromSQL(item.expire);
      //console.log(`e: ${e}`)
      return e.diff(now, "days").days > 0 && e.diff(now, "days").days < 8;
    });
    //console.log(`data: ${filteredData[0].expire}`)
    let toReturn: AlmostExpired[] = filteredData.map((item: FoodItem) => ({
      id: item.id,
      title: item.name,
      days: Math.ceil(DateTime.fromSQL(item.expire).diff(now, "days").days),
    }));
    //console.log(`toReturn: ${toReturn[0].days}`)
    return toReturn;
  }
  return null;
};

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

  welcomeView: {
    backgroundColor: "#ffffff",
    borderRadius: 9,
    height: "12%",
    width: "90%",
    marginTop: "5%",
    paddingTop: "4%",
    boxShadow: [shadow],
  },

  expireView: {
    backgroundColor: "#ffffff",
    borderRadius: 9,
    width: "90%",
    marginTop: "5%",
    paddingTop: "4%",
    paddingLeft: "4%",
    paddingRight: "4%",
    paddingBottom: "4%",
    boxShadow: [shadow],
    height: "40%",
  },

  buttonsView: {
    flexDirection: "row",
    paddingTop: "5%",
  },

  button1: {
    backgroundColor: "#64cc74",
    paddingHorizontal: "5%",
    paddingVertical: "3%",
    borderRadius: 9,
    boxShadow: [shadow],
    width:"40%"
  },

  button2: {
    backgroundColor: "#b8bfb1",
    paddingHorizontal: "5%",
    paddingVertical: "3%",
    borderRadius: 9,
    boxShadow: [shadow],
  },

  buttonText: {
    color: "#ffffff",
    fontFamily: "LexendDeca_400Regular",
    fontSize: 20,
    textAlign: "center"
  },

  welcomeText: {
    width: "100%",
    textAlign: "center",
    fontFamily: "LexendDeca_700Bold",
    color: "#14b71e",
    fontSize: 20,
  },

  secondText: {
    width: "100%",
    textAlign: "center",
    fontFamily: "LexendDeca_400Regular",
    color: "#7c8c74",
  },
});
