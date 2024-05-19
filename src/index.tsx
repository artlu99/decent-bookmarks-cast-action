import { Button, Frog } from "frog";
import { neynar as neynarHub } from "frog/hubs";
import { neynar } from "frog/middlewares";

// this is temporary, before we add authorization + smart contract
const endpoint = "https://worker-misty-voice-905f.artlu.workers.dev/?fid=";
const FRAMECHAIN_TOKEN = "thisisaprivatetokenifyouseeitthereisaleak";
const NEYNAR_API_KEY = "NEYNAR_FROG_FM";

export const app = new Frog({
  hub: neynarHub({ apiKey: NEYNAR_API_KEY }),
}).use(
  neynar({
    apiKey: NEYNAR_API_KEY,
    features: ["interactor", "cast"],
  })
);

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
        body: JSON.stringify({
          fid: actionData.castId.fid,
          username: c.var.cast?.author.username,
          hash: actionData.castId.hash,
        }),
        method: "POST",
        headers: {
          "content-type": "application/text",
          Authorization: `Basic ${FRAMECHAIN_TOKEN}`,
        },
      };
      try {
        const response = await fetch(url, init);
        if (response.ok) {
          return c.message({ message: "Done!" });
        } else {
          return c.error({ message: `${response.status}: ${response.statusText}` });
        }
      } catch (e) {
        return c.error({ message: "Generic POST Error" });
      }
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
