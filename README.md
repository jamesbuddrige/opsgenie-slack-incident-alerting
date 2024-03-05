# Opsgenie Incident Submission

This automation features an incident submission workflow that allows users to create an incident in Opsgenie from Slack. The workflow includes a form that collects information about the incident, and a function that creates the incident in Opsgenie.

## Setup

Before getting started, first make sure you have a development workspace where
you have permission to install apps. **Please note that the features in this
project require that the workspace be part of
[a Slack paid plan](https://slack.com/pricing).**

## Deployment

### Install the Slack CLI

To use this sample, you need to install and configure the Slack CLI.
Step-by-step instructions can be found in our
[Quickstart Guide](https://api.slack.com/automation/quickstart).

### Deploy the app

Deploy the app to your workspace by running the following command

```slack deploy --workspace <workspace-name>```

### Install the app

Install the app to your workspace by running the following command

```slack install```

### Distribute the app
Distribute the app to your workspace by running the following command

```slack distribute --workspace <workspace-name>```

### Setup environment variables
The app requires the following environment variables to be set:
- `OPSGENIE_API_KEY`: The API key for the Opsgenie account
- `OPSGENIE_API_URL`: The URL for the Opsgenie API

You can set these environment variables by running the following command

```slack env add OPSGENIE_API_KEY <api-key>```

```slack env add OPSGENIE_API_URL <api-url>```



## Running The Project Locally

While building your app, you can see your changes appear in your workspace in
real-time with `slack run`. You'll know an app is the development version if the
name has the string `(local)` appended.

```zsh
# Run app locally
$ slack run

Connected, awaiting events
```

To stop running locally, press `<CTRL> + C` to end the process.

## Testing

Test filenames should be suffixed with `_test`.

Run all tests with `deno test`:

```zsh
$ deno test
```

## Viewing Activity Logs

Activity logs of your application can be viewed live and as they occur with the
following command:

```zsh
$ slack activity --tail
```

## Project Structure

### `.slack/`

Contains `apps.dev.json` and `apps.json`, which include installation details for
development and deployed apps.

### `functions/`

[Functions](https://api.slack.com/automation/functions) are reusable building
blocks of automation that accept inputs, perform calculations, and provide
outputs. Functions can be used independently or as steps in workflows.

### `triggers/`

[Triggers](https://api.slack.com/automation/triggers) determine when workflows
are run. A trigger file describes the scenario in which a workflow should be
run, such as a user pressing a button or when a specific event occurs.

### `workflows/`

A [workflow](https://api.slack.com/automation/workflows) is a set of steps
(functions) that are executed in order.

Workflows can be configured to run without user input or they can collect input
by beginning with a [form](https://api.slack.com/automation/forms) before
continuing to the next step.

### `manifest.ts`

The [app manifest](https://api.slack.com/automation/manifest) contains the app's
configuration. This file defines attributes like app name and description.

### `slack.json`

Used by the CLI to interact with the project's SDK dependencies. It contains
script hooks that are executed by the CLI and implemented by the SDK.
