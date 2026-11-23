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

## Question 8

The same code runs in the browser (press **w**), and adding an item works the same way: the counter goes from 3 to 4 and the fields are emptied. Visual differences compared with the Android emulator:

- **Text and font**: the browser draws the text with its own font (system web font), so letters, widths and the 📍 emoji look slightly different from Android's Roboto and Noto emoji.
- **No phone frame**: there is no Android status bar (clock, battery) or navigation bar, the page fills the browser window, and the header just shows `index`.
- **Inputs**: clicking a field in the browser draws the browser's own focus outline around it and shows a text cursor/mouse pointer. On Android you get the native underline/cursor and the on-screen keyboard instead.

## Bonus: long press to remove

In `src/app/index.tsx`, each `ItemCard` is wrapped in a `Pressable` with `onLongPress`, which calls `removeItem(item.id)`. That function builds a **new** list without that item: `setItems(items.filter((item) => item.id !== id))`. Holding a card for about half a second removes it, and the counter goes down by one.

## Final questions

**1. What is the difference between a prop and state?**
A **prop** is a value passed *into* a component by its parent, like the arguments of a function (`<ItemCard title="…" place="…" />`). The component only reads its props and cannot change them. **State** is data a component *owns and manages itself* with `useState` (`items`, `title`, `place` in `index.tsx`). It changes over time through its setter (`setItems`, `setTitle`…), and every change re-renders the component. A parent's state is often passed down to children as props.

**2. Why must every piece of text be inside `<Text>`?**
React Native has no HTML and no browser. Each component is turned into a real native widget. `<View>` becomes a plain container (`android.view.View` / `UIView`) that cannot draw text. Only `<Text>` becomes a native text widget (`TextView` / `UILabel`) that knows how to draw letters, fonts and colours. Loose text has nothing to be drawn with, so React Native refuses it with *Text strings must be rendered within a &lt;Text&gt; component.*

**3. What does `FlatList` do better than writing the cards one by one?**
- It builds the cards **from the data** (`data` + `renderItem`), so adding or removing an item in the array is enough: no copy-pasted JSX.
- It is **virtualised**: it only renders the rows visible on screen (plus a few around them) and recycles them while scrolling, so a list of thousands of items stays fast and light in memory.
- It scrolls by itself and has built-in extras: `keyExtractor` (stable keys), `ItemSeparatorComponent`, `ListEmptyComponent`, headers and footers, pull-to-refresh, infinite loading (`onEndReached`).
