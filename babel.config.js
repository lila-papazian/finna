module.exports = {
  presets: [
    ["@babel/preset-env", {targets: {node: 'current'}}],
    "@babel/preset-typescript",
    [
      "@babel/preset-react",
      {
        runtime: "automatic" // works with React 17+ JSX transform
      }
    ]
  ],
};
