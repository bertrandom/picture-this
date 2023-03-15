import { Trigger } from "deno-slack-api/types.ts";
import CreateImageWorkflow from "../workflows/create_image_workflow.ts";

const createImageTrigger: Trigger<typeof CreateImageWorkflow.definition> = {
  type: "shortcut",
  name: "Create image",
  description: "Creates an image given a prompt",
  workflow: "#/workflows/create_image_workflow",
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
    channel: {
      value: "{{data.channel_id}}",
    },
  },
};

export default createImageTrigger;
