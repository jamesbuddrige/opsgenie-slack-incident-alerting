import {DefineFunction, Schema, SlackFunction} from "deno-slack-sdk/mod.ts";

export const RaiseIncident = DefineFunction({
  callback_id: "raise_incident",
  title: "Raise an incident",
  description: "Create an incident in Opsgenie",
  source_file: "functions/raise_incident.ts",
  input_parameters: {
    properties: {
      submitting_user: {
        type: Schema.slack.types.user_id,
      },
      incident_priority: {
        type: Schema.types.string,
        description: "Severity of the issue",
      },
      incident_heading: {
        type: Schema.types.string,
        description: "A short heading for the incident",
      },
      incident_description: {
        type: Schema.types.string,
        description: "Description of the issue",
      },
    },
    required: ["submitting_user", "incident_priority", "incident_heading", "incident_description"],
  },
  output_parameters: {
    properties: {
      incident_id: {
        type: Schema.types.string,
      }
    },
    required: ["incident_id"],
  },
});

// noinspection JSUnusedGlobalSymbols
export default SlackFunction(
    RaiseIncident,
  async ({ inputs, client, env }) => {
    const { submitting_user, incident_priority, incident_heading, incident_description  } = inputs;

    // Make sure the provided priority is valid
    if (!["P1", "P2", "P3", "P4"].includes(incident_priority)) {
        throw new Error("Invalid priority provided");
    }

    const genie_key = env["OPSGENIE_API_KEY"];
    if (!genie_key) {
        throw new Error("Opsgenie API key not defined as environment variable");
    }

    const api_base_url = env["OPSGENIE_API_URL"];
    if (!api_base_url) {
        throw new Error("Opsgenie API URL not defined as environment variable");
    }

    const responders = [{name: "Engineering", type: "team"}];

    // Get the email of the submitting user
    const user_info = await client.users.info({ user: submitting_user });
    if (!user_info.ok) {
        throw new Error("Failed to get user info");
    }

    // Raise an incident in Opsgenie
    const create_response = await fetch(`${api_base_url}/v1/incidents/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "GenieKey " + genie_key
        },
        body: JSON.stringify({
            message: incident_heading,
            description: incident_description,
            priority: incident_priority,
            responders: responders,
            details: {"Raised By": user_info.user.profile.email}
      })
    });

    // Check if the response is ok
    if (!create_response.ok) {
        throw new Error(`Opsgenie request failed with status ${create_response.status}`);
    }

    const create_data = await create_response.json();
    const request_id = create_data.requestId;

    console.log("Incident creation request ID: " + request_id);

    let is_complete = false;
    let incident_id = "";
    while (!is_complete) {
        const incident = await tryGetIncident(api_base_url, genie_key, request_id);
        if (incident.data.success) {
            is_complete = true;
            incident_id = incident.data.incidentId;
        } else {
            await new Promise(r => setTimeout(r, 100));
        }
    }

    console.log("Incident created with ID: " + incident_id);

    return {
      outputs: { incident_id },
    };
  },
);

const tryGetIncident = async (api_base_url: string, genie_key: string, incident_id: string) => {
    const incident_response = await fetch(`${api_base_url}/v1/incidents/${incident_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "GenieKey " + genie_key
        }
    });

    // Check if the response is ok
    if (!incident_response.ok) {
        return { data: { success: false } };
    }

    return await incident_response.json();
}