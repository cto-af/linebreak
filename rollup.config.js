import nodeResolve from "@rollup/plugin-node-resolve";

export default {
  input: "lib/index.js",
  output: {
    file: "dist/index.cjs",
    format: "cjs",
  },
  plugins: [nodeResolve()],
};
