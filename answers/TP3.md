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

## Question 5

After setting a point on the map in the emulator's extended controls (a point in Sousse), *Use my location* (permission accepted) shows:

> `📍 35.82560, 10.60839`

- **`35.82560` is the latitude**: the north–south position, between −90 (South Pole) and +90 (North Pole). It is positive because we are north of the equator.
- **`10.60839` is the longitude**: the east–west position, between −180 and +180, counted from the Greenwich meridian. It is positive because Tunisia is east of Greenwich.

The order comes from the code in `add.tsx`: `` `📍 ${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}` ``, latitude first and longitude second, rounded to 5 decimals (about 1 m). When the item is saved, both numbers are stored in it (`latitude`, `longitude`).

## Exercise 6: photos in the list

`ItemCard` takes an optional `photoUri` prop and shows a 140 px thumbnail above the title only when it is set (`{photoUri && <Image … />}`). `index.tsx` passes `photoUri={item.photoUri}`. A report saved with a photo shows it on its card, and the cards without a photo (the starter items) look exactly as before.

## Question 6

**Share sheet.** *Share this item* calls `Share.share({ message: 'Found on campus: <title> (<place>)' })`, which opens Android's **system share sheet**. It lists the apps installed on the emulator that can receive text, typically **Gmail, Messages, Google Drive, Quick Share / Nearby Share and Bluetooth**, plus a **Copy** action that puts the text on the clipboard. The exact list depends on the apps installed on the phone. Our app does not choose them: the system does.

**No map link without a location.** The link is wrapped in a condition:

```tsx
{item.latitude !== undefined && (
  <Pressable onPress={openMap}>…Open the exact spot in Maps…</Pressable>
)}
```

`latitude` and `longitude` are optional fields (`latitude?: number`). An item saved without pressing *Use my location* (or the starter items) has no `latitude`, so it is `undefined`, the condition is false and nothing is rendered. Without coordinates there is no "exact spot" to open: the URL would be `…query=undefined,undefined`.

For an item with a location, `Linking.openURL('https://www.google.com/maps/search/?api=1&query=<lat>,<lng>')` hands the link to the system. It opens Google Maps on the spot, or the browser on an emulator without a maps app.

## Exercise 8 / Question 7

`app.json` now ends its `plugins` list with `expo-image-picker` (texts for the photos and camera permissions) and `expo-location` (text for location "when in use"). These sentences go into the native app (`NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription`, `NSLocationWhenInUseUsageDescription` on iOS, plus the permissions in the Android manifest) when the app is built for the stores. Expo Go keeps its own texts.

With *Location* denied for Expo Go (Settings → Apps → Expo Go → Permissions), pressing *Use my location* **does not crash**. A dialog shows **"Location access was refused."**, the button keeps saying *📍 Use my location*, and the item can still be saved without coordinates.

The lines that handle this case are in `useMyLocation()` in `src/app/add.tsx` (lines 45–49):

```tsx
const { status } = await Location.requestForegroundPermissionsAsync(); // 45: ask (or read the saved answer)
if (status !== 'granted') {                                            // 46: refused?
  Alert.alert('Location access was refused.');                        // 47: tell the user
  return;                                                              // 48: stop, never call getCurrentPositionAsync
}
```

Because of the early `return`, `getCurrentPositionAsync()` is never called without permission (it would throw an error). The camera has the same guard in `takePhoto()` with *Camera access is needed to take a photo.* The location permission was restored afterwards.

## Bonus: keeping the photos

`ImagePicker` returns a **temporary** file in the app's cache (`…/cache/ImagePicker/xxx.jpeg`), which Android or iOS may delete to free space. The item would then point to a file that no longer exists.

I installed `expo-file-system` (`npx expo install expo-file-system`) and wrote `src/lib/keepPhoto.ts`. When the report is saved, `save()` in `add.tsx` calls `keepPhoto(photoUri)`, which:

1. creates (if needed) the folder `photos/` inside the app's **documents** folder (`new Directory(Paths.document, 'photos').create({ idempotent: true, intermediates: true })`). The system never cleans this folder on its own;
2. copies the temporary file there under a unique name (`new File(tempUri).copy(new File(folder, `${Date.now()}${extension}`))`);
3. returns the **new permanent `file://` address**. That address is stored in the item and in AsyncStorage.

The copy is only made when pressing *Save*, so photos picked and then replaced do not leave copies behind. If the copy fails, the item is still saved with the temporary address. In the browser there is no file system, so the address given by the picker is kept as is.

## Final questions

**1. What is the difference between `npx expo install` and `npm install`?**
`npm install <package>` installs the **latest** version published on npm, whatever SDK the project uses. `npx expo install <package>` looks up the version that was **tested with the project's Expo SDK** (here SDK 58) and installs that one, using npm underneath. It also adds the right config plugin to `app.json` when the library needs one. This matters for libraries with **native code** (camera, location, storage…). Expo Go and the app's native layer are built for one SDK, and a version made for another SDK can crash or give *Cannot find native module*. If npm already put a wrong version, `npx expo install <package>` (or `npx expo install --fix`) puts the right one back.

**2. Why does the app ask for a permission before using the camera or the location?**
Because they are **private data and sensors**. The camera can film the user and their surroundings, and the location tells where they are and can track where they go. Android and iOS protect them with *runtime permissions*: an app cannot use them until the **user** has said yes in a system dialog that the app cannot fake or skip. The user stays in control and can refuse or revoke later in the settings. The app must handle a refusal properly (here: a message instead of a crash). The texts in `app.json` explain *why* the app needs each permission, and the stores require them.

**3. Name two things this app can do that a website on the same phone could not do as easily.**
- **Use the phone's hardware directly**: open the native camera and gallery, and read the GPS position, with the system's own permission dialogs and native controls (`Switch`, dialogs, share sheet).
- **Keep data on the device and talk to other apps**: the list and the photos are saved in the app's own storage and folder (AsyncStorage, `expo-file-system`), and survive closing the app and working offline. The app also hands content to other installed apps: the **system share sheet** (Gmail, Messages, Quick Share…) and **opening Google Maps** at the exact spot with `Linking`.
