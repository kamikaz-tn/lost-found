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

## Question 3

The add screen never sends the item back to the home screen. **Both screens share the same data through the context.**

1. `add.tsx` calls `addItem(...)`, which it got from `useItems()`.
2. `addItem` runs inside `ItemsProvider`, the component that owns the list. It calls `setItems(...)` and replaces the `items` state with a new array that starts with the new item.
3. `ItemsProvider` sits **above every screen** (it wraps the `<Stack>` in `_layout.tsx`). When its state changes, every component that reads the context with `useItems()` re-renders with the new value.
4. The home screen reads `items` with `useItems()`, so it re-renders with the new list. The counter goes from `3 items reported · 2 still waiting…` to `4 items reported · 3 still waiting…`, and the new card appears first. `router.back()` closes the modal, and the home screen underneath is already up to date.
