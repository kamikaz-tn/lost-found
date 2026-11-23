# TP 2: several screens — answers

## Question 1

Message shown when hovering `STARTER_ITEMS` in `src/app/index.tsx`:

> `Property 'claimed' is missing in type '{ id: string; title: string; place: string; }' but required in type 'Item'. ts(2741)`

Why: in exercise 1.1 we added `claimed: boolean` to the `Item` type in `src/types.ts`. The field has no `?`, so it is **required**. The old `STARTER_ITEMS` array in `index.tsx` is still declared as `Item[]`, but its objects only have `id`, `title` and `place`, so they no longer match the type. (The same error appears on the `newItem: Item` built in `addItem`.)

The app still runs because TypeScript types are erased when the code is bundled: they only exist in the editor and at type-check time. The error disappears in exercise 3, when `index.tsx` is replaced and reads the list from the context, whose `STARTER_ITEMS` all have a `claimed` field.
