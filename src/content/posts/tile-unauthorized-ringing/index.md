---
title: 'Tile - Unauthorized Ringing'
publishedAt: '2024-07-05'
description: "Tile, a company selling Bluetooth-based location trackers, has a vulnerability that allows any attacker to ring the phone or Tile tracker of any other user. I uncovered this vulnerability during my master's thesis, in which I analyzed the security and privacy of the Tile ecosystem."
tags:
  - security
---

In my master's thesis, I analyzed the security and privacy of large portions of Tile's ecosystem.
During this, I discovered several security vulnerabilities affecting various components and features.
I reported these vulnerabilities to Tile, following [Google Project Zero's responsible disclosure policy](https://googleprojectzero.blogspot.com/2021/04/policy-and-disclosure-2021-edition.html).
However, as the 90-day deadline is over and Tile has failed to respond or patch the issues, I'm publishing my findings in hopes of raising awareness.
This post describes one vulnerability that allows an attacker to ring the phone or tracker of any user.

# Vulnerability

It is possible for an attacker to remotely ring the phone or Tile tracker of another user through Tile's MQTT server at prod-mqtt-8.tile-api.com because there is no access control in place.
To exploit this vulnerability, the attacker must know the Tile UUID of the phone or Tile tracker they want to ring.
However, the MQTT server additionally leaks this information, as described in the post [Tile - Data Leakage](../tile-data-leakage).
The attacker can send a specially crafted message on the topic set to the Tile UUID of the targeted device to ring it.

This vulnerability was originally discovered by Weller et al. (https://dl.acm.org/doi/abs/10.1145/3395351.3399422).

# Proof-of-Concept

An attacker can fetch the credentials to connect to the MQTT from Tile's server.
The credentials are static and the same for every user.

After connecting to the MQTT server, they must send a message similar to the following one to the topic of the targeted device.
This topic is the device's Tile UUID.

```json
{
  "client_ts": <timestamp_ms>,
  "code": "REQ_START_LOOP_SONG",
  "tile_uuid": "<tile_uuid>",
  "payload": {},
}
```

When the targeted device receives this message, it starts ringing.

# Fix

It is recommended to use different and sufficiently secure credentials for each user.
Each user should also only be able to publish messages on the topics of their own devices.

# Timeline

- 2024-03-13: Contacted Life 360's security contact through responsibledisclosure@life360.com
- 2024-05-21: Contacted Tile's support asking for a status update
