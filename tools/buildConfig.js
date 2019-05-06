/**
 * buildConfig.js
 * 
 * What it does:
 *   This file takes all of the customization json files and wraps them
 *   into a single json string. It also packages route and page information
 *   from the backend and frontend directories.
 * 
 * Things to edit:
 *   Do not edit this file unless you really know what you're doing.
 *   If you have some complicated customization system that goes
 *   beyond what already exists you might have to change this
 *   file to include the customizations.
 */

const readDirectory = require('./readDirectory.js');
const findRootDirectory = require('./findRootDirectory.js');

const fs = require('fs');

module.exports = () => {
  let projectConfig = {
    pages: [],
    routes: [],
  };
  let root = findRootDirectory();
  readDirectory(root)
    .filter(path => (path.endsWith('koji.json') || path.includes('.koji')) && !path.includes('.koji-resources'))
    .forEach((path) => {
      try {
        const file = JSON.parse(fs.readFileSync(path, 'utf8'));

        Object.keys(file).forEach((key) => {
          // If the key already exists in the project config, use it
          if (projectConfig[key]) {
            if (Array.isArray(projectConfig[key]) && Array.isArray(file[key])) {
                projectConfig[key] = projectConfig[key].concat(file[key]);
            } else {
                projectConfig[key] = Object.assign(projectConfig[key], file[key]);
            }
          } else {
            // Otherwise, set it
            projectConfig[key] = file[key];
          }
        });

        // Create a map of backend routes by name
        projectConfig.backend = {};
        if (projectConfig.routes) {
            projectConfig.routes.forEach(({ name, route }) => {
                projectConfig.backend[name] = `${process.env.KOJI_BACKEND_URL}${route}`;
            });
        }
      } catch (err) {
        //
      }
    });

  return JSON.stringify(projectConfig);
}
