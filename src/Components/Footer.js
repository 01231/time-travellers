import { Toolbar, AppBar, IconButton, Box, Typography } from "@mui/material";
import { ReactComponent as LogoIcon } from "../assets/icons/logo.svg";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <AppBar
      position="static"
      color="transparent"
      component="footer"
      sx={{
        boxShadow: 0,
        border: 3,
        borderRadius: 2,
        mt: { xs: 1, sm: 6, md: 10 },
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          display: "flex",
          justifyContent: "space-between",
          pl: 2,
          pr: 2,
          pt: { xs: 2, md: "12px" },
          pb: { xs: 2, md: "12px" },
        }}
      >
        <IconButton
          size="large"
          aria-label="scroll to top"
          sx={{ p: 0, borderRadius: 1 }}
          href="/"
          onClick={scrollToTop}
          color="inherit"
        >
          <LogoIcon height="48px" />
        </IconButton>
        <Typography
          variant="body2"
          sx={{ textAlign: "end", fontWeight: "bold" }}
        >
          Copyright &copy; {new Date().getFullYear()}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;
