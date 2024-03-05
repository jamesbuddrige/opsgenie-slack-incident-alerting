import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import RaiseIncidentWorkflow from "../workflows/raise_incident.ts";

const raiseIncident: Trigger<typeof RaiseIncidentWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Raise an incident",
  description: "Raise an incident to Opsgenie",
  workflow: "#/workflows/raise_incident_workflow",
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
};

// noinspection JSUnusedGlobalSymbols
export default raiseIncident;
