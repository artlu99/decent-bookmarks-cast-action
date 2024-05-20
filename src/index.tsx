import { Button, Frog } from "frog";
import { neynar as neynarHub } from "frog/hubs";
import { neynar } from "frog/middlewares";

// this is temporary, before we add authorization + smart contract
const endpoint = "https://decent-bookmarks.artlu.workers.dev/?fid=";
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
      const body = JSON.stringify({
        fid: actionData.castId.fid,
        username: c.var.cast?.author.username,
        hash: actionData.castId.hash,
      });
      try {
        const response = await fetch(`${endpoint}${actionData.fid}`, {
          method: "POST",
          body,
          headers: {
            "content-type": "application/text",
            Authorization: `Basic ${FRAMECHAIN_TOKEN}`,
          },
        });
        if (response.ok) {
          return c.message({ message: `${response.statusText}` });
        } else if (
          response.status === 403 &&
          response.statusText === "Bookmark already exists!"
        ) {
          return c.res({ type: "frame", path: "/confirm-unbookmark" });
        } else {
          return c.error({ message: `${response.statusText}` });
        }
      } catch (e) {
        return c.error({ message: "Generic POST Error" });
      }
    } else {
      return c.error({ message: "Unauthorized" });
    }
  },
  {
    name: "Decent Bookmark",
    icon: "bookmark",
    description: "Decentralized bookmarks",
    aboutUrl: "https://farcaster.id/artlu",
  }
);

app.frame("/confirm-unbookmark", (c) => {
  const { verified, frameData } = c;

  if (verified && frameData) {
    const {
      castId: { hash },
    } = frameData;

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
            Are you sure you want to remove this bookmark? (there's no Undo)
          </div>
        </div>
      ),
      intents: [<Button action="/unbookmark">Confirm Removal</Button>],
    });
  } else {
    return c.error({ message: "Unauthorized" });
  }
});

app.frame("/unbookmark", async (c) => {
  const { verified, frameData } = c;

  if (verified && frameData) {
    const {
      fid,
      castId: { hash },
    } = frameData;

    let res = "";
    const body = JSON.stringify({
      hash,
    });
    try {
      const response = await fetch(`${endpoint}${fid}`, {
        method: "DELETE",
        body,
        headers: {
          "content-type": "application/text",
          Authorization: `Basic ${FRAMECHAIN_TOKEN}`,
        },
      });
      if (response.ok) {
        res = `${response.statusText}`; // success
      } else {
        res = `${response.statusText}`; // error
      }
    } catch (e) {
      return c.error({ message: "Generic POST Error" });
    }

    return c.res({
      image: (
        <div
          style={{
            alignItems: "center",
            background: "black",
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
            {res}
          </div>
        </div>
      ),
    });
  } else {
    return c.error({ message: "Unauthorized" });
  }
});

export default app;
