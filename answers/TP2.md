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

## Question 4

The address of the screen carries the id. Each card in the list is a `Link` to `{ pathname: '/item/[id]', params: { id: item.id } }`, so tapping the *Student card* opens `/item/2`. The file `src/app/item/[id].tsx` matches any `/item/<something>`, and the part in brackets becomes a **route parameter** named `id`.

The screen reads it with the hook **`useLocalSearchParams`** from `expo-router`:

```tsx
const { id } = useLocalSearchParams<{ id: string }>();
```

It then looks up the item with that id in the shared list: `items.find((candidate) => candidate.id === id)`. It also sets the header title to the item's name with `<Stack.Screen options={{ title: item.title }} />`.

## Question 5

After turning on *Returned to its owner* for the *Student card* and going back:

- **On the card**: it becomes faded (`opacity: 0.6`, style `cardClaimed`) and shows a green **✓ Claimed** badge under the place.
- **In the counter line**: the first number stays the same and the second goes down by one: `3 items reported · 2 still waiting…` becomes `3 items reported · 1 still waiting for their owner`. `toggleClaimed` only flips `claimed`. It does not remove the item.

The `<Switch>` is the platform's own native control. On Android it is the Material switch (a thumb sliding on a track). A classmate running the **same code on an iPhone** sees the **iOS switch**: the wider rounded toggle with a white knob that turns **green** when on. React Native maps `<Switch>` to each platform's native widget instead of drawing its own.

## Exercise 7 / Question 6

On the emulator, *Remove this item* opens the native confirmation dialog (*Remove this item?*, Cancel / Remove). After *Remove*, the item is deleted from the context and `router.back()` returns to the list.

In the browser (**w**), `http://localhost:8081/item/999` shows the "not found" branch of `[id].tsx`. No item has the id `999`, so `items.find(...)` returns `undefined` and the screen shows **"This item does not exist (anymore)."** with a **Back to the list** link (the header just says *Item*).

**The confirmation dialog does not appear in the browser.** Pressing *Remove this item* on the web does nothing: no dialog, and the item stays. `Alert.alert` is a native API (Android/iOS dialogs). On the web, React Native for Web's `Alert` is an empty function, so the callback that removes the item is never called. (See *Common errors*: "Alert dialogs only work on a device or emulator.")

## Exercise 8: the navigation map

```
                     _layout.tsx
        <ItemsProvider>  (owns `items` + addItem / toggleClaimed / removeItem)
                  └── <Stack>  (pile of screens)

 ┌────────────────────────────────┐   tap "+ Report an item"   ┌─────────────────────────────┐
 │  /           index.tsx         │ ─────────────────────────▶ │  /add        add.tsx        │
 │  "Lost & Found"                │    <Link href="/add">       │  "Report an item" (modal)   │
 │                                │                            │                             │
 │  uses: items                   │ ◀───────────────────────── │  uses: addItem              │
 │  (counter, list, waiting)      │   "Save" → addItem(...)     │                             │
 │                                │   then router.back()        │                             │
 └────────────────────────────────┘                            └─────────────────────────────┘
        │            ▲          ▲
        │ tap a card │          │ "Back to the list"  <Link href="/">
        │ <Link href │          │ (only when the id does not exist)
        │ /item/[id]>│          │
        ▼            │          │
 ┌───────────────────┴──────────┴──────────────────────────────┐
 │  /item/[id]   item/[id].tsx   title = item.title            │
 │                                                             │
 │  uses: items (find by id from useLocalSearchParams),        │
 │        toggleClaimed (Switch "Returned to its owner"),      │
 │        removeItem ("Remove this item" → Alert → Remove      │
 │                    → removeItem(id) then router.back())     │
 │  back arrow / router.back() → returns to /                  │
 └─────────────────────────────────────────────────────────────┘
```

| Screen | Reached from | Leads to | Context functions used |
|---|---|---|---|
| `/` (`index.tsx`) | app start, back from the other screens | `/add` (button), `/item/[id]` (tap a card) | `items` |
| `/add` (`add.tsx`) | `+ Report an item` on `/` | back to `/` after *Save* (`router.back()`) | `addItem` |
| `/item/[id]` (`item/[id].tsx`) | tap a card on `/` (or type the URL) | back to `/` (header arrow, after *Remove*, or *Back to the list*) | `items`, `toggleClaimed`, `removeItem` |
