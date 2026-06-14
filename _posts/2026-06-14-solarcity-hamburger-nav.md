---
layout: post
title: "When a hamburger cost us conversions"
date: 2026-06-14
category: Case Study
lede: "The desktop navigation was hidden behind a hamburger menu. Then we ran an experiment. The experiment took a week, and we should have done it sooner."
read_time: 4
tags: [Case Study, Digital, Experimentation, SolarCity]
toc:
  - { id: "the-hypothesis", title: "The hypothesis" }
  - { id: "the-experiment", title: "The experiment" }
  - { id: "the-results", title: "The results" }
---

When SolarCity NZ rebuilt its website in 2019, the design agency came back with something new: a hamburger menu on desktop. The kind of thing you'd normally see on mobile, tucked into the top corner, three horizontal lines expecting you to know what it means.

The brief had been to modernise the site. The agency's view was that a clean hamburger kept the design uncluttered. The timeline was tight — a few weeks end to end. There was no time for user testing, no time to prototype alternatives. So we shipped it, knowing it was a risk. Any version of the new site was going to be better than what we had. And as it was, we had already decided to skip a lot behind the scenes (read: the entire CMS) to make sure we hit launch timelines. Sometimes you gotta do what you gotta do.

## The hypothesis
{: id="the-hypothesis"}

I had a suspicion that desktop visitors weren't recognising the hamburger as navigation. If you'd grown up with the web before mobile, three horizontal lines in a corner wasn't obvious. The result would be visitors sitting on the page they landed on, not finding what they were looking for, and either bouncing or spending time hunting. Jakob's law in full effect (no relation).

My hypothesis was by replacing the hamburger with a traditional horizontal navigation bar would help visitors find information faster, allow visitors to find more information (increase pages per session), reduce time on site (a counterintuitive success metric — faster time-to-information is good), and reduce bounce rate.

## The experiment
{: id="the-experiment"}

I set up an A/B test using Google Optimize, splitting desktop traffic between the original hamburger navigation and a new horizontal nav. The test ran for two weeks across 984 sessions in the original variant and 849 in the challenger.

## The results
{: id="the-results"}

The results were unambiguous.

**Pages per session** improved from 3.29 to 3.68 — a 7–18% modelled improvement with 100% probability of the horizontal nav being the better variant. Visitors were exploring more of the site.

<div class="screenshot-scroll">
  <div class="screenshot-scroll-bar">
    <div class="screenshot-scroll-dots"><span></span><span></span><span></span></div>
    <span class="screenshot-scroll-label">Google Optimize — Pages per session</span>
  </div>
  <div class="screenshot-scroll-body">
    <img src="/assets/images/solarcity-nav-pages-per-session.webp" alt="Google Optimize experiment results showing horizontal nav achieving 3.68 pages per session versus 3.29 for the original hamburger menu, with 100% probability to be best">
  </div>
</div>

**Session duration** fell from 3:16 to 2:57. That sounds like a regression but it's the opposite — visitors were finding what they needed faster. Less time wandering, more time on the right page.

<div class="screenshot-scroll">
  <div class="screenshot-scroll-bar">
    <div class="screenshot-scroll-dots"><span></span><span></span><span></span></div>
    <span class="screenshot-scroll-label">Google Optimize — Session duration</span>
  </div>
  <div class="screenshot-scroll-body">
    <img src="/assets/images/solarcity-nav-session-duration.webp" alt="Google Optimize experiment results showing session duration reduced from 3:16 to 2:57 with horizontal nav, indicating visitors found information faster">
  </div>
</div>

**Bounce rate** dropped from 6.91% to 4.83% — a 93% probability that the horizontal nav was responsible, with a modelled improvement of up to 56%.

<div class="screenshot-scroll">
  <div class="screenshot-scroll-bar">
    <div class="screenshot-scroll-dots"><span></span><span></span><span></span></div>
    <span class="screenshot-scroll-label">Google Optimize — Bounce rate</span>
  </div>
  <div class="screenshot-scroll-body">
    <img src="/assets/images/solarcity-nav-bounce-rate.webp" alt="Google Optimize experiment results showing bounce rate reduced from 6.91% to 4.83% with horizontal nav, 93% probability to be best">
  </div>
</div>

We shipped the horizontal nav immediately.
