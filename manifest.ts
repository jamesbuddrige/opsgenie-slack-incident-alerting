import { Manifest } from "deno-slack-sdk/mod.ts";
import {RaiseIncident} from "./functions/raise_incident.ts";
import RaiseIncidentWorkflow from "./workflows/raise_incident.ts";

// noinspection JSUnusedGlobalSymbols
export default Manifest({
  name: "opsgenie-slack-incident-alerting",
  description: "Raise an incident to Opsgenie from Slack using an interactive form",
  icon: "assets/app_icon.png",
  workflows: [RaiseIncidentWorkflow],
  functions: [RaiseIncident],
  outgoingDomains: ["api.opsgenie.com", "api.eu.opsgenie.com"],
  botScopes: ["commands", "chat:write", "chat:write.public", "users:read", "users:read.email"],
});
