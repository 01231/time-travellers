import { Box } from "@mui/material";
import React from "react";
import FaqElement from "./FaqElement";

const faqs = [
  {
    summary: "How can I become part of Time Travellers DAO?",
    detail:
      "To be part of our community you need to hold TTT, which is our own governance tokens",
  },
  {
    summary: "Where can I get TTT?",
    detail: "TODO: ",
  },
  {
    summary: "How can I vote on Proposals?",
    detail:
      "All DAO members are allowed to vote on proposals. Your voting power is dependant on how many tokens you hold.",
  },
  {
    summary: "What happens to the NFT that received the most votes?",
    detail:
      "The NFT will be minted to the address from which the NFT was suggested.",
  },
  {
    summary:
      "Why can't I vote on the proposal even though I hold TTT in my wallet?",
    detail:
      "You need to hold the tokens for at least one week. With this method the DAO can ensure the quality of the votes. (This feature is turned off for demonstration purposes)",
  },
];

function Faq() {
  return (
    <Box>
      {faqs.map((el, i) => (
        <FaqElement key={faqs[i].summary} {...faqs[i]} />
      ))}
    </Box>
  );
}

export default Faq;
