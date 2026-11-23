# TP 3: device features and saved data — answers

## Question 1

Installed with `npx expo install expo-image-picker expo-location @react-native-async-storage/async-storage`. `package.json` now lists:

| Library | Version in `package.json` |
|---|---|
| `expo-image-picker` | `~58.0.10` |
| `expo-location` | `~58.0.22` |
| `@react-native-async-storage/async-storage` | `2.2.0` |

These are the versions that match the project's Expo SDK (`expo ~58.0.26`). The two Expo libraries share its major version 58, and the `~` lets npm take later patch releases (58.0.x) but not a new minor or major version. AsyncStorage is not an Expo library, so it has its own numbering, pinned to the exact version that SDK 58 was tested with.
