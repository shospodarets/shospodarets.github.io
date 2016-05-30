---
layout: post
title: "Progressive Web Apps: How to migrate to HTTPS"
tags: [Progressive Web Apps]
share_image: https://i.imgur.com/KAPWWVp.png
share_description: "Progressive Web Apps: How to migrate to HTTPS" 
---

This is the first of articles where I want to describe how to
migrate/extend your web app to being a [Progressive Web App](https://developers.google.com/web/progressive-web-apps/)

Main points of a Progressive Web App are:

* it's secure (uses HTTPS)
* app install banners give users an easy way to add the app to their home screen/launchpad
* service worker makes the app load nearly instantly and work offline
* application is responsive (phones, tablets and laptops)
* ability to send users web push notifications
* smooth and great user experience

Let's start from the first item and add security (HTTPS). 

<div class="more"></div>


# Reason

About half a year ago I migrated my site to [blog.hospodarets.com](https://blog.hospodarets.com/) to `https`.

The main reason why I did that is that [Service Workers](https://github.com/slightlyoff/ServiceWorker/blob/master/explainer.md)
require that and just don't work otherwise.

In turn, Service Worker I wanted to add to have the full control on serving my site offline,
but it's a topic for another article.

Other reason- currently most of new features come to browsers requiring a secure connection (privacy)
and even old ones [are reconsidered and moved to requiring it](https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins):

- Geolocation
- Device motion / orientation
- getUserMedia


# How

Usually there are two ways to get HTTPS working for your web app:

1. Getting a SSL/TLS certificate
2. Proxying all requests through some service

In short here are pros/cons of either way:

### Getting a SSL/TLS certificate

In April [Let’s Encrypt](https://letsencrypt.org/) guys
[left beta](https://letsencrypt.org/2016/04/12/leaving-beta-new-sponsors.html)
and started serving free certificates,
before the only one way (usually) was to pay for it.

Cons:

- you have to <strike>spend money</strike> learn how and get a certificate from 3rd party service
- installation and future change/migration/maintain might be not so easy

Pros:

- you have own certificate and full control on it

### Proxying all requests through some service

There are many services (Security CDNs) which can do it for you:

- [Incapsula](https://www.incapsula.com/)
- [Cloudflare](https://www.cloudflare.com/)
 
Cons:

- as it will proxy all your request- may add some latency (in practice I didn't notice that)
- you don't have full control on your certificate
- most of your needs might be covered on free accounts but if you need something advanced- you have to pay for it

Pros:

- super easy configuration- just plug and play
- easily to add other features (cache, page rules, DDoS protection etc.)
- free until you need something advanced

# Enabling HTTPS

I use [Cloudflare](https://www.cloudflare.com/).
Adding a site there is straightforward:

## Add site

Click "Add site", type your site url and press "Begin Scan":
![alt](https://i.imgur.com/lBKXNmg.gif)

## Setup DNS records

After it finished scanning click "Continue Setup", check DNS records and press "Continue":
![alt](https://i.imgur.com/wNcLnfP.gif)

## Select a plan

Select the best plan for you, my choice was "Free Website":
![alt](https://i.imgur.com/RVLtYVm.png)

## The last one- change your nameservers

![alt](https://i.imgur.com/CP322ck.png)

That's it! Now just manage your Domain DNS and point it to looking
to nameservers from Cloudflare.
Depending on your provider it might take up to 24 hours to start working.
 
Then just test your site: `https://YOUR_SITE` - it should work.



# HTTP->HTTPS redirects

As only you made HTTPS work for your web app,
logically to redirect all request from HTTP to HTTPS
to be sure your site always is served securely.

For that just add a couple of page rules for your site:

1) Always use HTTPS for requests to your site:

![alt](https://i.imgur.com/LeRj0Rc.png)

2) Always use HTTPS for subdomains:

![alt](https://i.imgur.com/LeRj0Rc.png)

These rules redirect requests form HTTP to HTTPS answering via [301 http code](https://en.wikipedia.org/wiki/HTTP_301) (Moved Permanently)


# Fixing blocked mixed content

If your app is served via HTTPS but some content is served via HTTP you would have the following warnings
([example](https://s.codepen.io/malyw/debug/aZbwzo)):

![alt](https://i.imgur.com/CjNFyV7.png)

It usually means something of the following are served via HTTP:

- &lt;script&gt; (src attribute)
- iframe (src attribute)
- XMLHttpRequest
- link (href)
- img, audio, video (src attribute)

To help finding and fixing such problems
recently [Security Panel was added to Chrome](https://developers.google.com/web/updates/2015/12/security-panel):

![alt](https://i.imgur.com/MRH8Ajc.png)

Here is the list of problems which I fixed during the migration:

- be careful autoreplacing `http://` to `https://` e.g. SVG used as background images after changing 
 `xmlns="http://www.w3.org/2000/svg"` to `xmlns="https://www.w3.org/2000/svg"`
 stop being shown

- some sites and plugins for them still use `http`, e.g. [Can I Use](http://caniuse.com/)

- inside JS you can consider technique like `document.location.protocol == 'https:' ? 'https://...' : 'http://...'`

- images, iframes, backgrounds etc. all should be moved to use `https`

The Protocol-relative URL (`src="//domain.com`) still is an option
but [might be an anti-pattern](http://www.paulirish.com/2010/the-protocol-relative-url/)


# 3rd party services

If you considered movement of your site to HTTPS or another domain
you have to take care of 3rd party services which you might use.

In my case I use [Disqus platform](https://disqus.com/) for comments and after movement to HTTPS all
comments disappeared.
Small research showed it gives a wonderful [URL Mapper](https://help.disqus.com/customer/portal/articles/912757-url-mapper)
tool to migrate the comments to any new URL.

For different 3rd party services there might be various approaches, but most of them should have similar tools/ways.
 
 

# Site migration

Another free benefit of using services like Cloudflare is an easy migration of domains.
In my case I switched [gospodarets.com](https://gospodarets.com) to
[hospodarets.com](https://hospodarets.com) (now all requests are redirected automatically).

If you want to do something similar- there is nothing hard, just add the following page rules
to your Cloudflare site configuration:

![alt](https://i.imgur.com/aj2SIcu.png)

which includes both- domain and subdomains.


<br>

So that's the way I made my sites "green":

![alt](https://i.imgur.com/KAPWWVp.png)