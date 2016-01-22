exports.config = {
  // See http://brunch.io/#documentation for docs.
  files: {
    javascripts: {
      joinTo: {
        'app.js': /^(app|node_modules)/,
        'vendor.js': /^vendor/
      }
    },
    stylesheets: {
      joinTo: "app.css"
    },
    templates: {
      joinTo: "app.js"
    }
  },

  conventions: {
    // This option sets where we should place non-css and non-js assets in.
    assets: /^app\/images/
  },

  paths: {
    // Dependencies and current project directories to watch
    watched: [
      "app/javascripts",
      "app/stylesheets",
      "vendor"
    ]
  },

  // Configure your plugins
  plugins: {
    babel: {
      presets: ["es2015", "react"],
      // Do not use ES6 compiler in vendor code
      ignore: [/web\/static\/vendor/]
    }
  },

  // Default behaviour.
  // modules: {
  //   autoRequire: {
  //     'app.js': ['app']
  //   }
  // },

  npm: {
    enabled: true,
    whitelist: ["react", "react-dom", "jquery", "lodash"],
    globals: {
      "_": "lodash",
      "jQuery": "jquery",
      "$": "jquery"
    }
  },

  notifications: true
};
