import { Manifest } from "deno-slack-sdk/mod.ts";
import CreateImageWorkflow from "./workflows/create_image_workflow.ts";
import TextToImageWorkflow from "./workflows/text_to_image_workflow.ts";

export default Manifest({
  name: "Picture This",
  description: "Picture This",
  icon: "assets/app_icon.png",
  workflows: [CreateImageWorkflow, TextToImageWorkflow],
  outgoingDomains: ["api.openai.com"],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "channels:read",
    "channels:history",
    "app_mentions:read",
  ],
});
