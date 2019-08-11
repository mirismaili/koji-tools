const fs = require('fs');
const buildConfig = require('./tools/buildConfig.js');

module.exports = () => {
    // escape our cached configs so koji editor can't store them
    const config = JSON.stringify({ config: JSON.parse(buildConfig()) }, null, 2);
    try {
        fs.writeFileSync(`${__dirname}/config.json`, config)
    } catch(err) {
        console.log(err);
    }
    console.log('new config');
}
