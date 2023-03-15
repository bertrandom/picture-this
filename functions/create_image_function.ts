import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const CreateImageFunctionDefinition = DefineFunction({
  callback_id: "create_image_function",
  title: "Create Image",
  description: "Create an image",
  source_file: "functions/create_image_function.ts",
  input_parameters: {
    properties: {
      prompt: {
        type: Schema.types.string,
        description:
          "A text description of the desired image(s). The maximum length is 1000 characters.",
      },
      creator: {
        type: Schema.slack.types.user_id,
        description: "Person creating the image",
      },
    },
    required: ["prompt", "creator"],
  },
  output_parameters: {
    properties: {
      url: {
        type: Schema.types.string,
        description: "URL of the generated image",
      },
    },
    required: ["url"],
  },
});

export default SlackFunction(
  CreateImageFunctionDefinition,
  async ({ env, inputs }) => {
    const { prompt, creator } = inputs;

    console.log("Generating image from prompt: " + prompt);
    console.log("Created by: " + creator);

    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt,
          n: 1,
          size: "1024x1024",
          response_format: "url",
          user: creator,
        }),
      },
    );

    const body = await response.json();

    console.log("OpenAI response:", JSON.stringify(body));

    const url = "https://openai.bert.org/1024/" + body.data[0].url;
    // const url = "https://httpbin.bert.org/image/jpeg?q=" + Math.random();

    return {
      outputs: {
        url,
      },
    };
  },
);
