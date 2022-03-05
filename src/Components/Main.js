import React, { useRef, useEffect, useState } from "react";
import { Container, Typography, Box, Grid } from "@mui/material";
import GLOBE from "vanta/dist/vanta.globe.min";

import Calendar from "./Calendar";
import Header from "./Header";
import Footer from "./Footer";
import Propose from "./Propose";
import Vote from "./Vote";

function Main({ account, network, getAccount, provider }) {
  const [vantaEffect, setVantaEffect] = useState(0);

  const myRef = useRef(null);
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        GLOBE({
          el: myRef.current,
          mouseControls: false,
          touchControls: false,
          gyroControls: false,
          scale: 1.0,
          scaleMobile: 1.0,
          zoom: 0.65,
          color: 0xca3e6d,
          size: 0.8,
          backgroundColor: 0x131318,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: "100%",
          top: 0,
          left: 0,
          right: 0,
          zIndex: -1,
          position: "absolute",
        }}
        ref={myRef}
      />
      <Header />
      <Grid container>
        <Grid item xs={12} sx={{ height: "100vh" }}>
          <Typography variant="h1" sx={{ mt: 28 }}>
            Time Travellers DAO
          </Typography>
          <Typography variant="subtitle1" component="p">
            Preserving history!
          </Typography>
        </Grid>
        <Grid id="time-machine" item xs={12}>
          <Typography variant="h2" sx={{ mt: 4, mb: 2 }}>
            Time Machine
          </Typography>
          <Calendar provider={provider} sx={{ pt: 100 }} />
        </Grid>
        <Grid id="vote" item xs={12}>
          <Typography variant="h2" sx={{ mt: 4, mb: 2 }}>
            Vote
          </Typography>
          <Vote />
        </Grid>
        <Grid id="propose" item xs={12}>
          <Typography variant="h2" sx={{ mt: 4, mb: 2 }}>
            Propose
          </Typography>
          <Propose
            account={account}
            network={network}
            getAccount={getAccount}
          />
        </Grid>
        <Grid id="faq" item xs={12}>
          <Typography variant="h2" sx={{ mt: 4, mb: 2 }}>
            FAQ
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Footer />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Main;
