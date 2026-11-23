# TP 1: a first screen — answers

## Question 1

The `node_modules/` folder is listed in `.gitignore`, so it is never sent to GitHub. It is huge (hundreds of packages) and can always be rebuilt.

Someone who clones the project gets it back by running `npm install` in the project folder. npm reads `package.json` (the list of dependencies) and `package-lock.json` (the exact versions that were installed), then downloads the same packages again into a new `node_modules/`.
