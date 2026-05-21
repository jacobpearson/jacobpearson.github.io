---
layout: post
title: "ICT Protege Access+: rebuilding the mobile access control experience"
date: 2026-04-10
category: Case Study
lede: "ICT's legacy Protege Mobile app was built on deprecated frameworks the month it launched. I owned the full product rebuild — Access+ — from business case through to live releases on the App Store and Google Play."
read_time: 7
tags: [Case Study, Mobile, Product, Access Control]
toc:
  - { id: "the-problem", title: "The problem" }
  - { id: "what-we-built", title: "What we built" }
  - { id: "the-hard-parts", title: "The hard parts" }
  - { id: "what-i-owned", title: "What I owned" }
---

ICT's Protege Mobile app was old. Built on frameworks that were deprecated almost immediately after release, it didn't reflect the seamless customer experience ICT was known for in hardware — and it was actively blocking the roadmap. Mobile credentials, Apple Wallet integration, guest pass issuance: none of it was possible without rebuilding the foundation.

The replacement was Access+. Native iOS and Android apps, a new cloud API layer, and a ground-up rethink of how end-users — people who are three times removed from the engineering team and have zero security system experience — actually interact with building access.

<div class="carousel" aria-label="Access+ app screenshots">
  <div class="carousel-track">
    <div class="carousel-slide">
      <img src="/assets/images/ict-access-plus-door-control.webp" alt="Access+ Door Control — Badges screen with proximity unlock button for nearest door">
    </div>
    <div class="carousel-slide">
      <img src="/assets/images/ict-access-plus-guided-setup.webp" alt="Access+ Guided Setup — onboarding flow showing how to unlock a door via reader tap">
    </div>
    <div class="carousel-slide">
      <img src="/assets/images/ict-access-plus-dashboard.webp" alt="Access+ Dashboard — issues requiring attention, with controllers offline, alarms, and health status counts">
    </div>
    <div class="carousel-slide">
      <img src="/assets/images/ict-access-plus-visitor-calls.webp" alt="Access+ Visitor Calls — video intercom incoming call with End and Unlock actions">
    </div>
    <div class="carousel-slide">
      <img src="/assets/images/ict-access-plus-site-controls.webp" alt="Access+ Site Controls — arm, force arm, stay arm, and instant arm options for building areas">
    </div>
  </div>
  <div class="carousel-controls">
    <button class="carousel-prev" aria-label="Previous">←</button>
    <div class="carousel-dots">
      <button class="carousel-dot active" aria-label="Slide 1"></button>
      <button class="carousel-dot" aria-label="Slide 2"></button>
      <button class="carousel-dot" aria-label="Slide 3"></button>
      <button class="carousel-dot" aria-label="Slide 4"></button>
      <button class="carousel-dot" aria-label="Slide 5"></button>
    </div>
    <button class="carousel-next" aria-label="Next">→</button>
  </div>
</div>

## The problem
{: id="the-problem"}

Physical access control has historically meant key cards or fobs — hold one up to a reader, door opens. Simple, reliable, almost foolproof. Any app replacing that experience has to meet the same bar: it must work under pressure, work offline, and work without training.

Three distinct problems needed solving:

**Replacing the card.** iOS doesn't support RFID without Apple Wallet, which carries an Apple fee, a new pricing model, and incompatibility with the thousands of existing card readers in the field. Android has broader NFC support, but Apple made up 70% of our user base. Bluetooth was the only viable path for iOS — but it introduced proximity detection complexity, background permissions, and latency expectations that card users wouldn't tolerate.

**Remote building management.** Protege Mobile allowed building managers to arm and disarm, lock and unlock doors, review access logs, and receive push notifications. The implementation required opening ports in on-site firewalls and communicating over a SOAP service — neither acceptable by current standards, and a recurring source of support calls.

**Intercom calls.** ICT makes intercom hardware that routes video calls to a mobile device, letting a resident or manager see who's at the door and unlock it remotely. The existing implementation was notoriously buggy, driven by a non-standard SIP implementation that caused dropped calls, missed notifications, and inconsistent behaviour across iOS and Android.

## What we built
{: id="what-we-built"}

- **Native iOS and Android apps** built with modern frameworks — no shared codebase shortcuts that create platform-specific failure modes
- **New authentication services** within ICT's infrastructure, replacing the old credential model
- **A cloud API server** that proxies communication with on-site controllers, eliminating the need for exposed firewall ports entirely
- **Proximity-triggered and manual unlock modes** — both Bluetooth proximity detection and a tap-to-unlock button, with voiceover and dark mode support, so users who aren't comfortable with proximity have an explicit fallback
- **Improved SIP stack** for intercom calls, including better push notification handling for iOS background states, while maintaining backward compatibility with existing Protege Mobile deployments

## The hard parts
{: id="the-hard-parts"}

The iOS Bluetooth situation was the most constrained design problem. Proximity detection on iOS requires continuous background Bluetooth scanning, which Apple restricts heavily to preserve battery. We had to tune detection sensitivity carefully — too aggressive and we'd drain the battery and trigger phantom unlocks; too conservative and the door wouldn't open until the user was already past it.

The manual unlock button was partly a UX decision and partly a trust one. In testing, users who weren't confident the proximity detection had "seen" them would stand in front of a door looking uncertain. Adding an explicit button — visible, tappable, confirmatory — resolved the anxiety without changing the underlying behaviour. The button and proximity detection both call the same unlock path.

Intercom push notifications on iOS were a separate problem entirely. iOS aggressively suspends background apps, which meant SIP INVITE messages arriving while Access+ was in the background would either be missed or delayed. The fix involved a hybrid approach: a push notification wakes the app, the app re-registers with the SIP server, and the call completes from there. That sequence had to be fast enough to feel like a normal incoming call — visible to the user before they'd decided to ignore it.

## What I owned
{: id="what-i-owned"}

- Business case and securing executive buy-in for a full rebuild rather than incremental patches
- Backlog and roadmap ownership across the full product lifecycle, as part of a wider Protege portfolio spanning firmware, web portals, and SDKs
- Discovery with end customers and integration partners to identify where the existing experience was breaking down
- Translating hardware and security system requirements into features usable by HR and IT staff without training
- Running incentivised internal and beta testing groups
- Coordinating iOS and Android releases, including App Store and Google Play submissions and review management
- Cross-functional collaboration with R&D, QA, support, and sales throughout
- Ongoing performance monitoring and customer communications post-launch
