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

## Question 4

`keyExtractor` gives each row of the `FlatList` a **unique, stable key** (here the item's `id`). React uses this key to recognise each row between two renders. When the list changes (an item is added, removed or moved), it knows which card is which, so it only updates the rows that really changed instead of redrawing or mixing them up.

If two items have the same `id`, React prints a warning, *Encountered two children with the same key, `1`. Keys should be unique…*, and it can no longer tell the two rows apart. On later updates, a card can show the wrong content, be duplicated or disappear.

(Exercise 5.3: I added a fourth item, `Black umbrella` found at the `Main entrance`.)

## Question 5

Before adding, the counter shows **3 items reported** (the three `STARTER_ITEMS`). After filling both fields and pressing *Add item* it shows **4 items reported**, and the new item appears at the **top** of the list.

Once the item is added, **both fields are emptied**. The lines responsible are at the end of `addItem()`:

```tsx
setTitle('');
setPlace('');
```

This works because the inputs are *controlled*: each `TextInput` displays `value={title}` / `value={place}`. Setting the state back to `''` re-renders the screen, and the inputs show the empty string. (`setItems([newItem, ...items])` is the line that makes the counter and the list update.)

## Question 6

React only re-renders a component when its state is replaced by a **new value**, and it compares the old and new values by reference.

- `items.push(newItem)` **modifies the existing array in place** and does not call `setItems`. React is never told that something changed, so the screen is not re-rendered and the new item does not appear. Even `items.push(newItem); setItems(items)` would fail, because it is still the *same* array, so React thinks nothing changed.
- `setItems([newItem, ...items])` builds a **new array** (the new item, then a copy of all the old ones) and hands it to React through the setter. React sees a different array, re-renders, and the list and counter update. State should be treated as **immutable**: never modify it, replace it.

## Question 7

With `useState<Item[]>([])` the list starts empty. The screen shows the counter **0 items reported**, the form, and, in place of the cards, the text **"Nothing reported yet."** This text comes from the `ListEmptyComponent` prop of the `FlatList`, which is only rendered when `data` is empty.

Why it matters: a blank area looks like a bug (is it still loading? did it crash?). An *empty state* tells users the app works and the list simply has nothing in it yet, and it can tell them what to do next (here, report an item with the form above). `STARTER_ITEMS` was put back afterwards.

## Exercise 8: my own style

Changes in the `styles` of `src/components/ItemCard.tsx`:

- **border radius**: `card.borderRadius` from `12` to `16` (rounder cards);
- **colour + border**: a blue accent stripe on the left of each card (`borderLeftWidth: 5`, `borderLeftColor: '#2563eb'`, the same blue as the button);
- **size and weight**: `title.fontSize` from `18` to `20`, `title.fontWeight` from `'600'` to `'700'`, plus a darker title colour `#111827`;
- **place line**: `marginTop` from `4` to `6` and a slightly darker grey `#4b5563`.
