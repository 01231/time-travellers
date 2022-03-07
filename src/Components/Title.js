import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { HashLink } from "react-router-hash-link";

function Vote() {
  const [link, setLink] = useState("https://snapshot.org/#/3.spaceshot.eth");

  useEffect(() => {
    const base = "https://snapshot.org/#/3.spaceshot.eth/proposal/";

    const query = `
      query Proposals {
        proposals(
          first: 1,
          skip: 0,
          where: {
            space_in: ["3.spaceshot.eth"],
            state: "open"
          },
          orderBy: "created",
          orderDirection: desc
        ) {
          id
        }
      }
    `;

    try {
      fetch("https://hub.snapshot.org/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Accept: "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          query: query,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          const { proposals } = json.data;
          // console.log("bla", proposals, proposals.length, proposals[0]);
          if (proposals.length === 1) {
            setLink(base + proposals[0].id);
          }
        });
    } catch (err) {
      throw new Error(err.message);
    }
  }, []);

  return (
    <Box
      sx={{
        mt: { sm: 38, md: 28 },
        bottom: { xs: 0 },
        position: { xs: "absolute", sm: "relative" },
        mb: { xs: 10 },
        maxWidth: "425px",
      }}
    >
      <Typography variant="h1" sx>
        Time Travellers DAO
      </Typography>
      <Typography variant="subtitle1" component="p">
        We preserve history that matters! Vote and suggest your favourite Tweets
        and we keep them for eternity.
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: { xs: "column", sm: "row" },
          rowGap: 2,
          columnGap: 2,
          mt: 2,
          pr: { xs: 2, sm: 0 },
        }}
      >
        <Button
          variant="contained"
          to="/#propose"
          component={HashLink}
          sx={{ flexGrow: 1 }}
        >
          Suggest
        </Button>
        <Button
          href={link}
          target="_blank"
          rel="noopener"
          variant="outlined"
          color="secondary"
          sx={{ flexGrow: 1 }}
        >
          Vote on Snapshot
        </Button>
      </Box>
    </Box>
  );
}

export default Vote;
