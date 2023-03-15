import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { CreateImageFunctionDefinition } from "../functions/create_image_function.ts";
import { ShareImageFunctionDefinition } from "../functions/share_image_function.ts";

const CreateImageWorkflow = DefineWorkflow({
  callback_id: "create_image_workflow",
  title: "Create image",
  description: "Creates an image given a prompt",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity"],
  },
});

const inputForm = CreateImageWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Create image",
    interactivity: CreateImageWorkflow.inputs.interactivity,
    submit_label: "Create image",
    fields: {
      elements: [{
        name: "prompt",
        title: "Prompt",
        type: Schema.types.string,
        long: true,
        maxLength: 1000,
      }],
      required: ["prompt"],
    },
  },
);

const createImageFunctionStep = CreateImageWorkflow.addStep(
  CreateImageFunctionDefinition,
  {
    prompt: inputForm.outputs.fields.prompt,
    creator: CreateImageWorkflow.inputs.interactivity.interactor.id,
  },
);

CreateImageWorkflow.addStep(ShareImageFunctionDefinition, {
  channel: CreateImageWorkflow.inputs.channel,
  prompt: inputForm.outputs.fields.prompt,
  person_sharing: CreateImageWorkflow.inputs.interactivity.interactor.id,
  url: createImageFunctionStep.outputs.url,
});

export default CreateImageWorkflow;
