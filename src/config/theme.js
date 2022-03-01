import { createTheme } from "@mui/material";

const basicTheme = createTheme({
  typography: {
    fontFamily: [
      "Roboto",
      "Verdana",
      "BlinkMacSystemFont",
      "-apple-system",
    ].join(","),
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // html: {
        //   height: "100%",
        // },
        body: {
          // backgroundColor: "rgba(255, 255, 255, 0.932)",
          // color: "rgba(0, 0, 0, 0.87)",
          // paddingTop: 16,
          // paddingBottom: 16,
          minWidth: 320,
          // minHeight: "100%",
        },
        code: {
          padding: ".2em .4em",
          margin: 0,
          fontSize: "85%",
          backgroundColor: "rgba(0, 0, 0, 0.08)",
          borderRadius: 8,
        },
      },
    },
  },
});

export default basicTheme;
