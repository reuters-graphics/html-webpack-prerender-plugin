![](../badge.svg)

# Plugin options

### Configuration shorthands

html-webpack-ssr-plugin allows for several configuration shorthands. We'll explain the component parts of each, but these are all equivalent configurations:

```javascript
new HtmlWebpackSsrPlugin({ main: '#root' });
```

```javascript
new HtmlWebpackSsrPlugin({
  'index.html': {
    main: '#root',
  },
});
```

```javascript
new HtmlWebpackSsrPlugin({
  'index.html': {
    main: {
      selector: '#root',
      scope: {},
      props: {},
      injectPropsTo: false,
    },
  }
});
```

### Parts: Rendering context

Let's breakdown the parts of the innermost configuration object, the rendering context object.

```javascript
new HtmlWebpackSsrPlugin({
  'index.html': {
    main: { // 👇 Rendering context object
      selector: '#root',
      scope: {},
      props: {},
      injectPropsTo: false,
    },
  }
});
```

#### `selector`

A CSS selector for the container your app will be rendered into. For example, a template like this...

```html
<body>
  <div id='my-app'></div>
</body>
```

... and a configuration like this ...
```javascript
{
  selector: '#my-app',
}
```

... will render like this ...

```html
<body>
  <div id='my-app'>
    <!-- Your app markup will be rendered here. -->
  </div>
</body>
```

**Keep in mind** the plugin will remove any children from this container your selector grabs before injecting your rendered markup, so generally it's a bad idea to use the `body` tag. Instead, supply a template to html-webpack-plugin that includes a custom root container node for your app.

#### `scope`

An object that will be added to the globals when evaluating your app code in a node context. By default scope will include [jsdom](https://github.com/jsdom/jsdom) `window` and `document` instances:

```javascript
const { window } = new JSDOM(templateHTML);
const { document } = window;

const scope = { window, document };
```

You can also use it to add any necessary context to make your script work in both a browser and node context:

```javascript
const requestAnimationFrame = require('raf');

module.exports = {
  // ...
  plugins: [
    // ...
    new HtmlWebpackSsrPlugin({
      main: {
        selector: '#root',
        scope: { requestAnimationFrame },
      },
    }),
  ]
};
```


#### `props`

An object passed to your app's default render function. For example, a configuration like this...

```javascript
{
  props: { title: 'My title'},
}
```

... and an app like this ...

```javascript
export default (props) => `<h1>${props.title}</h1>`;
```

... will render like this ...

```html
<h1>My title</h1>
```

#### `injectPropsTo`

This string will be used to create a global variable in your app that will contain the value of your props, which is useful when hydrating a dynamic app with a preloaded state. For example, this setup...

```javascript
{
  props: { title: 'My title' },
  injectPropsTo: '__PRELOADED_STATE__',
}
```

... will render and inject this script tag into your page ...

```html
<script>
window.__PRELOADED_STATE__ = { title: 'My title'};
</script>
```

### Parts: Pointer properties

Outside the rendering context, pointer properties tell the plugin what and where to inject your app.

```javascript
new HtmlWebpackSsrPlugin({
  // 👇 Filename pointer
  'index.html': {
    // 👇 Entry pointer
    main: { ... },
  }
});
```

#### Entry pointer

The entry pointer points at a specific entry for the the app the plugin will render and inject into your page.

By default, your entry is `main`...

```javascript
module.exports = {
  entry: './js/index.js',
  // ...
  plugins: [
    // ...
    new HtmlWebpackSsrPlugin({
      'index.html': {
        // 👇 Default entry name
        main: '#root',
      }
    }),
  ],
};
```

... but you can use this to select specific chunks ...

```javascript
module.exports = {
  entry: {
    app: './js/index.js',
    someOtherApp: './js/other.js',
  },
  // ...
  plugins: [
    // ...
    new HtmlWebpackSsrPlugin({
      'index.html': {
        // 👇 Entry chunk name
        app: '#root',
      }
    }),
  ],
};
```

#### Filename pointer

Tells the plugin what page to inject the app into. This should be the same as `filename` property used in `html-webpack-plugin`. For example:

```javascript
[
  new HtmlWebpackPlugin({
    filename: 'cutom-page-name.html',
    template: './templates/index.html',
  }),
  new HtmlWebpackSsrPlugin({
    'custom-page-name.html': { main: '#root' }
  }),
]
```

And like in `html-webpack-plugin`, you can omit the filename pointer and it will be assumed to be `index.html`.

```javascript
[
  new HtmlWebpackPlugin({
    template: './templates/index.html',
  }),
  new HtmlWebpackSsrPlugin({ main: '#root' }),
]
```

You can also use this property to skip pages in your compilation.

```javascript
[
  new HtmlWebpackPlugin({
    filename: 'about.html',
    template: './templates/about.html',
  }),
  new HtmlWebpackPlugin({
    filename: 'page.html',
    template: './templates/index.html',
  }),
  new HtmlWebpackSsrPlugin({
    'page.html': { main: '#root' }
  }),
]
```

### Combined

In combination, these pointers can be used to create complex configurations. For example, this configuration will render 3 apps in 2 pages, with a page specific app and a header on each page.

```javascript
module.exports = {
  entry: {
    aboutApp: './js/about/index.js',
    pageHeader: './js/header/index.js',
    pageApp: './js/page/index.js',
  },
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'page.html',
      template: './templates/page.html',
      excludeChunks: ['aboutApp'],
    }),
    new HtmlWebpackPlugin({
      filename: 'about.html',
      template: './templates/about.html',
      excludeChunks: ['pageApp'],
    }),
    new HtmlWebpackSsrPlugin({
      'about.html': {
        aboutApp: '#app-root',
        pageHeader: {
          selector: '#header-root',
          props: { activePage: 'about' },
        },
      },
      'page.html': {
        pageApp: '#app-root',
        pageHeader: {
          selector: '#header-root',
          props: { activePage: 'page' },
        },
      }
    }),
  ],
};
```
