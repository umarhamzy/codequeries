import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import security from "eslint-plugin-security";

export default defineConfig([
  ...nextVitals,
  security.configs.recommended,
  {
    files: [
      "components/shared/search/GlobalSearch.tsx",
      "context/ThemeProvider.tsx",
    ],
    rules: { "react-hooks/set-state-in-effect": "warn" },
  },
]);
