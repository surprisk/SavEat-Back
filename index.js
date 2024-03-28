// MODULE
const express = require("express");
const path = require('path');
const fs = require('fs');
const cors = require('cors')

// GLOBAL VAR
global.config = {
  global: require('./config/config.global.json')
}

// MIDDLEWARE
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cors(config.global.CORS));

// 
const routesPath = path.join(__dirname, 'routes');
fs.readdir(routesPath, (err, routesFiles) => {

  try {

    err ?? new Error(`Unable to scan directory: ${err}`);

    const routesNotLoaded = [];

    const routesLoaded = config.global.ROUTES.LOAD.filter((routeName) => {
      const routeFullName = `route.${routeName}.js`;

      return routesFiles.includes(routeFullName) 
      ? (require(`${routesPath}/${routeFullName}`)(app), true)
      : (routesNotLoaded.push(routeName), false)
    })

    console.log('\x1b[32m', `\n✅ Routes successfully loaded: ${routesLoaded}`, '\x1b[0m');
    routesNotLoaded.length && console.warn('\x1b[33m', `\n🚨 Routes not loaded: ${routesNotLoaded}`, '\x1b[0m')

  } catch (err) {
    console.error(err);
  }

});

// -- API server definition
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('\x1b[35m', `\n🚀 Server is running on port ${PORT}.`, '\x1b[0m');
});