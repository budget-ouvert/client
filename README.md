# Rainbow Visualisation

## Introduction

This is a react-redux-based client for RainbowViz. It is built using Webpack. You can start the app by running npm start, which will basically build a webpack bundle and serve it on a specified port.

## Installation

Simply clone the repo and run

```
npm install
npm start
```

## Code organisation

## Webpack

The Webpack config file is located at `./webpack.config.js`. It mainly calls two files: `./src/index.html` and `./src/application/app.tsx` which are the root files to all other files of the application.

### Redux
Redux is used to manage the application's state.
All redux actions, middlewares and reducers are located under `./src/application/{actions, middlewares, reducers}.tsx`.
I personally read this course so as to understand what Redux is and how it works: [https://github.com/happypoulp/redux-tutorial](https://github.com/happypoulp/redux-tutorial)

### React
React routes are defined in `./src/application/routes.tsx`. Links between React and Redux are made in `./src/application/app.tsx`.

* All reusable React components are stored under `./src/application/components`.
* All views of this application are React components and are stored under XXX.

### Mock data

Fake data is used to populate this web app. All mock data is present in `./src/application/mockdata/`.
