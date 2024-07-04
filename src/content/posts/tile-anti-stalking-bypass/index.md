---
title: 'Tile - Bypassing Scan and Secure'
publishedAt: '2024-07-05'
description: "Tile, a company selling Bluetooth-based location trackers, has a vulnerability that allows an attacker to bypass Tile's Scan and Secure. I uncovered this vulnerability during my master's thesis, in which I analyzed the security and privacy of the Tile ecosystem."
tags:
  - security
---

In my master's thesis, I analyzed the security and privacy of large portions of Tile's ecosystem.
During this, I discovered several security vulnerabilities affecting various components and features.
I reported these vulnerabilities to Tile, following [Google Project Zero's responsible disclosure policy](https://googleprojectzero.blogspot.com/2021/04/policy-and-disclosure-2021-edition.html).
However, as the 90-day deadline is over and Tile has failed to respond or patch the issues, I'm publishing my findings in hopes of raising awareness.
This post describes one vulnerability that allows any attacker to build a custom tracker that is undetectable by Tile's Scan and Secure feature.

# Vulnerability

It is possible to bypass _Scan and Secure_, effectively hiding trackers.

During _Scan and Secure_, the app collects nearby Bluetooth Low-Energy advertisements that contain so-called PrivateIDs.
Afterwards, it identifies valid and known PrivateIDs by sending observed ids to `https://production.tile-api.com/api/v1/anti_stalking/session`, which will then respond with how many unique Tiles trackers are in the list of IDs and how often each tracker was observed.
There are two PrivateID versions: PrivateIDV0 and PrivateIDV2.
However, the _Scan and Secure_ feature is unable to detect PrivateIDV0.
Moreover, PrivateIDV0 is supported by Community Find.
Thus, the tracker can be tracked with Tile's tracking network.

This vulnerability can be exploited to create a custom Tile tracker that can be tracked with _Community Find_ while being hidden from _Scan and Secure_.

# Proof-of-Concept

To exploit the vulnerability, the attacker must have a registered Tile account and must possess or build a device that emits custom Bluetooth Low-Energy advertisements.

Let's assume we have a Tile tracker with the Tile UUID `aaaabbbbccccdddd`.
The tracker's PrivateIDV0 is simply its Tile UUID.
Since PrivateIDV2 is calculated based on additional secrets, for simplicity's sake, we assume that the following value is a valid PrivateIDV2 for the tracker: `1111222233334444`.

Both, PrivateIDV0 and PrivateIDV2, are supported by Community Find.
Thus, if a device emits either one, its location can be tracked.

While _Scan and Secure_ successfully records advertisements with both versions, it is only able to detect trackers emitting advertisements with PrivateIDV2.
The issue stems from how _Scan and Secure_ interacts with the endpoint `https://production.tile-api.com/api/v1/anti_stalking/session`.

For the following example, let's assume the tracker described above emits advertisements with PrivateIDV2.
One of these would look like this: `02001111222233334444`.
For the sake of this example, we assume the tracker was emitting the above advertisement while _Scan and Secure_ was scanning.
After the scanning period, _Scan and Secure_ would send the following request to `https://production.tile-api.com/api/v1/anti_stalking/session`.

```http
POST /api/v1/anti_stalking/session HTTP/1.1
tile_app_id: android-tile-production
tile_app_version: 2.115.0.5050
Content-Type: application/json
Accept: */*
Host: production.tile-api.com
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Content-Length: 208

[
	{
		"privateIds": [
			"1111222233334444"
		]
	}
]

HTTP/1.1 200 OK
Date: Wed, 13 Mar 2024 13:27:34 GMT
Content-Type: application/json
Content-Length: 188
Connection: keep-alive
Set-Cookie: session=;Version=1;Domain=tile-api.com;Path=/;Max-Age=0;Secure
Vary: Accept-Encoding, User-Agent
Content-Encoding: gzip
Server: Jetty(9.4.44.v20210927)

{
	"version":1,
	"revision":1,
	"timestamp":"2024-03-13T13:27:34.968Z",
	"timestamp_ms":1710336454968,
	"result_code":0,
	"result": [{
		"private_id": "1111222233334444",
		"product_code":"ROYAL_ST1",
		"ownership_status":null,
		"detection_count":1
	}]
}
```

_Note: "Scan and Secure" requires at least two scans. While the example only shows one scan, the example is still valid, and adding a second list of private ids won't change the results._

In the response above, the server correctly identifies the PrivateIDV2, and _Scan and Secure_ is able to detect the tracker.

However, if the tracker emits PrivateIDV0, this doesn't work.
In this case, the PrivateIDV0 would look like this: `0000aaaabbbbccccdddd`.
Let's assume the tracker now emits advertisements with PrivateIDV0.
If _Scan and Secure_ observes this advertisement, it sends the following request:

```http
POST /api/v1/anti_stalking/session HTTP/1.1
tile_app_id: android-tile-production
tile_app_version: 2.115.0.5050
Content-Type: application/json
Accept: */*
Host: production.tile-api.com
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Content-Length: 458

[
	{
		"privateIds": [
			"aaaabbbbccccdddd"
		]
	}
]

HTTP/1.1 200 OK
Date: Wed, 13 Mar 2024 13:29:02 GMT
Content-Type: application/json
Content-Length: 114
Connection: keep-alive
Set-Cookie: session=;Version=1;Domain=tile-api.com;Path=/;Max-Age=0;Secure
Vary: Accept-Encoding, User-Agent
Content-Encoding: gzip
Server: Jetty(9.4.44.v20210927)

{
    "version": 1,
    "revision": 1,
    "timestamp": "2024-03-13T13:29:02.560Z",
    "timestamp_ms": 1710336542560,
    "result_code": 0,
    "result": []
}
```

The response shows that it was not able to detect the tracker.

Both requests highlight the underlying issues.
Instead of using the entire advertisement, only the PrivateID part (the last 8 bytes) is used.
However, it is not possible to derive the PrivateID version solely from these 8 bytes.
The version is indicated by the first byte, which is not included in the _Scan and Secure_ request.

Therefore, the server cannot differentiate between both versions and seems to handle every PrivateID as PrivateIDV2.

# Fix

It is recommended that Tile processes the entire PrivateID and correctly differentiates between PrivateIDV0 and PrivateIDV2.

# Timeline

- 2024-03-13: Contacting Life 360's security contact through responsibledisclosure@life360.com
- 2024-05-21: Contacting Tile's support asking for a status update
