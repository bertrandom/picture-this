import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const ShareImageFunctionDefinition = DefineFunction({
  callback_id: "share_image_function",
  title: "Share Image",
  description: "Share the image to the channel",
  source_file: "functions/share_image_function.ts",
  input_parameters: {
    properties: {
      prompt: {
        type: Schema.types.string,
        description: "Prompt",
      },
      url: {
        type: Schema.types.string,
        description: "URL of the image",
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
      person_sharing: {
        type: Schema.slack.types.user_id,
        description: "Person sharing the image",
      },
    },
    required: ["url", "channel", "person_sharing"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(
  ShareImageFunctionDefinition,
  async ({ inputs, client }) => {
    const { prompt, url, channel, person_sharing } = inputs;

    const response = await client.chat.postMessage({
      channel: channel,
      text: "<@" + person_sharing +
        ">*'s Prompt*: " + prompt,
      blocks: [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": prompt,
            "emoji": true,
          },
        },
        {
          type: "image",
          image_url: url,
          alt_text: prompt,
        },
        {
          "type": "context",
          "elements": [
            {
              "type": "mrkdwn",
              "text": "Generated by: <@" + person_sharing +
                ">",
            },
          ],
        },
      ],
    });

    if (response.ok) {
      console.log("Channel: " + response.channel);
      console.log("Message: " + response.ts);
    }

    return {
      outputs: {},
    };
  },
);
