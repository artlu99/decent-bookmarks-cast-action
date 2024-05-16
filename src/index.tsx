import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { neynar } from "frog/hubs";

export const app = new Frog({
  hub: neynar({ apiKey: "NEYNAR_FROG_FM" }),
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
  (c) => {
    const { verified, actionData } = c;

    if (verified && actionData) {
      console.log(actionData);

      return c.message({ message: "Done!" });
    } else {
      return c.error({ message: "Unauthorized" });
    }
  },
  {
    name: "Add Bookmark (decentralized)",
    icon: "link-external",
    description: "Decentralized bookmarks",
    aboutUrl: "https://farcaster.id/artlu",
  }
);

const isCloudflareWorker = typeof caches !== "undefined";
if (isCloudflareWorker) {
  const manifest = await import("__STATIC_CONTENT_MANIFEST");
  const serveStaticOptions = { manifest, root: "./" };
  app.use("/*", serveStatic(serveStaticOptions));
  devtools(app, { assetsPath: "/frog", serveStatic, serveStaticOptions });
} else {
  devtools(app, { serveStatic });
}

export default app;
