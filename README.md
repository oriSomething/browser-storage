# Browser Storage

Emulating [`Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Storage) API as in browsers. Unlike most implementations, it uses `Proxy` to support most possible usages and not only the explicit function calls.
It's good for testing. But it also good for environments that you need to polyfill `localStorage` (such as web workers), since it support utilities for injecting and observing properties change.

## Installation

```sh
pnpm install @orisomething/browser-storage
```

## Usuage

```js
import { BrowserStorage } from "@orisomething/browser-storage";

const storage = new BrowserStorage();

// You can (and should) use the Storage API methods
storage.setItem("hello", "world");
storage.getItem("hello") === "world"; // -> true

// But you can also have properties access as in the Storage instances
storage.hello === "world"; // -> true
```

If you need you can observe property changes:

```js
import {
  BrowserStorage,
  subscribePropertyChange,
  subscribeClear,
} from "@orisomething/browser-storage";

const storage = new BrowserStorage();

// Detect property change / remove
subscribePropertyChange(storage, (key, value) => {
  if (value === null) {
    console.log(`${key} was removed`);
  } else {
    console.log(`${key} changed to ${value}`);
  }
});

// Detect `Storage#clear()` call (regardless storage being empty)
subscribeClear(storage, () => {
  console.log("Storage was cleared");
});
```
