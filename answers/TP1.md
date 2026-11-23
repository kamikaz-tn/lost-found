# TP 1: a first screen — answers

## Question 1

The `node_modules/` folder is listed in `.gitignore`, so it is never sent to GitHub. It is huge (hundreds of packages) and can always be rebuilt.

Someone who clones the project gets it back by running `npm install` in the project folder. npm reads `package.json` (the list of dependencies) and `package-lock.json` (the exact versions that were installed), then downloads the same packages again into a new `node_modules/`.

## Question 2

After `npm run reset-project` (answered **n**), `src/app` only contains two files:

- `src/app/_layout.tsx`: the **root layout**. It wraps every screen of the app. Here it returns a `<Stack />`, the navigator that shows the screens as a pile of cards and draws the header bar at the top.
- `src/app/index.tsx`: the **home screen**. With Expo Router, every file in `src/app` is a screen, and `index.tsx` is the one at the address `/`, the first screen shown when the app opens.

The demo files (`explore.tsx`, the components, hooks, constants and demo images) and the `scripts/` folder were deleted.
