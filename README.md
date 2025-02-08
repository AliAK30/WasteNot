# WasteNot - Food Tracking App
## Video Demo: https://www.youtube.com

## Project Description

### About:
WasteNot app aims to help users minimize food waste by providing tools to track food items in their kitchen, and offering reminders for expiration dates. It promotes awareness of food consumption habits and helps users make more sustainable decisions to reduce waste, save money, and lower their environmental footprint, thus directly supporting SDG 12. It helps individuals make smarter food choices, reduce the environmental impact of food production, and save money, ultimately leading to less waste sent to landfills.

### Technologies used:
The project uses Expo Framework and SDK, built on top of Meta's React Native library for developing cross platform mobile apps and SQLite for storing persistent data.

### Project structure:
```
|   app.json
|   expo-env.d.ts
|   package.json
|   README.md
|   tree.txt
|   tsconfig.json
|   
+---app
|   |   main.ts
|   |   _layout.tsx
|   |   
|   \---(tabs)
|           about.tsx
|           index.tsx
|           items.tsx
|           _layout.tsx
|           
+---assets
|   +---fonts
|   |       SpaceMono-Regular.ttf
|   |       
|   \---images
|           icon.png
|           ic_launcher.png
|           splash.png
|           
\---components
        header.tsx
        Item.tsx
        ItemAdd.tsx
        ItemExpired.tsx
```

## Project Documentation:

### Folders:

- The core code of the app is contained in /app and /components folder
- /components folder contain code that is reusable
- /app folder contains screens that the users can navigate on their phones for example: index.tsx is for home screen, items.tsx for items screen and about.tsx for about screen
- /assets folder contain static data used by the app, like fonts, images, and videos.

### Files:

- package.json: ```containes the dependencies of the project```

- app.json: ```configuration of the app and expo packages used in it```

- expo-env.d.ts: ```dotenv for expo projects```

- app/main.ts: ```This is the entry point of the app, the first import statement signifies that the app uses expo-router for navigating between screens, the rest of the code is for creating and initializing the database as well as run a background task that handles notifications```

- app/_layout.tsx: ```This file is like a second entry point of our app as this is what is displayed first. It initializes context of the app, that is data on which most components in our app relies on. This file defines the layout, that is part of the screen that remains same. It also define the type of navigations, i.e: Stack, Tabs, Drawer used by the app, and establishes links/routes.```

- app/(tabs)/_layout.tsx:  ```This file defines the layout for Tabs Navigation, which is a bar that you see at the bottom of your phone to navigate to different screen. You can define several tabs (screens) in it and also establish a link/route to its files```

- app/(tabs)/index.tsx: ```This file defines the home screen of this app, it uses ItemExpired and ItemAdd components in /components```

- app/(tabs)/items.tsx: ```This file defines the items screen, and renders the number of items stored in the database, the user can delete the items and add more items through it. It uses Item, ItemAdd components in /components```

- app/(tabs)/about.tsx: ```This file defines the about screen, and shows some information about the app.```

- components/header.tsx: ```The header of the app is defined in this file, it shows at the top of the app on every screen```

- components/Item.tsx: ```This file defines the layout and design of an Item that is displayed on the items screen```

- components/ItemAdd.tsx: ```This file defines a Modal, which is a kind of dialog box that can be displayed over screens, but not considered as a screen itself. This component defines the layout of the Add Item Dialog box and its logic, it also validates user input```

- components/ItemExpired.tsx: ```This file defines the layout of the an Item that is about to be expired (within 7 days) and shown on home screen.```


