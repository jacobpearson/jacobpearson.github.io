---
layout: post
title: "Working with AI: What I've Actually Done"
date: 2026-05-21
category: Article
lede: "Not in the 'asked ChatGPT to write an email' way — more like built a pipeline connecting six platforms, running LLM analysis, and publishing to Notion while I sleep. A rough account of how that happened, and what I've learned."
read_time: 5
tags: [Article, AI, Product, Automation]
toc:
  - { id: "starting-out", title: "Starting out" }
  - { id: "the-n8n-pipeline", title: "The n8n pipeline" }
  - { id: "ai-in-the-job-search", title: "AI in the job search" }
---

I've been using AI tools seriously for about a year now. Not in the "asked ChatGPT to write an email" way, but in the "built a pipeline that connects six platforms, runs LLM analysis, and publishes to Notion while I sleep" way. This is a rough account of how that happened, and what I've learned.

## Starting out: using AI as a thinking partner
{: id="starting-out"}

As someone on the Autism spectrum, I can get overwhelmed in the large open plan pig pens most refer to as an office these days. I can have a lot going through my mind during a day, combined with the stimulus from around the office, this creates cognitive overload that Ritalin can't help with.

And as a product manager, a significant chunk of my job involved work that was mentally heavy but not particularly creative: scanning competitors, reading through lengthy documents, looking for gaps in proposals before they went anywhere important, restructuring information for different audiences. The kind of work that takes hours and leaves you tired without producing much that's interesting.

AI changed that for me by allowing me to offload the cognitive overload.

Competitor research that would have taken a full day — reading product pages, piecing together positioning, working out where gaps were — collapsed into something I could move through in a fraction of the time. The AI didn't do the thinking for me, but it let me get to the thinking faster. I could ask "what's missing from this argument?" about a proposal and get a useful answer in seconds, then decide whether I agreed. I could take a technical brief and ask for a version written for a board audience, then refine it. I could dump a wall of research and ask for the three things that actually mattered. I could challenge AI to provide opposing opinions and argue with me to test my work.

None of this required any technical skill. It just required learning how to ask good questions. The biggest shift wasn't productivity. It was the ability to pressure-test my own thinking cheaply. Before committing to a position in a meeting or a document, I could run the argument past an AI and see what it pushed back on.

## Getting technical: building the n8n reporting pipeline
{: id="the-n8n-pipeline"}

The second phase started when I got frustrated with weekly reporting.

At ICT, product reporting meant pulling numbers from multiple places: Google Analytics, Firebase, the Apple App Store, Google Play, Salesforce, Zendesk. I would then manually assemble the data into something coherent for stakeholders. It was time-consuming, error-prone, and produced the same information every time.

I looked into what to do. The answer wasn't AI — it was n8n. n8n is a workflow automation tool, think Zapier but open source and significantly more flexible. I connected each of those data sources through their APIs, which was not always straightforward. Some had clean, well-documented APIs. Others required JWT token configuration, scraping public-facing App Store pages when the official API wouldn't cooperate, and working around rate limits and field size restrictions that weren't documented anywhere obvious.

The collected data fed into an LLM, which performed analysis and generated a structured commentary — not just the numbers, but a read of what was notable about them. The output published directly to Notion, formatted and ready for stakeholders. The pipeline took 2 minutes each time, saving me 3 hours.

I learned through this process what AI is genuinely good at and where it falls over. Spotting patterns and generating plausible language: excellent. Knowing when a number is wrong because something upstream broke: not without help. The pipeline needed monitoring and guardrails. It wasn't set and forget — but it was dramatically better than the alternative.

I spent approx 40 hours configuring and testing the automation. A week after finishing this project, Anthropic released Claude Cowork, which would have cut the build to under an hour.

## Recently: AI in the job search, and building in public
{: id="ai-in-the-job-search"}

Being between roles is a strange experience when your professional skill set includes using AI to work more efficiently. The obvious move was to apply that to the job search itself.

I've used AI throughout: drafting and refining cover letters tailored to specific roles, researching companies and reading between the lines of job descriptions, synthesising feedback from applications to spot patterns, and stress-testing my own narratives before interviews. The speed advantage is real, but the more valuable thing is the ability to get an outside perspective on your own blind spots. It's hard to read your own CV the way a recruiter reads it. An AI can approximate that perspective in a way a mirror can't.

It's not without its downsides. As someone who appreciates good typography, this process has killed the em-dash for me.

The other piece was building this website using Claude Code. I'm not a developer, but I can describe what I want precisely, reason about whether what I'm getting back makes sense, and iterate. The result is a site I built myself, to my own spec, without needing to hire anyone or learn a new stack from scratch.

I understand the pushback against AI slop and this site not feeling genuine. But honestly, I'm not making this website for anyone who thinks like that. I needed an online presence and portfolio fast. It does the job.

That experience reinforced something I've come to believe: the value of AI tools scales directly with how clearly you can think and communicate. The people getting the most out of these tools aren't necessarily the most technical. They're the ones who know what they want and can describe it well.
