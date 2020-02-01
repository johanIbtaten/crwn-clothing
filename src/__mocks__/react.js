// Permet de fixer le bug de React.memo avec shallow() de enzyme
const react = require("react");
module.exports = { ...react, memo: x => x };