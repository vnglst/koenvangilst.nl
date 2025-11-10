---
title: Using React Hooks with canvas
publishedAt: '2019-03-16'
image:
  src: /static/images/hooks.jpg
  alt: Badly drawn letters spelling HOOKS
  width: 916
  height: 387
  showAsHeader: true
summary: 'An intro to the React hooks useState, useRef and useEffect'
tags:
  - article
  - react
  - hooks
  - canvas
date: '2019-03-16'
layout: layouts/post.njk
permalink: /lab/react-hooks-with-canvas/
---

<Disclaimer>
  This tutorial, written in March 2019, comes shortly after the release of React
  Hooks. It embodies the enthusiasm of that time, leading to an overemphasis on
  certain hooks. Looking back, I recognize that using useEffect so extensively
  isn't in line with current best practices. Today, I'd recommend handling side
  effects within event handler functions. Nevertheless, this tutorial is still a
  useful resource for grasping the fundamentals of hooks and learning how to
  assemble them into custom hooks.
</Disclaimer>

In this tutorial, I will use React Hooks to create an html canvas drawing website. I will start from zero using the _Create React App_ starter kit. The [resulting app](https://han-hooks.netlify.com/) offers basic features like `Clear`, `Undo` and saves drawings using localStorage.

With this tutorial, I'd like to show you how hooks make the composition and reuse of stateful logic possible using _custom hooks_.

## Basic setup

We'll start by creating a new React app using `create-react-app`.

```bash
npx create-react-app canvas-and-hooks
cd canvas-and-hooks/
yarn start
```

Your browser should open `http://localhost:3000/` and you should see a spinning React logo. You're now ready to go!

## 1st hook: useRef

Open the file `src/App.js` in your favorite editor and replace the contents with the following code:

```jsx

function App() {
  return (
    <canvas
      width={window.innerWidth}
      height={window.innerHeight}
      onClick={(e) => {
        alert(e.clientX);
      }}
    />
  );
}

```

Clicking somewhere in the open browser window should now display an alert popup, telling you the x coordinate of the mouse click.

Great, it works!

Now let's draw something. For that, we need a `ref` to the canvas element and our first hook `useRef` is going to help us with that.

```jsx {4,11,12,13}

function App() {
  const canvasRef = React.useRef(null);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onClick={(e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        // implement draw on ctx here
      }}
    />
  );
}

```

Normally in React you don't need a `ref` to update something, but the canvas is not like other DOM elements. Most DOM elements have a property like `value` that you can update directly. The canvas works with a context (`ctx` in our app) that allows you to draw things. For that, we have to use a `ref`, which is a reference to the actual canvas DOM element.

Now that we have the canvas context it's time to draw something. For that, I'm going to copy-paste the code that draws an SVG hook. It's got nothing to do with hooks, so don't worry if you don't fully understand it.

```jsx {3-18,31}

const HOOK_SVG =
  'm129.03125 63.3125c0-34.914062-28.941406-63.3125-64.519531-63.3125-35.574219 0-64.511719 28.398438-64.511719 63.3125 0 29.488281 20.671875 54.246094 48.511719 61.261719v162.898437c0 53.222656 44.222656 96.527344 98.585937 96.527344h10.316406c54.363282 0 98.585938-43.304688 98.585938-96.527344v-95.640625c0-7.070312-4.640625-13.304687-11.414062-15.328125-6.769532-2.015625-14.082032.625-17.960938 6.535156l-42.328125 64.425782c-4.847656 7.390625-2.800781 17.3125 4.582031 22.167968 7.386719 4.832032 17.304688 2.792969 22.160156-4.585937l12.960938-19.71875v42.144531c0 35.582032-29.863281 64.527344-66.585938 64.527344h-10.316406c-36.714844 0-66.585937-28.945312-66.585937-64.527344v-162.898437c27.847656-7.015625 48.519531-31.773438 48.519531-61.261719zm-97.03125 0c0-17.265625 14.585938-31.3125 32.511719-31.3125 17.929687 0 32.511719 14.046875 32.511719 31.3125 0 17.261719-14.582032 31.3125-32.511719 31.3125-17.925781 0-32.511719-14.050781-32.511719-31.3125zm0 0';
const HOOK_PATH = new Path2D(HOOK_SVG);
const SCALE = 0.3;
const OFFSET = 80;

function draw(ctx, location) {
  ctx.fillStyle = 'deepskyblue';
  ctx.shadowColor = 'dodgerblue';
  ctx.shadowBlur = 20;
  ctx.save();
  ctx.scale(SCALE, SCALE);
  ctx.translate(location.x / SCALE - OFFSET, location.y / SCALE - OFFSET);
  ctx.fill(HOOK_PATH);
  ctx.restore();
}

function App() {
  const canvasRef = React.useRef(null);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onClick={(e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        draw(ctx, { x: e.clientX, y: e.clientY });
      }}
    />
  );
}

```

All this does is draw an SVG shape (a fishing hook!) on position `x` and `y`. As it's not relevant to this tutorial I will omit it from now on.

Try it out, and see if it works!

## 2nd hook: useState

The next features we'd like to add are the `Clean` and `Undo` buttons. For that, we need to keep track of the user interactions with the `useState` hook.

```jsx {8,19-20}

// ...
// canvas draw function
// ...

function App() {
  const [locations, setLocations] = React.useState([]);
  const canvasRef = React.useRef(null);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onClick={(e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const newLocation = { x: e.clientX, y: e.clientY };
        setLocations([...locations, newLocation]);
        draw(ctx, newLocation);
      }}
    />
  );
}

```

There! We've added state to our app. You can verify this by adding a `console.log(locations)` just above the `return`. In the console, you should see a growing array of user clicks.

## 3rd hook: useEffect

Currently, we're not doing anything with that state. We're drawing the hooks just like we did before. Let's see how we can fix this with the `useEffect` hook.

```jsx {11-16}

// ...
// canvas draw function
// ...

function App() {
  const [locations, setLocations] = React.useState([]);
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, window.innerHeight, window.innerWidth);
    locations.forEach((location) => draw(ctx, location));
  });

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onClick={(e) => {
        const newLocation = { x: e.clientX, y: e.clientY };
        setLocations([...locations, newLocation]);
      }}
    />
  );
}

```

A lot is going on here so let's break it down. We've moved the drawing function from the onClick handler to the `useEffect` callback. This is important because drawing on the canvas is a _side effect_ determined by the app state. Later we'll add persistency using localStorage, which will also be a side effect of state updates.

I've also made a few changes to the actual drawing on the canvas itself. In the current implementation, every render first clears the canvas and then draws all the locations. We could be smarter than that, but to keep it simple I'll leave it to the reader to further optimize this.

We've done all the hard work, and adding the new feature should be easy now. Let's create the `Clear` button.

```jsx {18-21,23-25,29}

// ...
// canvas draw function
// ...

function App() {
  const [locations, setLocations] = React.useState([]);
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, window.innerHeight, window.innerWidth);
    locations.forEach((location) => draw(ctx, location));
  });

  function handleCanvasClick(e) {
    const newLocation = { x: e.clientX, y: e.clientY };
    setLocations([...locations, newLocation]);
  }

  function handleClear() {
    setLocations([]);
  }

  return (
    <>
      <button onClick={handleClear}>Clear</button>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleCanvasClick}
      />
    </>
  );
}

```

The Clear feature is just a simple state update: we clear the state by setting it to an empty array `[]`. That was easy, right?

I've also taken the opportunity to clean up a bit, by moving the canvas `onClick` handler to a separate function.

Let's do another feature: the `Undo` button. Same principle, even though this state update is a bit more tricky.

```jsx {27-29}

// ...
// canvas draw function
// ...

function App() {
  const [locations, setLocations] = React.useState([]);
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, window.innerHeight, window.innerWidth);
    locations.forEach((location) => draw(ctx, location));
  });

  function handleCanvasClick(e) {
    const newLocation = { x: e.clientX, y: e.clientY };
    setLocations([...locations, newLocation]);
  }

  function handleClear() {
    setLocations([]);
  }

  function handleUndo() {
    setLocations(locations.slice(0, -1));
  }

  return (
    <>
      <button onClick={handleClear}>Clear</button>
      <button onClick={handleUndo}>Undo</button>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleCanvasClick}
      />
    </>
  );
}

```

Since any state update in React has to be immutable, we can't use something like `locations.pop()` to remove the most recent item from the array. We have to do it without changing the original `locations` array. The way to do this is with `slice`, i.e. by slicing off all the elements up until the last one. You can do that with `locations.slice(0, locations.length - 1)`, but `slice` is smart enough to interpret `-1` as the last item in the array.

Before we continue, let's clean up the HTML and add some CSS. Add the following `div` around the buttons:

```jsx {3,14,17}

import './App.css';

// ...
// canvas draw function
// ...

function App() {
  // ...

  return (
    <>
      <div className="controls">
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleUndo}>Undo</button>
      </div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleCanvasClick}
      />
    </>
  );
}

```

And replace the CSS in `App.css` with the following:

```css
*,
*:before,
*:after {
  box-sizing: border-box;
}

body {
  background-color: black;
}

.controls {
  position: absolute;
  top: 0;
  left: 0;
}

button {
  height: 3em;
  width: 6em;
  margin: 1em;
  font-weight: bold;
  font-size: 0.5em;
  text-transform: uppercase;
  cursor: pointer;
  color: white;
  border: 1px solid white;
  background-color: black;
}

button:hover {
  color: black;
  background-color: #00baff;
}

button:focus {
  border: 1px solid #00baff;
}

button:active {
  background-color: #1f1f1f;
  color: white;
}
```

Looking good, let's get started on the next feature: persistence!

## Adding localStorage

As mentioned before, we also want our drawings to be saved to `localStorage`. As this is another side effect, we'll add another `useEffect`.

```jsx {8-10,20-22}

import './App.css';

// ...draw function

function App() {
  const [locations, setLocations] = React.useState(
    JSON.parse(localStorage.getItem('draw-app')) || []
  );
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, window.innerHeight, window.innerWidth);
    locations.forEach((location) => draw(ctx, location));
  });

  React.useEffect(() => {
    localStorage.setItem('draw-app', JSON.stringify(locations));
  });

  function handleCanvasClick(e) {
    const newLocation = { x: e.clientX, y: e.clientY };
    setLocations([...locations, newLocation]);
  }

  function handleClear() {
    setLocations([]);
  }

  function handleUndo() {
    setLocations(locations.slice(0, -1));
  }

  return (
    <>
      <div className="controls">
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleUndo}>Undo</button>
      </div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleCanvasClick}
      />
    </>
  );
}

```

We've now completed all the features we set out to build, but we're not done yet. **One of the coolest things about hooks is that you can use existing hooks to compose new custom hooks.** Let me demonstrate this by creating a custom `usePersistentState` hook.

## 1st custom hook: usePersistentState

```jsx {8-18,21}

import './App.css'

// ...draw function

// our first custom hook!
function usePersistentState(init) {
  const [value, setValue] = React.useState(
    JSON.parse(localStorage.getItem('draw-app')) || init
  )

  React.useEffect(() => {
    localStorage.setItem('draw-app', JSON.stringify(value))
  })

  return [value, setValue]
}

function App() {
  const [locations, setLocations] = usePersistentState([])
  const canvasRef = React.useRef(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, window.innerHeight, window.innerWidth)
    locations.forEach(location => draw(ctx, location))
  })

  function handleCanvasClick(e) {
    const newLocation = { x: e.clientX, y: e.clientY }
    setLocations([...locations, newLocation])
  }

  function handleClear() {
    setLocations([])
  }

  function handleUndo() {
    setLocations(locations.slice(0, -1))
  }

  return (
    // ...
  )
}

```

There! We've created our first custom hook and all the logic that relates to saving and getting the state from _localStorage_ is extracted from the _App_ component. And we did this in a way that the hook `usePersistentState` can be reused by other components. There's nothing in there that's specific for this component.

Let's repeat this trick for the logic that relates to the canvas.

## 2nd custom hook: usePersistentCanvas

```jsx {20-33,36}

import './App.css';

// ...draw function

// our first custom hook
function usePersistentState(init) {
  const [value, setValue] = React.useState(
    JSON.parse(localStorage.getItem('draw-app')) || init
  );

  React.useEffect(() => {
    localStorage.setItem('draw-app', JSON.stringify(value));
  });

  return [value, setValue];
}

// our second custom hook: a composition of the first custom hook and React's useEffect + useRef
function usePersistentCanvas() {
  const [locations, setLocations] = usePersistentState([]);
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    locations.forEach((location) => draw(ctx, location));
  });

  return [locations, setLocations, canvasRef];
}

function App() {
  const [locations, setLocations, canvasRef] = usePersistentCanvas();

  function handleCanvasClick(e) {
    const newLocation = { x: e.clientX, y: e.clientY };
    setLocations([...locations, newLocation]);
  }

  function handleClear() {
    setLocations([]);
  }

  function handleUndo() {
    setLocations(locations.slice(0, -1));
  }

  return (
    <>
      <div className="controls">
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleUndo}>Undo</button>
      </div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleCanvasClick}
      />
    </>
  );
}

```

As you can see our _App_ component has become quite small. All the logic that is related to storing the state in localStorage and drawing on the canvas is extracted to custom hooks. You could clean up this file even further by moving the hooks into a _hooks_ file. That way other components could reuse this logic, for instance, to compose even better hooks.

## Conclusions

What makes hooks so special if you compare them to the lifecycle methods (like `componentDidMount`, `componentDidUpdate`)? Looking at the examples above:

- hooks allow you to **reuse** lifecycle logic in different components
- with hooks, you can use **composition** to create richer custom hooks, just like you can use composition to create richer UI components
- hooks are **shorter and cleaner** - no more bloated, and sometimes confusing, lifecycle methods

It's still too early to tell whether hooks are going to solve all these problems - and what new bad practices might arise from them - but looking at the above I'm pretty excited and optimistic for React's future!

Let me know what you think! You can reach me on Twitter using [@vnglst](https://twitter.com/vnglst).

<iframe
  src="https://codesandbox.io/embed/github/vnglst/react-hooks-canvas/tree/master/?fontsize=14"
  loading="lazy"
  style={{
    width: '100%',
    height: '500px',
    border: 0,
    borderRadius: '4px',
    overflow: 'hidden'
  }}
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

[Source code is also available on Github.](https://github.com/vnglst/react-hooks-canvas)
