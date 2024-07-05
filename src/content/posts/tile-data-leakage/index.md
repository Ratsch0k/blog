---
title: 'Tile - Data Leak'
publishedAt: '2024-07-05'
description: "Tile, a company selling Bluetooth-based location trackers, has a vulnerability that leaks user information. I uncovered this vulnerability during my master's thesis, in which I analyzed the security and privacy of the Tile ecosystem."
tags:
  - security
---

In my master's thesis, I analyzed the security and privacy of large portions of Tile's ecosystem.
During this, I discovered several security vulnerabilities affecting various components and features.
I reported these vulnerabilities to Tile, following [Google Project Zero's responsible disclosure policy](https://googleprojectzero.blogspot.com/2021/04/policy-and-disclosure-2021-edition.html).
However, as the 90-day deadline is over and Tile has failed to respond or patch the issues, I'm publishing my findings in hopes of raising awareness.
This post describes a security vulnerability that leaks user information, such as the user's email address.

# Vulnerability

Tile's MQTT server at prod-mqtt-8.tile-api.com leaks user information, such as email addresses.

An attacker can fetch the credentials to connect to the MQTT from Tile's server.
The credentials are static and the same for every user.
With the credentials, the attacker can connect to the server and subscribe to all messages using the wildcard `+`.
The attacker will then also receive control status messages that contain user information.

This vulnerability was originally discovered by Weller et al. (https://dl.acm.org/doi/abs/10.1145/3395351.3399422).

# Proof-of-Concept
The following screenshot shows some of the data and messages that can be obtained with this vulnerability.

![Screenshot of some of the message sent by Tile's MQTT server.](./data-screenshot.png)

In total, these messages leak the following information:
- email address
- device name
- Tile UUID of the user's phone
- Tile UUID of the user's Tile tracker

# Fix

It is recommended to prohibit all types of wildcards.
Moreover, different and sufficiently secure credentials should be used for each user.
Each user should also only be able to access messages published on the topics of their own devices.

# Timeline

- 2024-03-13: Contacted Life 360's security contact through responsibledisclosure@life360.com
- 2024-05-21: Contacted Tile's support asking for a status update
