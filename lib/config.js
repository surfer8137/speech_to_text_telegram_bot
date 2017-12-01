yaml = require('js-yaml');
fs   = require('fs');

module.exports.data = function(){
  try {
    var doc = yaml.safeLoad(fs.readFileSync('config/config.yml', 'utf8'));

    return doc;
  } catch (e) {
    console.log(e);

    return 'error';
  }
}
