import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const AppMentionToPromptFunctionDefinition = DefineFunction({
  callback_id: "app_mention_to_prompt_function",
  title: "App Mention To Prompt",
  description: "Extract a prompt from an app mention",
  source_file: "functions/app_mention_to_prompt_function.ts",
  input_parameters: {
    properties: {
      text: {
        type: Schema.types.string,
        description: "App mention text containing the prompt.",
      },
    },
    required: ["text"],
  },
  output_parameters: {
    properties: {
      prompt: {
        type: Schema.types.string,
        description:
          "A text description of the desired image(s). The maximum length is 1000 characters.",
      },
    },
    required: ["prompt"],
  },
});

export default SlackFunction(
  AppMentionToPromptFunctionDefinition,
  ({ env, inputs }) => {
    const { text } = inputs;

    const prompt = text.replace(/<@.*>/, "");

    console.log(text);
    console.log(prompt);

    return {
      outputs: {
        prompt,
      },
    };
  },
);
