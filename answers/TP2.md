# TP 2: several screens — answers

## Question 1

Message shown when hovering `STARTER_ITEMS` in `src/app/index.tsx`:

> `Property 'claimed' is missing in type '{ id: string; title: string; place: string; }' but required in type 'Item'. ts(2741)`

Why: in exercise 1.1 we added `claimed: boolean` to the `Item` type in `src/types.ts`. The field has no `?`, so it is **required**. The old `STARTER_ITEMS` array in `index.tsx` is still declared as `Item[]`, but its objects only have `id`, `title` and `place`, so they no longer match the type. (The same error appears on the `newItem: Item` built in `addItem`.)

The app still runs because TypeScript types are erased when the code is bundled: they only exist in the editor and at type-check time. The error disappears in exercise 3, when `index.tsx` is replaced and reads the list from the context, whose `STARTER_ITEMS` all have a `claimed` field.

## Question 2

- **Counter line**: `3 items reported · 2 still waiting for their owner`. The first number is `items.length` (all the items in the context). The second is `waiting`, the number of items whose `claimed` is `false` (`items.filter((item) => !item.claimed).length`). With the starter data, the USB-C charger is already claimed, so 2 are still waiting.
- **Footer**: `Running on android`. The word comes from **`Platform.OS`**, imported from `react-native`. React Native fills it with the name of the platform the code is currently running on: `'android'` on the emulator, `'ios'` on an iPhone and `'web'` in the browser.

(The two `href` underlined in red, `"/add"` and `"/item/[id]"`, are normal at this step: Expo Router's typed routes only know the screen files that exist, and those two screens are created in exercises 4 and 5.)
