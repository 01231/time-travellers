import { createTheme } from "@mui/material";

const basicTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ca3e6d",
    },
  },
  typography: {
    fontFamily: [
      "Roboto",
      "Verdana",
      "BlinkMacSystemFont",
      "-apple-system",
    ].join(","),
    h2: {
      fontSize: 24,
      textAlign: "center",
      fontWeight: "700",
      textTransform: "uppercase",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        sizeMedium: {
          fontSize: 24,
          fontWeight: 700,
        },
        sizeLarge: {
          fontSize: 27,
          fontWeight: 700,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          textTransform: "uppercase",
          fontWeight: 700,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        // html: {
        //   height: "100%",
        // },
        body: {
          // color: "rgba(255, 255, 255, 0.932)",
          // backgroundColor: "rgba(0, 0, 0, 0.87)",
          // paddingTop: 16,
          // paddingBottom: 16,
          minWidth: 320,
          // minHeight: "100%",
        },
        code: {
          padding: ".2em .4em",
          margin: 0,
          fontSize: "85%",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderRadius: 8,
        },
      },
    },
  },
});

export default basicTheme;
