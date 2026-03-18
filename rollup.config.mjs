import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/ha-notification-card.js",
  output: {
    file: "dist/ha-notification-card.js",
    format: "es",
  },
  plugins: [resolve(), terser()],
};
