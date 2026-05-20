---
layout: post
title: "SolarCity: Building a solar suitability tool that replaced the sales call"
date: 2026-05-15
category: Case Study
lede: "At SolarCity NZ, I led the build of a GIS-powered suitability tool that let homeowners check, qualify, and estimate their solar savings online — before ever speaking to anyone. Leads via the tool were 30% more likely to convert."
read_time: 5
tags: [Case Study, Digital, Product, Lead Generation]
toc:
  - { id: "the-problem", title: "The problem" }
  - { id: "what-we-built", title: "What we built" }
  - { id: "the-results", title: "The results" }
  - { id: "what-i-owned", title: "What I owned" }
---

The traditional solar sales process started with a phone call. A prospective customer would make contact, a salesperson would spend thirty minutes gathering basic information — address, roof type, average power bill, service region — and only then could they give even a rough sense of whether solar was worth pursuing. Most of that call was just qualification. Most leads dropped off before it even happened.

I wanted to find out whether we could move that qualification online, and whether a customer who'd already worked through their own suitability estimate would be meaningfully more committed when they finally did speak to sales.

## The problem
{: id="the-problem"}

The core challenge wasn't technical — it was that solar suitability is genuinely complex. Whether a home is a good candidate depends on roof orientation, available panel area, local weather patterns, distance from the grid, and the customer's actual power usage. Getting that wrong, either by qualifying homes that aren't suitable or by turning away homes that are, has real cost: failed installs, wasted sales conversations, damaged trust.

We started with customer interviews — specifically, people who had enquired but not gone ahead. The pattern was consistent: the gap between initial interest and first useful information was too long, and too dependent on the customer being available for a call at a time that suited the sales team.

## What we built
{: id="what-we-built"}

The centrepiece was a solar suitability tool that used ESRI GIS and aerial imagery data to assess a residential property automatically. A customer entered their address, and the tool assessed:

- Roof orientation and pitch
- Available panel area (accounting for chimneys, skylights, shading)
- Service region coverage
- Estimated annual solar generation for a given system size

We then automated ingestion of power bill data — a customer could upload or forward their bill, and the system would extract their usage figures to produce a personalised savings estimate: recommended system size, projected first-year savings, twenty-year comparison, and environmental impact.

<div class="screenshot-scroll">
  <div class="screenshot-scroll-bar">
    <div class="screenshot-scroll-dots"><span></span><span></span><span></span></div>
    <span class="screenshot-scroll-label">solarcity.co.nz — Your savings estimate</span>
  </div>
  <div class="screenshot-scroll-body">
    <img src="/assets/images/solarcity-savings-estimate.jpg" alt="SolarCity personalised savings estimate page showing roof suitability assessment, savings comparison table, and 20-year power bill projection">
  </div>
</div>

What had previously required half an hour on a call now happened in minutes, online, any time of day. The output was also more credible than a verbal estimate — customers could see the numbers, explore the comparison, and share the result before speaking to anyone.

The tool fed directly into a Salesforce-integrated lead funnel. When a qualified lead did contact sales, the conversation started with context already attached: suitability score, system recommendation, savings estimate. The initial setup call — which had been the first real milestone in the old funnel — was effectively replaced.

## The results
{: id="the-results"}

- **30% higher conversion rate** for leads entering via the suitability tool compared to other channels
- **20% reduction in time-to-install**, driven by faster qualification and fewer drop-offs in the early funnel
- Reduced cost-per-customer by shifting away from bought leads toward owned, inbound traffic
- Sales team conversations moved up the funnel — less setup, more decision-making

## What I owned
{: id="what-i-owned"}

- Customer research: interviews with people who enquired but did not convert, to identify friction points
- Product definition and delivery for the suitability tool, powerbill reading engine, and savings estimate output
- Full customer-facing website rebuild and design system
- Salesforce integration across the lead generation funnel, including attribution
- A/B testing across key conversion points

The team was two developers and two testers. I led it end to end, from product initiation through to delivery and measurement. Every piece of the flow was designed to reduce the gap between a curious homeowner and a qualified sales conversation.
