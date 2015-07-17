var select = require("select-dom");
var style = require("style-dom");

var CSS = {
  position: 'absolute',
  top: '-9999px',
  left: '-9999px'
};

module.exports = hide;

function hide (el) {
  if (typeof el == 'string') el = select(el);

  style(el, CSS);
}
