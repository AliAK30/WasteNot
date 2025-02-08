import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, StrictMode } from "react";
import { ActivityIndicator, Platform, Alert } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import {
  useFonts,
  LexendDeca_400Regular,
  LexendDeca_700Bold,
  LexendDeca_600SemiBold,
} from "@expo-google-fonts/lexend-deca";
import { SQLiteProvider, openDatabaseAsync} from "expo-sqlite";
import * as Notifications from "expo-notifications";
import { AppContext, FoodItem, db } from "./main";
import BackgroundFetch from "react-native-background-fetch";

const initBackgroundFetch = async () => {
  
  // Timeout callback is executed when your Task has exceeded its allowed running-time.
  // You must stop what you're doing immediately BackgroundFetch.finish(taskId)
  const onTimeout = async (taskId: any) => {
    //console.warn("[BackgroundFetch] TIMEOUT task: ", taskId);
    BackgroundFetch.finish(taskId);
  };

  const onEvent = async (taskId: any) => {
    //console.log("[BackgroundFetch] task: ", taskId);
    // Do your background work...
    //check any FoodItem for expiration
    if(os === "ios")
    {
      const db = await openDatabaseAsync("wastenot")
      try {
        const aboutToExpire: any = await db.getAllAsync(
          "SELECT id, name as 'title',  ROUND(julianday(expire)-julianday()+0.5, 0) as 'days' FROM items WHERE days<8 AND days>0"
        );
    
        // Example: Send a local notification
        //console.log(`Notification sent`);
        if (aboutToExpire.length > 0) {
          for (let food of aboutToExpire) {
            await Notifications.scheduleNotificationAsync({
                //notificationContentInput obj
                content: {
                  title: `${food.title} is about to Expire in ${food.days} days`,
                  body: `Please consume ${food.title} before it is expired`,
                },
                //notificationTriggerInput obj
                trigger: null 
              });
          }
        }
      }catch (e:any) {
        console.log(e.message)
      }
    }

    // IMPORTANT:  You must signal to the OS that your task is complete.
    BackgroundFetch.finish(taskId);
  };

  // Initialize BackgroundFetch only once when component mounts.
  const status = await BackgroundFetch.configure(
    {
      minimumFetchInterval: 5,
      stopOnTerminate: false,
      enableHeadless: true,
      startOnBoot: true,
    },
    onEvent,
    onTimeout
  );
  
  //console.log("[BackgroundFetch] configure status: ", status);
};


const os = Platform.OS


export default function Layout() {

  const [data, setData] = useState<null | Array<FoodItem>>(null);
  const [loaded, error] = useFonts({
    LexendDeca_400Regular,
    LexendDeca_700Bold,
    LexendDeca_600SemiBold,
  });

  const fetch = async () => {
      try {
        const query: any = await db.getAllAsync('SELECT * FROM items');
        //console.log(query)
        setData(query);
      } catch (e: any) {
        
        console.log(e.message);
      }
    };

  useEffect(() => {
    if (Platform.OS === "android") {
      // Hides navigation bar in android
      NavigationBar.setVisibilityAsync("hidden"); 
      // Keeps it hidden unless swiped
      NavigationBar.setBehaviorAsync("overlay-swipe"); 
    }
    //INITIALIZING APP
    registerForPushNotificationsAsync();
    fetch();
    initBackgroundFetch();
  }, []);

  if (!loaded) {
    return <ActivityIndicator />;
  }

  return (
    <StrictMode>
      <AppContext.Provider value={{ data, setData}}>
      <SQLiteProvider databaseName="wastenot">
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="dark" translucent={true} />
      </SQLiteProvider>
      </AppContext.Provider>
    </StrictMode>
  );
}

async function registerForPushNotificationsAsync() {
  try {

    
    if (os === "android" && Platform.Version >= 26) {
      //only android api levels 26+ support notification channels
      //Check if Notification Channel already exists
      const status = await Notifications.getNotificationChannelAsync("wasteNotChannel")
      if(!status)
      {
        await Notifications.setNotificationChannelAsync(
          "wasteNotChannel",
          //notificationChannelInput object
          {
            name: "Food Expiration Notifications",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
          }
        );
      }

    }

    const {status} = await Notifications.getPermissionsAsync();
   
    if (status !== "granted") {
      //get notifications permissions
      const res = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });

      if (typeof res.ios !== "undefined") {
        if (res.ios?.status < 2) {
          Alert.alert(
            "Permission not granted for sending notifications! You won't recive notifications alerts for food about to expire unless you enable notifications from settings."
          );
          return;
        }
      } else {
        if (res.status == "denied") {
          Alert.alert(
            "Permission not granted for sending notifications! You won't recive notifications alerts for food about to expire unless you enable notifications from settings."
          );
          return;
        }
      }
    }
    //console.log(status);
  } catch (e: any) {
    console.log(e.message);
  }
}
