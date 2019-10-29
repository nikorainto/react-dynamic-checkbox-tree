# Local development

## Usage

### Install dependencies

Both in the root and in this folder

```
yarn install
cd development && yarn install
```

Using npm:

```
npm install
cd development && npm install
```

Start babel transpiler with watch mode in root folder (console #1)

```
yarn dev / npm run dev
```

Run dev server in development folder (console #2)

(this opens the app in a new browser tab)

```
cd development && npm start
```

Now you can make changes to the data and the babel will handle transpiling and live reloading automatically on the client
