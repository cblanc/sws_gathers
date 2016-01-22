exports.config = {
  // See http://brunch.io/#documentation for docs.
  files: {
    javascripts: {
      joinTo: {
        "app.js": /^(app)/,
        "vendor.js": /^(vendor|node_modules)/
      }
    },
    stylesheets: {
      joinTo: {
        "app.css": /^(app|vendor|node_modules)/
      }
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
    styles: {
      "bootstrap": ["dist/css/bootstrap.min.css"]
    },
    whitelist: ["react", "react-dom", "jquery", "lodash", 
      "react-autolink-text", "react-dom", "react-emoji",
      "bootstrap", "bootstrap-slider"],
    globals: {
      "_": "lodash",
      "jQuery": "jquery",
      "$": "jquery"
    }
  },

  notifications: true
};
