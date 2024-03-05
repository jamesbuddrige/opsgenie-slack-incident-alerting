import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import {RaiseIncident} from "../functions/raise_incident.ts";


const RaiseIncidentWorkflow = DefineWorkflow({
  callback_id: "raise_incident_workflow",
  title: "Raise an incident",
  description: "Raise an incident to Opsgenie",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ["interactivity"],
  },
});


const inputForm = RaiseIncidentWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Submit an issue",
    interactivity: RaiseIncidentWorkflow.inputs.interactivity,
    submit_label: "Submit",
    fields: {
      elements: [
        {
          name: "heading",
          title: "A short heading for the incident",
          type: Schema.types.string,
          long: false,
        },
        {
          name: "description",
          title: "Description of issue",
          type: Schema.types.string,
          long: true,
        },
          {
        name: "priority",
        title: "Priority of issue (Severity)",
        type: Schema.types.string,
        enum: ["P1", "P2", "P3", "P4"],
        choices: [
          {
            value: "P1",
            title: "P1 - Critical",
          },
          {
            value: "P2",
            title: "P2 - High",
          },
          {
            value: "P3",
            title: "P3 - Medium",
          },
          {
            value: "P4",
            title: "P4 - Low",
          },
        ],
      }],
      required: ["heading", "description", "priority"],
    },
  },
);

RaiseIncidentWorkflow.addStep(
  RaiseIncident,
  {
    submitting_user: inputForm.outputs.interactivity.interactor.id,
    incident_heading: inputForm.outputs.fields.heading,
    incident_description: inputForm.outputs.fields.description,
    incident_priority: inputForm.outputs.fields.priority,
  },
);

export default RaiseIncidentWorkflow;
