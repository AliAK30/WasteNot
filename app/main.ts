// This is aliased to another location when server components are enabled.
// We use this intermediate file to avoid issues with aliases not applying to package.json main field resolution.
import "expo-router/entry-classic"
import { openDatabaseSync } from "expo-sqlite";
import { createContext } from "react";
import * as Notifications from "expo-notifications"
import BackgroundFetch from "react-native-background-fetch"

export const db = openDatabaseSync("wastenot");


db.execSync(
  `CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, expire TEXT, quantity INTEGER NOT NULL, picture TEXT NOT NULL);`
);



export type FoodItem = {
  id: number;
  name: string;
  expire: string;
  quantity: number;
  picture: string;
}

type contextobj = {
  data: null | Array<FoodItem>;
  setData: React.Dispatch<React.SetStateAction<Array<FoodItem> | null>>;
};



export const AppContext = createContext<contextobj>({}as contextobj);

let MyHeadlessTask = async (event: any) => {
    // Get task id from event {}:
    let taskId = event.taskId;
    let isTimeout = event.timeout;  // <-- true when your background-time has expired.
    if (isTimeout) {
      // This task has exceeded its allowed running-time.
      // You must stop what you're doing immediately finish(taskId)
      //console.log('[BackgroundFetch] Headless TIMEOUT:', taskId);
      BackgroundFetch.finish(taskId);
      return;
    }
    try {
        const aboutToExpire: any = await db.getAllAsync(
        "SELECT id, name as 'title', ROUND(julianday(expire)-julianday()+0.5, 0) as 'days' FROM items WHERE days<8 AND days>0");
    
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
  
    // Required:  Signal to native code that your task is complete.
    // If you don't do this, your app could be terminated and/or assigned
    // battery-blame for consuming too much time in background.
    BackgroundFetch.finish(taskId);
}
  
// Register your BackgroundFetch HeadlessTask
BackgroundFetch.registerHeadlessTask(MyHeadlessTask);