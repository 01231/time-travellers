import React, { useEffect, useState } from "react";
import { Link } from "@mui/material";

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
    <Link href={link} target="_blank" rel="noopener">
      Snapshot
    </Link>
  );
}

export default Vote;
