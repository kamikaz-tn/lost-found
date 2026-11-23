# TP 3: device features and saved data — answers

## Question 1

Installed with `npx expo install expo-image-picker expo-location @react-native-async-storage/async-storage`. `package.json` now lists:

| Library | Version in `package.json` |
|---|---|
| `expo-image-picker` | `~58.0.10` |
| `expo-location` | `~58.0.22` |
| `@react-native-async-storage/async-storage` | `2.2.0` |

These are the versions that match the project's Expo SDK (`expo ~58.0.26`). The two Expo libraries share its major version 58, and the `~` lets npm take later patch releases (58.0.x) but not a new minor or major version. AsyncStorage is not an Expo library, so it has its own numbering, pinned to the exact version that SDK 58 was tested with.

## Exercise 2 / Question 2

Test: I added *Grey hoodie (Mehdi)* and reloaded the app (**r**) three times. It was still there each time, with the counter at 4. The list is stored as JSON under the key `lost-found/items`.

Without the `if (loaded)` check, the second `useEffect` runs on the **very first render**, when `items` is still the initial empty array `[]` and the data has not been read yet. It then immediately calls `AsyncStorage.setItem('lost-found/items', '[]')` and **overwrites the saved list with an empty one** before the load has finished.

(I tried it: every start logged a first save of `[]`, then a second save once the data arrived.)

Loading and saving are both asynchronous, so the result depends on which finishes first:

- If the empty save lands before the read, `getItem` returns `"[]"`. That is not `null`, so the app does **not** fall back to `STARTER_ITEMS`: it loads an empty list, and **all reported items disappear after a reload**. (This is the *Common errors* line: "Items disappear after a reload".)
- Even when the read wins, the storage holds `[]` for a moment at every start. If the app is closed or crashes during that moment, the data is gone.

The `loaded` flag makes saving wait until the first load is done, so we only ever save a list that really came from the device.

## Question 3

If the gallery is closed without choosing anything, `launchImageLibraryAsync` still resolves, but with **`result.canceled === true`** (a boolean) and `result.assets === null`. That is why the code checks `if (!result.canceled)` before reading `result.assets[0].uri`. On cancel, nothing happens and the previous photo (if any) stays. When a picture *is* chosen, `canceled` is `false` and `assets[0].uri` is the address of the picked image, which then appears above the buttons.

## Question 4

- **The camera** gives the app **direct access to a sensor**: once allowed, the app could take pictures or video of the user and their surroundings by itself. Android and iOS treat it as a *dangerous* permission (`android.permission.CAMERA`), so the app must call `requestCameraPermissionsAsync()` and get an explicit **yes** from the user at runtime. The system dialog only appears the first time. The answer is then remembered.
- **The gallery picker** does not give the app access to the photo library at all. It opens the **system's own photo picker**, which runs outside our app. The **user** chooses one picture, and the app only receives that single file. Since the user's choice already is the consent, and the app cannot browse or read the other photos, no permission is needed.
