import { Button, Frog } from "frog";
import { neynar } from "frog/hubs";

// this is temporary, before we add authorization + smart contract
const endpoint = "https://worker-misty-voice-905f.artlu.workers.dev/?fid=";
const FRAMECHAIN_TOKEN = "serverside_token_for_allowlist";
const NEYNAR_API_KEY = "NEYNAR_FROG_FM";

export const app = new Frog({
  hub: neynar({ apiKey: NEYNAR_API_KEY }),
});

app.frame("/", (c) => {
  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(to right, #432889, #17101F)",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          Welcome!
        </div>
      </div>
    ),
    intents: [
      <Button.AddCastAction action="/add-bookmark">
        Add Bookmark Action
      </Button.AddCastAction>,
    ],
  });
});

app.castAction(
  "/add-bookmark",
  async (c) => {
    const { verified, actionData } = c;

    if (verified && actionData) {
      const url = `${endpoint}${actionData.fid}`;
      const init = {
        body: actionData.castId.hash,
        method: "POST",
        headers: {
          "content-type": "application/text",
          Authorization: `Basic ${FRAMECHAIN_TOKEN}`,
        },
      };
      await fetch(url, init);
      return c.message({ message: "Done!" });
    } else {
      return c.error({ message: "Unauthorized" });
    }
  },
  {
    name: "Add Bookmark (decentralized)",
    icon: "bookmark",
    description: "Decentralized bookmarks",
    aboutUrl: "https://farcaster.id/artlu",
  }
);

export default app;
