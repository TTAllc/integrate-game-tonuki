# What Is game Tonuki?

Tonuki is a Telegram-native gaming marketplace that empowers game developers to showcase their games on one of the fastest-growing social platforms. With Tonuki toolkit solutions, you can launch Web2 and Web3 games on Telegram and use all the benefits of social and referral mechanics to boost traffic and revenue.

Games in Tonuki can vary in genre, complexity, and gameplay mechanics. They can range from simple arcade-style games to more intricate multiplayer experiences. Tonuki games are lightweight and accessible, and users can play them seamlessly within the Telegram app without downloads or installation.

# What Is a Game in Tonuki?

- It is a web-based application inside Telegram.
- It can open directly from a Telegram chat, group, or /channel.
- It can be shared directly from the game interface.
- If you already have a game built on HTML5 or WebGL (Unity, Phaser, PixiJS, BabylonJS, Cocos2d, and others), you can easily adapt it to work on our platform.

# Tonuki Integration Guide
Some methods are mandatory to be implemented:

- [loading()]() At the start of the game loading process, it's essential to transmit loading (1), and similarly, at the end when the game has finished loading (100). If the loading progress reaching 100% is not signaled, the Play button within the wrapper won't become active.

- The game should consider to use correct user locale for rendering proper UI texts. You can find locale by calling [getUserProfile()]()method OR use devices locale in order of prioriry: (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;

- [setData()/getData()]() It can be utilized for cloud saving and cross-device experiences. For example, if your game has levels or your players accumulate some in-game bonuses, you can save and share that information using these methods so that you do not ruin the user experience. This can also be implemented through other methods on the developer side.

Inside Playdeck, your game runs in an iFrame in our Wrapper. The process of passing data between your game and our Wrapper is via window.postMessage. Window: postMessage() docs

### Let's look at an example of listening to messages and processing data from our Wrapper.

```js
window.addEventListener('message', ({ data }) => {
  if (!message || !data['tonuki'] || !data['playdeck']) return;

  pdData = data['playdeck'];

  // By default, playdeck sends "{ playdeck: { method: "play" }}" after pressing the play button in the playdeck-menu
  if (pdData.method === 'play') { 
    if (runner.crashed && runner.gameOverPanel) {
      runner.restart();
    } else {
      var e = new KeyboardEvent('keydown', { keyCode: 32, which: 32 });
      document.dispatchEvent(e);
    }
  }
  
  // Getting the playdeck-menu status, after using the getPlaydeckState method
  if (pdData.method === 'getPlaydeckState') {
    window.playdeckIsOpen = data.value; // if true, then the playdeck is open
  }
});

const parent = window.parent.window;

const payload = {
  playdeck: {
  method: 'getPlaydeckState',
  },
};

// calling the method
parent.postMessage(payload, '*');
```

We also support playdeck methods. You can integrate [PlayDeck]() games into tonuki

### Message Example

```js
const payload = {
  playdeck: {
    method: 'loading',
    value: 100,
  },
};

parent.postMessage(payload, '*');
```

You can find usage examples and detailed information on each method in our guide below.

### 1. Getting user information
[getUserProfile: () => Profile]()

```js
// This method allows you to get user profile data

type Profile = {
  avatar: string,
  username: string,
  firstName: string,
  lastName: string,
  telegramId: number,
  locale: 'en' | 'ru',
  token: string,
  params: { [key: string]: string },
  sessionId: string,
  currentGameStarted: number
};

const parent = window.parent.window;
parent.postMessage({ playdeck: { method: 'getUserProfile' } }, '*');

window.addEventListener('message', ({ data }) => {
  const playdeck = data?.playdeck;
  if (!playdeck) return;

  if (playdeck.method === 'getUserProfile') {
    console.log(playdeck.value); // Profile
  }
});
```

### 2. Cloud save

```js
  /**
   * Set Data - use to save arbitrary data in between sessions.
   * @param {string} data - value (limit 10Kb)
   * @param {string} key - key name (length limit 50 symbols) 
  */
  setData: (key: string, data: string) => void

  /**
   * Get Data - use to obtain saved data.
   * @param {string} key - key name
   * @return
   * `{"playdeck": {
   *   "method": "getData",
   *   "value": "value",
   *   "key": "key"}
   * }`
  */
  getData: (key: string) => Object
```

[setData: (key: string, data: string) => void]()

```js
// This method will allow you to store any data you may need.
// Data is saved by key. To retrieve previously saved data, use the `getData` method.

const parent = window.parent.window;

parent.postMessage(
  {
    playdeck: {
      method: 'setData',
      key: key,
      value: yourData,
    },
  },
  '*'
);
```

[getData: (key: string) => { key: key, data: data }]()

```js
// This method allows you to read previously written data by key.
// If there is no value for this key, it will return an empty object.
// Use the `setData` method to save the data.

const parent = window.parent.window;
parent.postMessage({ playdeck: { method: 'getData', key: key } }, '*');

window.addEventListener('message', ({ data }) => {
  const tonuki = data?.playdeck || data?.tonuki;
  if (!tonuki) return;

  if (tonuki.method === 'getData') {
    if (tonuki.key === 'x') {
      window.customData = tonuki.value;
    }
  }
});
```

### 3. Sharing and opening links
[customShare: (object) => void]()

```js
  // Creating a telegram link with a query string and starts the share procedure
  // You can get a query string from the game using the following methods getUrlParams and getUserProfile

const parent = window.parent.window;
parent.postMessage({ tonuki: { method: "customShare", value: {[key: string]: string} } }, "*");
```

[getShareLink: (object) => string]()
```js
// Creating a telegram link with a query string
// You can get a query string from the game using the following methods getUrlParams and getUserProfile

const parent = window.parent.window;
parent.postMessage({ tonuki: { method: "getShareLink", value: {[key: string]: string} } }, "*");

window.addEventListener("message", ({ data }) => {
  const tonuki = data?.playdeck || data?.tonuki;
  if (!tonuki) return;

  if (tonuki.method === "getShareLink") {
    console.log(tonuki.value) // link to the game
  }
});
```

### 4. Exchange of information with the Wrapper
[getPlaydeckState: () => boolean]()

```js
// This method will return you information about
// whether our integration environment overlay is currently open.

const parent = window.parent.window;
parent.postMessage({ tonuki: { method: 'getPlaydeckState' } }, '*');

window.addEventListener('message', ({ data }) => {
  const tonuki = data?.playdeck || data?.tonuki;
  if (!tonuki) return;

  if (tonuki.method === 'getPlaydeckState') {
    window.isPlayDeckOpened = tonuki.value; // `value` === true or false;
  }
});
```

[gameEnd: () => void]()

```js
// This method is sent unilaterally only to our integration environment.
// It signals to our integration environment that the game has been over.
// After that we demonstrate the popup.

const parent = window.parent.window;
parent.postMessage({ tonuki: { method: 'gameEnd' } }, '*');
```

[loading: (pct: number | undefined) => void]()

```js
// This method is sent unilaterally only to our integration environment.
// Causes our integration environment to display the download percentage of your game.
// Accepts values from 0 to 100 as a percentage. If you do not pass a value when calling at all,
// then the method will automatically simulate loading up to 80%.
// In order for the progress bar to become a Play button, you need to pass the value 100.

const parent = window.parent.window;

// We call the loading method without passing a value
// so that the integration environment starts displaying the loading process
parent.postMessage({ tonuki: { method: 'loading' } }, '*');
// Artificially slow down the download completion call by 1 second
setTimeout(() => {
  parent.postMessage({ tonuki: { method: 'loading', value: 100 } }, '*');
}, 1000);
```

# Unity PlayDeck Bridge

## Introduction
This guide provides step-by-step instructions for integrating PlayDeck into your Unity project. By following these steps, you'll be able to seamlessly set up and use Tonuki in your project.

## Setup Guide

### Step 1: Download source code

### Step 2: Setup the PlayDeck Bridge
1. Begin by copying the "Assets/Tonuki" folder into your Unity project "Assets" directory.
2. Open your start scene in Unity.
3. Drag and drop prefab "TonukiBridge" from the "Assets/Tonuki/Prefabs" to the first scene in your project.
4. Integrate Tonuki with your game using public methods from the "TonukiBridge".

### Step 3: Setting Up Your WebGL Template
- If you're using the provided custom WebGL template:
    - Simply copy and paste "WebGLTemplate" folder into your "Assets". And that's all, skip next steps.
- If you are using your own custom WebGL template:
    - Copy the [`tonukiBridge.js`](https://github.com/ducpv-mobile/integrate-game-tonuki/tonukiBridge.js) file to the same directory as your `index.html` file.

### (Additional) Step 4: Modifying index.html of custom WebGL template
1. **Adding the PlayDeck Script:**
    - Open your `index.html` file.
    - Inside the `<head></head>` tags, add the following line:
      ```html
      <script src="tonukiBridge.js"></script>
      ```
2. **Updating Unity Loading Code:**
    - Find the section in your `index.html` where Unity is loading (creating the Unity instance).
    - Update it using the following code example:
      ```javascript
      const tonukiBridgeInstance = tonukiBridge();
      createUnityInstance(canvas, config, (progress) => {
          tonukiBridgeInstance?.setLoadingProgress(progress * 100)
      }).then(unityInstance => {
          tonukiBridgeInstance?.init(unityInstance);
      });
      ```

### Step 5: Testing
- After making these changes, save your `index.html` file.
- Return to Unity, make and deploy build, test your project to ensure that Tonuki is integrated and functioning correctly.

## Additional Notes
- This guide assumes a basic familiarity with Unity and web development.
- If you encounter any difficulties, you may contact us for additional help.