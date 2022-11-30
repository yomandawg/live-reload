# live-reload

a node.js live-reloader to prepare for remote device webapp debugging

will be integrated with `chrome://inspect/#devices` network target (in the future 😅)

**default watchfile - `public/index.js`**

## Usage

```bash
# optional
npm -g list --depth=0 | grep 'nodemon@' || exec sh -c "npm install -g nodemon"

npm ci

npm run start
```

app will be running on `127.0.0.1:3000`
