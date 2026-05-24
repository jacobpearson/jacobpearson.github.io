---
layout: post
title: "Adding HomePod Mini temperature and humidity to Home Assistant"
date: 2026-05-21
category: How-to
lede: "The HomePod Mini has temperature and humidity sensors, but getting them into Home Assistant takes some wiring up. This is the method that worked — documented in one place, without the comment thread archaeology."
read_time: 10
tags: [How-to, Home Assistant, Apple, HomeKit, Automation]
toc:
  - { id: "how-this-works", title: "How this works" }
  - { id: "home-assistant-setup", title: "Home Assistant setup" }
  - { id: "shortcuts-setup", title: "Shortcuts setup" }
---

I've struggled with this project in the past. The main guides are buried under dozens of comments, with more after — sometimes with conflicting advice. I'll try to document the best method I found in one place. If you have any issues or need clarification, [drop me a note](/contact) and I'll do my best to update it.

Much of this is thanks to [this Home Assistant community post](https://community.home-assistant.io/t/how-to-integrate-homepod-mini-sensors-into-home-assistant-when-direct-integration-isnt-possible/665074) for laying the groundwork.

## How this works
{: id="how-this-works"}

1. A switch is added to HomeKit from Home Assistant
2. Every two minutes, Home Assistant flips that switch
3. Which triggers a HomeKit automation, created in Shortcuts
4. That sends the temperature and humidity values from HomeKit to Home Assistant

## Home Assistant setup
{: id="home-assistant-setup"}

**Prerequisites**

- Your HomePods added to Home Assistant using the Apple TV integration — it's just easier
- An iPhone or iPad with the Shortcuts app and your Apple Home installed

**Step 1 — Create an input_boolean**

This is the switch Home Assistant will toggle to trigger the Shortcuts automation.

Go to **Settings → Devices & Services → Helpers → New Helper** and create an Input Boolean. I call mine *Homekit Sensors Update*.

It must be exposed to HomeKit via the HomeKit integration — we'll configure that in Step 2.

**Step 2 — Add the input_boolean to a HomeKit Bridge**

This allows HomeKit to see when it should request sensor data from the HomePods.

Go to **Settings → Devices & Services → Integrations**. If HomeKit isn't listed, add the integration:

- Set *Domains to include* to Input Boolean
- Pair it to HomeKit by scanning the QR code with the Home app on your iPhone
- Make sure the integration includes the `input_boolean` you created in Step 1

I add mine as a separate bridge entry from other devices I expose to HomeKit. Check the Home app on your iPhone or iPad to confirm it's showing.

**Step 3 — Create a Home Assistant automation**

This automation flips the input_boolean every two minutes, which triggers the Shortcuts automation on the HomeKit side.

Go to **Settings → Automations & Scenes → Automations → New Automation**, switch to YAML mode, and paste the following:

```yaml
alias: Homekit - Sensor Collection
description: Processes temperature and humidity data from the HomePod Mini
triggers:
  - minutes: /2
    id: time
    trigger: time_pattern
actions:
  - target:
      entity_id: input_boolean.homekit_sensors_update
    action: input_boolean.turn_on
    data: {}
  - delay: "00:00:05"
  - target:
      entity_id: input_boolean.homekit_sensors_update
    action: input_boolean.turn_off
    data: {}
mode: single
```

**Step 4 — Enable the REST API and generate an API key**

The REST API is enabled by default in most modern Home Assistant installations. Confirm by checking your `configuration.yaml` file — look for `api:` in the `default_config` section.

To generate an API key, go to your **profile → Security tab → Long-lived access tokens**. Create a token for your HomePods and save it somewhere accessible from your iPhone or iPad — you'll need it in Shortcuts.

The [Home Assistant API documentation](https://homeassistantapi.readthedocs.io/en/latest/quickstart.html) has more detail if you run into trouble.

## Shortcuts setup
{: id="shortcuts-setup"}

The Mac version of Shortcuts doesn't always display all the options described here. If you can't find something, try your iPhone instead.

**Step 5 — Collect sensor values**

Open Shortcuts and go to **Automations**. Tap **Add Automation**, then at the bottom of the list tap **Create Home Automation** under the *Home Automation* section.

Configure it as follows:

- **Event**: An Accessory is Controlled
- **Select**: your *Homekit Sensors Update* switch (it appears under the *Virtual* group)
- **Trigger**: when it Turns On, at any time
- Don't select any devices — tap **Convert to Shortcut** at the bottom

<div class="carousel" aria-label="HomeKit automation setup steps">
  <div class="carousel-track">
    <div class="carousel-slide">
      <img src="/assets/images/homepod-ha-shortcuts-01-create-automation.webp" alt="Shortcuts Automations screen showing the Home Automation section at the bottom with the Create Home Automation button">
    </div>
    <div class="carousel-slide">
      <img src="/assets/images/homepod-ha-shortcuts-02-new-automation.webp" alt="New Automation screen showing event types — An Accessory is Controlled is the one to select">
    </div>
    <div class="carousel-slide">
      <img src="/assets/images/homepod-ha-shortcuts-03-select-accessory.webp" alt="Accessory Automation screen with Homekit Sensors Update selected under the Virtual group">
    </div>
    <div class="carousel-slide">
      <img src="/assets/images/homepod-ha-shortcuts-04-when-trigger.webp" alt="Accessory Automation When screen — Turns On selected, Time set to Any">
    </div>
    <div class="carousel-slide">
      <img src="/assets/images/homepod-ha-shortcuts-05-automation-done.webp" alt="Completed HomeKit automation showing When HomeKit Sensors Update Turns On triggers a Shortcut">
    </div>
  </div>
  <div class="carousel-controls">
    <button class="carousel-prev" aria-label="Previous">←</button>
    <div class="carousel-dots">
      <button class="carousel-dot active" aria-label="Slide 1"></button>
      <button class="carousel-dot" aria-label="Slide 2"></button>
      <button class="carousel-dot" aria-label="Slide 3"></button>
      <button class="carousel-dot" aria-label="Slide 4"></button>
      <button class="carousel-dot" aria-label="Slide 5"></button>
    </div>
    <button class="carousel-next" aria-label="Next">→</button>
  </div>
</div>

Now build out the shortcut:

1. Add a **Get** action to read the current temperature from your HomePod. Pull up the panel by the handle above the search bar, select **Home**, then **Get Status**. Tap the placeholders to select your device and choose *Current Temperature*.

<figure class="article-figure article-figure--portrait">
  <img src="/assets/images/homepod-ha-shortcuts-06-action-picker.webp" alt="Shortcuts action picker panel showing category filters (Scripting, Controls, Device) and app list including Home — select Home to find Get Status">
</figure>

2. That value needs to be stored temporarily. Add a **Set Variable** action: pull up the panel, select the *Scripting* filter, and scroll to *Set Variable*. Give the variable a name and set its value to the temperature from the previous step.

3. Repeat for humidity.

4. If you have multiple HomePods, repeat everything for each one — use a unique variable name for each device and each measurement type.

**Step 6 — Set up authentication**

Add a **Text** action and paste in your Home Assistant Bearer token. The format should be:

```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The word `Bearer`, a single space, then the token — no trailing space.

Then add a **Set Variable** action. I call mine *Bearer Token*. Set its value to that text node.

**Step 7 — Send the values to Home Assistant**

A word of warning before proceeding: check your typing carefully. A stray space can be surprisingly difficult to troubleshoot.

Add a **Get Contents of URL** action.

<figure class="article-figure article-figure--portrait">
  <img src="/assets/images/homepod-ha-shortcuts-08-get-contents-configured.webp" alt="Get Contents of URL action configured with the HomePod temperature entity URL, POST method, Authorization header set to BearerToken variable, and JSON request body with attributes and state fields">
</figure>

Configure it as follows:

- **URL**: your Home Assistant server, pointing at the HomePod entity. For example: `http://192.168.1.21:8123/api/states/sensor.office_homepod_office_temperature`
- **Method**: POST
- **Headers**: add a key called `Authorization`, with the value set to your *Bearer Token* variable. If this token changes in future, you only need to update it here.
- **Request Body**: JSON

In the JSON body, add a dictionary with these entries:

| Key | Value |
|-----|-------|
| `device_class` | `temperature` |
| `state_class` | `measurement` |
| `unit_of_measurement` | `°C` or `°F` |

Hold the zero key to type the degree symbol (°).

<figure class="article-figure article-figure--portrait">
  <img src="/assets/images/homepod-ha-shortcuts-09-attributes-dictionary.webp" alt="Attributes dictionary showing device_class set to temperature, state_class set to measurement, and unit_of_measurement set to °C">
</figure>

Back out of the dictionary view, then add a **State** entry set to the temperature variable you created earlier.

<figure class="article-figure article-figure--portrait">
  <img src="/assets/images/homepod-ha-shortcuts-10-all-done.webp" alt="Completed shortcut showing the Get Contents of URL node with all fields configured and ready to run">
</figure>

Confirm and close. Temperature readings from your HomePod are now being sent to Home Assistant every two minutes.

**For humidity**, go back into the shortcut and add another **Get Contents of URL** node pointing at the humidity entity:

`http://192.168.1.21:8123/api/states/sensor.office_homepod_office_humidity`

Repeat the same configuration with `device_class` set to `humidity` and `unit_of_measurement` set to `%`.

That's it. Temperature and humidity values are now attached to the HomePod entry in Home Assistant.
