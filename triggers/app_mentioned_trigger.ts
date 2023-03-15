import { Trigger } from "deno-slack-api/types.ts";
import TextToImageWorkflow from "../workflows/text_to_image_workflow.ts";

const appMentionedTrigger: Trigger<typeof TextToImageWorkflow.definition> = {
  type: "event",
  name: "App mentioned",
  description: "App mentioned",
  workflow: "#/workflows/text_to_image_workflow",
  event: {
    event_type: "slack#/events/app_mentioned",
    channel_ids: ["C04SDEU46LD", "C04TZJH42EN"],
  },
  inputs: {
    channel: {
      value: "{{data.channel_id}}",
    },
    text: {
      value: "{{data.text}}",
    },
    user: {
      value: "{{data.user_id}}",
    },
  },
};

export default appMentionedTrigger;
