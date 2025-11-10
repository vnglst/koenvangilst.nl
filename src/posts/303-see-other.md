---
title: 303 See Other
publishedAt: '2019-08-25'
summary: >-
  Last week I learned a few things about how redirects and 303 status codes are
  handled in the browser.
tags:
  - article
  - restful
  - http
date: '2019-08-25'
layout: layouts/post.njk
permalink: /lab/303-see-other/
---

Last week I learned a few things about how redirects and 303 status codes are handled in the browser.

In the app I'm building the following happens: Once a session expires any requests to the server are blocked and redirected to the URL of the login (HTML) webpage. This also happens for any fetch requests (ajax calls) our single-page app is making. My job this week was to handle these redirects gracefully and show users some _Hello, your session has expired please login again_ page. This turned out to be more challenging than I anticipated.

I probably should have known, but 303 status codes are not visible on the client (i.e. in my JavaScript code). So my plan to just check for any 303s and redirect based on that didn’t pan out. The only errors I was seeing, were CORS errors since the login page is outside our domain.

My next strategy was to use the `redirect: ‘error’` option that the fetch API provides, like so:

```js
fetch('https://httpstat.us/303', { redirect: “error” })
    .then(console.log)
    .catch(console.error);
```

In Chrome this request fails with a `TypeError: Failed to fetch`. Could I use this error to detect expired sessions? In Firefox I got the same error message. Hurrah!?

However, on Safari I got `TypeError: Not allowed to follow a redirection while loading https://httpstat.us/303`. That's more informative, but in general, I got a bad feeling about this approach: The error messages were not consistent across browsers and the `Failed to fetch` on Chrome could be any kind of failure. I could not be sure these failures were related to redirects (and thus expired user sessions).

My final approach was based on using the `manual` redirect Enum. That gave me a little bit more information on modern browsers:

```js
fetch('https://httpstat.us/303', { redirect: 'manual' })
  .then(console.log)
  .catch(console.error);
```

This request results in a Response object with a `type: “opaqueredirect”` property on all _modern_ browsers. This was something, but of course, it does not work on older browsers like `IE11` (for which our app relies on a fetch polyfill).

So even this final approach did not give me a reliable way to detect expired sessions. As a temporary solution, it kinda works. On IE11 we're now showing users a general error message on failed requests that are missing a status code. These messages offer users a “Try to login again” link.

In the meantime, other engineers are working on a solution to let the client know directly that a session has expired. If I had to choose a solution I would go for a response with status 401 (authentication is possible but has failed or was not yet been provided.). And in the response body, I would expect the reason. In `json/text` ‘cause that’s what I’m requesting in my headers as the `Content-Type`. Then I can absolutely know for sure what’s going on.

(Note: There’s also the `redirected` property on the Response object, however, this is still an experimental feature that’s not available in all browsers, Safari and Internet Explorer being notable exceptions for my purposes. [See the MDN page for Response](https://developer.mozilla.org/en-US/docs/Web/API/Response/redirected))
