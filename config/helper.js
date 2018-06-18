var path = require('path');

var _root = path.resolve(__dirname, '..');

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  console.log(path.join.apply(path, [_root].concat(args)));
  return path.join.apply(path, [_root].concat(args));
}

exports.root = root;