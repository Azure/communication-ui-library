const path = require("path")

module.exports = ({ config }) => {

  config.resolve.modules = [
    path.resolve(__dirname, "..", "src"),
    "node_modules",
  ]

  return config
}