"use client";
import { createTheme } from "@mui/material/styles";
import { faIR as coreLocale } from "@mui/material/locale";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { Children } from "@/interface";
import { faIR } from '@mui/x-data-grid/locales';

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

export const Rtl = (props: Children) => {
  return <CacheProvider value={cacheRtl}>{props.children}</CacheProvider>;
};
export const theme = createTheme(
  {
    direction: "rtl",
    palette: {
      background: {
        default: "#f5f5f5",
      },
    },
    typography: {
      fontFamily: "Vazir",
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'Vazir';
            font-style: normal;
            font-display: swap;
            font-weight: 400;
            src: local('Vazir'), local('Vazir-Regular'), url(/font/Vazir-Regular.woff2) format('woff2');
          }
        `,
      },
      MuiButton: {
        defaultProps: {
          variant: "contained",
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "filled",
        },
      },
    },
  },
  faIR,
  coreLocale
);
