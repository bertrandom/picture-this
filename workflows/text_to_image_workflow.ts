import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { CreateImageFunctionDefinition } from "../functions/create_image_function.ts";
import { ShareImageFunctionDefinition } from "../functions/share_image_function.ts";
import { AppMentionToPromptFunctionDefinition } from "../functions/app_mention_to_prompt_function.ts";

const TextToImageWorkflow = DefineWorkflow({
  callback_id: "text_to_image_workflow",
  title: "Text to Image",
  description: "Creates an image given text in an app mention",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
      },
      text: {
        type: Schema.types.string,
      },
      user: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["channel", "text", "user"],
  },
});

const AppMentionToPromptFunctionStep = TextToImageWorkflow.addStep(
  AppMentionToPromptFunctionDefinition,
  {
    text: TextToImageWorkflow.inputs.text,
  },
);

const createImageFunctionStep = TextToImageWorkflow.addStep(
  CreateImageFunctionDefinition,
  {
    prompt: AppMentionToPromptFunctionStep.outputs.prompt,
    creator: TextToImageWorkflow.inputs.user,
  },
);

TextToImageWorkflow.addStep(ShareImageFunctionDefinition, {
  channel: TextToImageWorkflow.inputs.channel,
  prompt: AppMentionToPromptFunctionStep.outputs.prompt,
  person_sharing: TextToImageWorkflow.inputs.user,
  url: createImageFunctionStep.outputs.url,
});

export default TextToImageWorkflow;
