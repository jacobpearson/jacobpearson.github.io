---
layout: post
title: "Getting Claude and Home Assistant to actually talk to each other"
date: 2026-08-10
category: How-to
lede: "I wanted Claude to write my Home Assistant automations in plain English. Getting there meant tripping over an undocumented bug and a broken dependency chain first."
read_time: 6
tags: [How-to, Home Assistant, Claude, MCP, Automation]
toc:
  - { id: "attempt-1-the-remote-connector", title: "Attempt 1: the remote connector" }
  - { id: "attempt-2-a-local-proxy-instead", title: "Attempt 2: a local proxy instead" }
  - { id: "what-id-tell-someone-doing-this-today", title: "What I'd tell someone doing this today" }
---

I run Home Assistant for the usual reasons: lights, climate, a few sensors dotted around the house. What I actually wanted was to stop hand writing YAML automations every time I thought of a new one, and instead just tell Claude what I wanted in plain English and have it write, test, and explain the automation back to me. Longer term I've got my eye on pulling public transport timetables into the dashboard too, which is its own fiddly little integration problem, but that's a post for another day.

The natural way to do this is Anthropic's MCP (Model Context Protocol), which lets Claude Desktop talk to external tools and services, Home Assistant included. On paper it's a config file and an OAuth handshake. In practice it took two attempts, and along the way I found a real bug in Claude's connector flow that isn't documented anywhere I could find. Here's the writeup, partly so I remember what I did if I ever have to reinstall, and partly because the error message you get is genuinely misleading, and if you're hitting it too I'd rather save you the hour I spent staring at Cloudflare logs.

## Attempt 1: the remote connector
{: id="attempt-1-the-remote-connector"}

The obvious path is Claude Desktop's Custom Connector feature. Point it at your Home Assistant MCP endpoint, in my case `https://ha.example.com/api/mcp`, set the OAuth Client ID to `https://claude.ai`, and let it do the handshake.

It looked like it worked right up until it didn't. Click connect, get redirected to HA's login page, log in, hit the consent screen ("You're about to give claude.ai access..."), confirm, and then a flat "Couldn't connect" with an `oauth_error=McpAuthorization...` sitting in the URL.

My first assumption was that I'd fat fingered something in the Cloudflare Tunnel config, or that HA's auth setup was wrong. So I went and pulled the tunnel logs to trace the actual sequence of requests, rather than trusting what the error message was telling me. That turned out to be the right move, because the logs told a different story to the UI. The OAuth flow had actually completed successfully end to end. HA issued a valid token, `POST /auth/token` came back `200 OK`. The failure happened silently after that point, on Claude's side. The token gets issued fine, but Claude's backend fails to attach it to the follow up request to the MCP server, so HA correctly rejects an unauthenticated call, and Claude surfaces that as an authorization error, even though authorization itself had already succeeded.

Nothing wrong with my DNS, my Cloudflare config, or Home Assistant. Just a genuine bug in Claude's remote connector flow. If you're getting an `McpAuthorizationError` right after a login and consent screen that visibly worked, don't assume it's your setup. It's worth checking the logs on your end before you burn an evening rebuilding config that was already correct.

## Attempt 2: a local proxy instead
{: id="attempt-2-a-local-proxy-instead"}

Rather than keep fighting the remote OAuth path, I switched to running `mcp-proxy` locally on the same Windows machine as Claude Desktop. Claude Desktop launches it as a subprocess, and it authenticates to Home Assistant with a long lived access token instead of OAuth. This sidesteps the broken handshake entirely, and honestly, for a single user, single machine setup like mine, a long lived token is simpler to reason about than OAuth anyway. There's one less moving part to debug.

Getting there had two smaller speed bumps of its own.

**The package install was broken out of the box.** A completely fresh `uv tool install` gave me:

```
ImportError: cannot import name 'request_ctx' from 'mcp.server.lowlevel.server'
```

This happened even with a fresh `uvx` cache, so it wasn't anything stale on my end. It was `mcp-proxy`'s own published dependency constraints pulling in an incompatible version of the underlying `mcp` SDK. The fix was to pin the SDK version explicitly rather than trust the package's own resolution:

```powershell
uvx --refresh --from mcp-proxy --with "mcp==1.24.0" mcp-proxy --version
```

That resolved cleanly to `mcp-proxy 0.12.0`, and everything worked from there.

**A false alarm on auth.** Testing the endpoint manually with `curl` gave back "Request must be a JSON-RPC message" instead of a clean response, which looked like a real rejection. It wasn't. It was a PowerShell quoting artifact, single quoted JSON with embedded escaped quotes doesn't survive PowerShell's parser the way it would in bash. `mcp-proxy` builds its requests properly in Python under the hood, so it was never actually affected. Worth knowing before you go chasing a server side auth bug that doesn't exist.

The final working config, for anyone in the same boat:

```json
{
  "mcpServers": {
    "Home Assistant": {
      "command": "uvx",
      "args": [
        "--from", "mcp-proxy",
        "--with", "mcp==1.24.0",
        "mcp-proxy",
        "--transport=streamablehttp",
        "--stateless",
        "https://ha.example.com/api/mcp"
      ],
      "env": {
        "API_ACCESS_TOKEN": "your_long_lived_token"
      }
    }
  }
}
```

## What I'd tell someone doing this today
{: id="what-id-tell-someone-doing-this-today"}

A few things worth carrying forward if you're setting this up yourself, or if I'm reading this back in six months after a reinstall:

- A 401 in your browser when you visit an MCP endpoint directly is expected, not a fault. The endpoint wants an auth header, not a browser session.
- If you're debugging OAuth, go straight to the tunnel or proxy logs and trace the actual request sequence. Don't trust the client's error message to point at the real failure. The point where something breaks and the point where the error gets reported aren't always the same place.
- The remote OAuth connector has a real, reproducible bug for at least some setups right now. If login and consent both visibly succeed and you still get an authorization error, that's very likely it. Go local instead of troubleshooting a config that was never broken.
- `uv tool install` on its own doesn't fix a broken dependency chain if the package's own version pins are wrong. You have to override with `--with "package==version"` to force something compatible.
- For a single user, single machine setup, a long lived token is just easier to live with than OAuth. Fewer moving parts, easier to debug when something does go wrong.

None of this is exotic. It's the kind of thing that should take fifteen minutes and instead takes an evening, mostly because the first error message you see points you at the wrong problem. Now that it's running, next up is actually writing the automations in plain English, and eventually wiring in the transport timetable data. I'll write that one up once it's less held together with duct tape.
