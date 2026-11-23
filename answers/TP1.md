# TP 1: a first screen — answers

## Question 1

The `node_modules/` folder is listed in `.gitignore`, so it is never sent to GitHub. It is huge (hundreds of packages) and can always be rebuilt.

Someone who clones the project gets it back by running `npm install` in the project folder. npm reads `package.json` (the list of dependencies) and `package-lock.json` (the exact versions that were installed), then downloads the same packages again into a new `node_modules/`.

## Question 2

After `npm run reset-project` (answered **n**), `src/app` only contains two files:

- `src/app/_layout.tsx`: the **root layout**. It wraps every screen of the app. Here it returns a `<Stack />`, the navigator that shows the screens as a pile of cards and draws the header bar at the top.
- `src/app/index.tsx`: the **home screen**. With Expo Router, every file in `src/app` is a screen, and `index.tsx` is the one at the address `/`, the first screen shown when the app opens.

The demo files (`explore.tsx`, the components, hooks, constants and demo images) and the `scripts/` folder were deleted.

## Question 3

Change 1, words written directly inside `<View>` (outside any `<Text>`), shows a red error screen:

> **Text strings must be rendered within a &lt;Text&gt; component.**

The rule: in React Native, **every piece of text must be inside a `<Text>` component**. A `<View>` is only a box for layout. It cannot display text by itself, because there is no HTML and no browser that would turn loose text into something visible. Only `<Text>` maps to the native text widget (`TextView` on Android, `UILabel` on iOS).

Change 2, `<View>` replaced by `<div>`, also crashes on Android (`View config getter callback for component 'div' must be a function… Make sure to start component names with a capital letter`). `div` is an HTML tag and React Native has no HTML, so there is no native component called `div`. Both changes were undone afterwards.
