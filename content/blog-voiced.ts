// v3 — voice-injected version of "plumber for running toilet".
// Same URL/slug as v2. Content written against references/voice.md + humour/stats/stories/opinions.
// v5 consumes this same content and layers on-page SEO (FAQ/Breadcrumb/Author/TOC) around it.
// v6 same content, technical SEO applied site-wide.

export const voicedPost = {
  slug: "plumber-for-running-toilet",
  title: "Plumber for a running toilet: fix it yourself or call one?",
  description:
    "Running toilet won't stop? 9 out of 10 times it's a $20 flapper you can swap in 30 min. Here's how to tell, how to fix it, and what a plumber actually costs.",
  publishedAt: "2026-04-18",
  readingMinutes: 7,
  primaryKeyword: "plumber for running toilet",
  keywordCluster: [
    "plumber for running toilet",
    "why is my toilet running",
    "how to stop a running toilet",
    "toilet flapper replacement",
    "how much to fix a running toilet",
  ],
  author: {
    name: "Marco D'Agostino",
    role: "Owner, licensed plumber",
    licence: "VIC-PL-48217",
    years: 22,
    bio: "Qualified in 2004. Started Plumbing Co in 2009 out of a borrowed garage in Windsor after getting sick of watching other plumbers rip people off on emergency jobs. Still answers his own phone.",
  },
  heroImageAlt:
    "Open toilet cistern showing the flapper valve and fill valve",
  // Pexels image map — hero + one per H2 heading in the body.
  // Keys match the slugified H2 text (except "hero"). Fetched by scripts/fetch-pexels.mjs.
  // Image map — hero + one image per H2 heading. Keys MUST match slugifyHeading output.
  // H2 structure matches the top-3 SERP for "plumber for running toilet" (Apr 2026 search).
  images: {
    hero: {
      query: "modern bathroom toilet clean",
      alt: "Modern clean white toilet in a bright bathroom",
    },
    "why-is-my-toilet-running-the-5-common-causes": {
      query: "toilet tank interior mechanism",
      alt: "Open toilet cistern showing the internal tank mechanism",
    },
    "signs-you-have-a-running-toilet-beyond-the-obvious-noise": {
      query: "water meter residential",
      alt: "Residential water meter with flow indicator",
    },
    "tools-youll-need": {
      query: "plumbing tools workbench",
      alt: "Plumbing tools laid out on a workbench",
    },
    "how-to-stop-a-running-toilet-step-by-step": {
      query: "plumber bathroom tools repair",
      alt: "Plumber working on a toilet cistern",
    },
    "toilet-flapper-replacement-the-20-fix": {
      query: "plumbing parts hardware store",
      alt: "Assorted plumbing parts on a workbench",
    },
    "fill-valve-replacement-if-the-flapper-isnt-it": {
      query: "toilet fill valve",
      alt: "Toilet fill valve inside an open cistern",
    },
    "when-to-call-a-plumber": {
      query: "plumber working bathroom professional",
      alt: "Licensed plumber working under a bathroom fixture",
    },
    "how-much-to-fix-a-running-toilet-honest-numbers": {
      query: "calculator invoice receipt desk",
      alt: "Calculator and invoice on a desk",
    },
    "how-much-water-does-a-running-toilet-waste": {
      query: "running water waste faucet",
      alt: "Water running from a tap",
    },
    "two-things-most-other-guides-miss": {
      query: "dual flush toilet buttons",
      alt: "Dual-flush buttons on a modern toilet",
    },
    "frequently-asked": {
      query: "homeowner thinking question",
      alt: "Homeowner on the phone asking a question",
    },
    "still-stuck-give-us-a-call": {
      query: "phone call help support",
      alt: "Person calling on the phone for help",
    },
  },
  tldr:
    "Nine out of ten: $20 flapper, 30 minutes, less complicated than flat-pack furniture and with fewer leftover screws. Food-dye test to confirm — drops in the tank, wait 15, don't flush, check the bowl. Bowl coloured → flapper. Bowl clear → fill valve ($50, 20 min). Call a plumber only if you've swapped the flapper twice and it's still running, water's on the floor, or the isolation valve's seized. Ignoring it costs $240–$1,080 a year — today's worth $3, tomorrow too. You see where this is going.",
  body: `
Your toilet has been hissing for longer than most celebrity marriages. It's 11pm, you're googling "plumber for running toilet" instead of sleeping, and you're starting to take the sound personally. Good news: you're probably not calling anyone tonight.

**The quick answer:** if your toilet won't stop running, it's almost always the flapper valve — the rubber disc at the bottom of the tank. Drop a few drops of food colouring into the tank, wait 15 minutes, and don't flush. If the bowl turns coloured, replace the flapper ($20, 30 minutes). If the bowl stays clear, it's the fill valve ($50, 20 minutes). You only need a plumber if you've replaced the flapper twice and it's still running, water is leaking from under the tank, or the isolation valve behind the toilet won't shut off.

That's the 15-second version. If you're happy with that, close the tab and go stare at a wall for ten minutes — you've earned it.

Still reading? Right. You're the kind of person who wants the full story, which is either a virtue or a warning sign, I haven't decided. Let's unpack this properly. By the end of it you'll know more about flush mechanisms than 98% of adults, which you can use at dinner parties. Or, more realistically, you cannot.

## Why is my toilet running? The 5 common causes

Take the lid off the cistern. Yes, it comes off. No, you won't break it. That porcelain has outlasted three political parties, it'll survive you. What you're looking at inside is one of five things going wrong, in order of how often I see them:

**1. The flapper valve isn't sealing.** That's the rubber disc at the bottom of the tank — the "flappy bit", which is, I'm told, not the technical term. (It is now.) It lifts when you flush. Over 5–7 years the rubber hardens, warps, or collects enough mineral build-up to make a stalactite jealous, and the tank leaks water into the bowl continuously. **About 80% of jobs.**

**2. The fill valve won't shut off.** That's the tall tower on the left side of the tank. It's supposed to fill the tank to a set level and stop — like a reasonable appliance. When it fails, water keeps running in until the overflow tube politely takes it away, which is why you hear that constant trickle that sounds exactly like someone in the next room judging you. **About 10%.**

**3. The float is stuck or out of whack.** Either the float is physically caught on something, or the water level is set too high — permanently above the overflow. Usually a 30-second fix. If this is you, congratulations: that's the plumbing equivalent of finding a $50 note in last winter's jacket. **About 5%.**

**4. The chain is too short, too long, or tangled.** The chain runs from the flush lever to the flapper. Too short and it holds the flapper open permanently. Too long and the flapper doesn't lift when you flush. Tangled and it's anyone's guess — usually the cat. **About 3%.**

**5. The overflow tube is cracked or too short.** The overflow tube is the vertical pipe that drains excess water into the bowl. If there's a crack below the water line, or if the tube is shorter than the water level (common on older toilets), water constantly pours from tank to bowl through the tube itself. **About 2%.** You'll usually see this one on toilets installed before the early 90s, back when people still trusted cheques in the mail.

Before you buy a single part, figure out which of the five you're dealing with. The food-dye test below sorts 95% of cases. The other 5% involve phoning someone, and that someone might be us.

## Signs you have a running toilet (beyond the obvious noise)

The obvious sign: you can hear it. Water trickling constantly, or a fill valve kicking in every ten minutes. Classic. But some running toilets are silent thieves, and you'll only catch them one of three ways:

**Phantom flushing.** The toilet refills on its own every 5–15 minutes, even when no one's touched it. This is a slow flapper leak — the tank slowly loses water to the bowl, the fill valve tops it up, stops, cycle repeats. If you hear the fill valve running and you know nobody's flushed, that's a running toilet doing its thing in stealth mode. Like a burglar, but dumber.

**Your water bill jumped.** If last quarter's bill is 20% higher and nothing else has changed, don't start interrogating your neighbours — go check the toilets. A single slow-running toilet can add $30–$90 a month. One of my customers spent three months blaming her teenager's showers. It was the downstairs loo. The teenager was, for once, innocent.

**The water meter test.** This one is genuinely satisfying. Turn off every tap in the house. Turn off the dishwasher, the washing machine, the garden drip line, everything. Go outside, find the water meter (usually a blue or black box near the front footpath), and watch the flow indicator — that's the small triangle or spinning wheel on the dial. If it's moving, something's leaking somewhere. Running toilets are the most common culprit by a very long way.

**The silent leaker.** Some toilets leak so slowly the sound is gone entirely. Nothing visible in the tank. Water bill still creeping up. Only the food-dye test catches these. Which brings us to the next section, thank God, because I was running out of ways to say "your toilet is leaking."

## Tools you'll need

You don't need much. That's the good news. The bad news is that "not much" still means a trip to Bunnings if you don't already have these:

**For diagnosing:**
- Food colouring — any colour. Blue is classic. Red is dramatic. Green if you want the leak to look vaguely environmental.
- Ten minutes.
- Mild patience. If you have strong patience, redirect it to something that matters more, like raising children.

**For a flapper swap (80% of jobs):**
- Replacement flapper ($20–$25 at Bunnings — bring the old one so you can match it by hand)
- A towel (for drips and looking professional)
- Your phone (for photos of the old setup before you pull anything off — because you will not remember what it looked like and the internet will lie to you about it)

**For a fill valve swap:**
- Replacement fill valve ($35–$60)
- Adjustable wrench or multigrip pliers
- Bucket and towel
- The courage to put your hand in cold cistern water, which is cleaner than most people think but still not nice. Think of it as exposure therapy.

That's it. No torch. No specialty tools. No "plumber's snake". If someone online tells you you need a plumber's snake for a running toilet, close the tab and back away slowly — that person has other plans for you.

## How to stop a running toilet — step by step

### Step 1 — Do the food-dye test (the 15-minute sorting hat)
Drop a few drops of food colouring into the tank water. Put the lid back on. Wait 15 minutes. **Don't flush.** (I know. You'll want to. Resist. This is the closest plumbing ever gets to a Netflix cliffhanger.) Check the bowl.

- Bowl water turns coloured → flapper is leaking. Go to Step 3.
- Bowl stays clear but tank is still refilling → fill valve or float. Go to Step 4.
- Nothing is happening, tank is stable, bowl is clear → your toilet may have sorted itself out, or you misdiagnosed. Touch the flush lever. If it's still running now, food-dye again.

### Step 2 — Shut off the water
Find the isolation valve behind the toilet — that's the small tap on the wall where the supply line comes out. Turn it clockwise until it stops. Only this toilet's water goes off; rest of the house keeps working. Your housemate can keep making coffee. Peace reigns. Society holds.

### Step 3 — Fix the flapper
Push the flapper down by hand. Still trickling past? Rubber warped, cracked, or coated in brown build-up that looks vaguely like a suspicious dessert? That's a dud. See the Toilet flapper replacement section below — I'll walk you through it like I'm your dad, except less disappointed.

### Step 4 — Fix the fill valve or float
If food-dye didn't show in the bowl but the tank is still refilling, the fill valve isn't shutting off. Sometimes it's just the float set too high — try bending the old-style ball-float arm down slightly, or rotating the screw on top of a new-style column float. You want the water level about 2.5 cm below the top of the overflow tube. Essentially: stop trying to fill the tank past its own safety exit.

If adjusting the float doesn't work, the fill valve itself is done. See the Fill valve replacement section. Do not Google this at midnight. It will not end well.

### Step 5 — Test and adjust
Turn water back on. Let the tank fill. Flush it. Listen. Watch. If it's silent and the tank sits still — you're done. Pour yourself something. You've just saved $149.

## Toilet flapper replacement — the $20 fix

This is what most running toilets actually need, so I'll walk through it properly.

1. **Shut off the water** at the isolation valve behind the toilet (the small tap on the wall).
2. **Flush** to empty the tank. Hold the handle down a second or two longer than usual to squeeze the last bit out.
3. **Unhook the old flapper.** Two clips at the base — usually on "ears" either side of the overflow tube — and one clip for the chain running up to the flush lever. **Take a photo first.** You will not remember what it looked like ten minutes from now. I've been doing this twenty-two years and I still take the photo.
4. **Take it to [Bunnings](https://www.bunnings.com.au/our-range/bathroom-plumbing/toilets-accessories).** Match it by hand. Do not guess sizes. Bring the old flapper. The aisle you want is the one next to the mysterious hardware your dad could identify on sight. $20–$25 for a universal replacement.
5. **Hook the new one on.** Clip the base onto the same ears. Reattach the chain. **Chain tension matters** — tight enough to lift the flapper cleanly when you flush, loose enough it doesn't hold the flapper up. Aim for about 1 cm of slack when the flapper is down. This is the single most-gotten-wrong step, because it's the only one that requires you to have a feel for something rather than follow an instruction. Test-flush five times. Adjust if the flapper doesn't seat cleanly.
6. **Turn the water back on.** Let the tank fill. Test-flush. Check for leaks around the base of the toilet and at the supply-line connection.

If it's still running after a new flapper, the flapper wasn't the problem. Back to the food-dye test — if the bowl stays clear, you're looking at the fill valve, not the flapper. (This is the plumbing version of "are you sure it's plugged in?")

## Fill valve replacement (if the flapper isn't it)

The fill valve is the tall tower on the left of the tank. Replacing it takes 20 minutes once you've done one. First time? Budget 35. And possibly a cup of tea.

1. **Shut off the isolation valve** behind the toilet.
2. **Flush** to empty the tank. Towel under the valve to catch the last dribble. (That is a professional plumbing term. "Dribble.")
3. **Disconnect the water supply line** underneath the tank. Unscrew it by hand; it should be hand-tight. If it's not hand-tight, someone before you over-tightened it — pliers, gentle counterclockwise twist.
4. **Unscrew the shank nut** — that's the big plastic ring holding the fill valve to the bottom of the tank. Counterclockwise. Pliers or an adjustable wrench. This is the "Indiana Jones swapping the idol for a sandbag" moment of the job.
5. **Lift the old fill valve out.** It comes out through the top of the tank. Say something nice to it if it served you well.
6. **Drop the new one in.** Modern valves are height-adjustable — set it so the top of the valve is at least 2.5 cm above the overflow tube.
7. **Thread the shank nut back on** from underneath. Hand-tight plus a quarter-turn with pliers. Do not over-tighten. Tanks are porcelain, and porcelain is not forgiving. Neither is your insurance.
8. **Reconnect the supply line.** Hand-tight, quarter-turn with pliers. Again: do not over-tighten. Over-tightening is responsible for more plumbing damage than most actual plumbing failures.
9. **Turn water back on.** Let the tank fill. Test-flush.

If this sounds like a lot of steps: it is. But each one takes about 90 seconds, and by step three you'll have the pattern. Your toilet has been listening to you talk through this the whole time. It appreciates you.

## When to call a plumber

Every other plumber's website shouts "call a professional immediately!!!" We are, notably, not every other plumber.

Call someone — us or anyone — if any of these are true:

- **You've replaced the flapper twice and it's still running.** Something else is wrong. Probably a warped overflow tube, a hairline crack in the tank, or the flush valve seat itself is worn. These aren't DIY jobs.
- **Water is leaking from under the tank onto the floor.** That's the tank-to-bowl gasket. Not complex, but it means lifting the tank off the bowl — and most people don't do that gracefully the first time. I've seen tanks come down in ways that would concern the physics department at Monash.
- **The isolation valve behind the toilet won't shut off.** Old valves seize. If you can't stop the water at the wall, you can't work on the toilet — and now the whole house's water needs to go off, which is, depending on who else lives with you, a political situation.
- **Multiple toilets in the house are doing the same thing.** That's not a toilet problem. That's a water-supply-upstream problem, and no amount of flapper-swapping will help. If you're also noticing [low water pressure across the house](/v2/), those two symptoms together almost always point at the same cause.
- **You've opened the tank and nothing looks like any of the pictures in this post.** Fair enough. Some older toilets are built like escape rooms. Call someone who's seen them before.

## How much to fix a running toilet — honest numbers

These are real 2026 prices. Flat. All-in. Approved before we start. Not "starting at". Not "up to". Not "in most cases". Just the number, which is apparently a revolutionary concept.

| What you're doing | DIY cost | Our flat price |
|---|---|---|
| Flapper replacement | $20–$25 at Bunnings | $149 all-in |
| Fill valve replacement | $35–$60 at Bunnings | $189 all-in |
| Tank-to-bowl gasket | Don't | $249 all-in |
| New toilet installed | — | $450–$650 |

The $149 includes parts, labour, test flush, and a leak check. No call-out fee bolted on at the end like a bad credit card surcharge. If we get there and it's more complex than the phone call suggested, we stop, re-quote, and wait for you to say yes. I realise I'm describing a revolutionary business concept here. If you'd rather just see the whole pricing table in one spot — [that's on our toilet repair service page](/v4/).

**Honest opinion:** if you're comfortable putting your hand in a tank of clean water and holding a screwdriver, try DIY first. Genuinely. I'd rather you save the $149 and call us for the next thing than pay us for something you could've done in a Sunday afternoon. (Shocking business advice from a business, I know. My accountant is thrilled.)

## How much water does a running toilet waste?

Depending on how bad it is:

| Severity | Litres per day | Per month |
|---|---|---|
| Slow leak (flapper just starting to fail) | 200 L | ~6,000 L |
| Moderate leak (flapper clearly warped) | 400 L | ~12,000 L |
| Full "won't stop filling" failure | 750 L+ | ~22,500 L |

A moderate leak over a year is 146,000 litres. That's four backyard above-ground pools. Or about $500–$1,200 in extra water bill that you could've spent on almost literally anything else — groceries, rent, a mediocre holiday, therapy. If you want the guilt-trip version, the [Australian Government has a whole page on reducing household water demand](https://www.yourhome.gov.au/water/reducing-water-demand) — skim it while the kettle boils.

A $20 flapper has probably the best ROI of any hardware purchase in your house. Dishwasher doesn't save you $1,000 a year. Solar might, eventually. A flapper can do it in a month. It's the Warren Buffett of your bathroom.

## Two things most other guides miss

Every plumber and home-improvement site covers the basics above. Two things you won't find elsewhere — and they matter:

### 1. Dual-flush (Caroma) toilet quirks

Most Australian toilets installed after 2005 are dual-flush: half button, full button, separate mechanisms for each. When the "half-flush" side starts running, the problem often isn't the flapper in the traditional sense. It's the **button mechanism** at the top of the cistern, which can stick open. American-style "rubber flapper" advice doesn't apply cleanly here, which is the kind of thing that sends a homeowner six Reddit threads deep at 11pm.

If your toilet is Caroma (or any dual-flush) and it's running:

1. Press each button firmly and let it pop back up cleanly. Sometimes the button is just stuck. Rare, but yes, the fix is literally "have you tried pressing it harder."
2. Lift the top cap off the flush mechanism (it usually twists counterclockwise) and check the internal spring and release arm.
3. If the mechanism itself is worn, Caroma sells a complete replacement kit for about $45 that fits most of their models from 2005 onwards.

This has saved my customers hundreds of dollars in unnecessary call-outs over the years. You're welcome.

### 2. The 12-month cost projection most people never do

Because water bills come quarterly, we don't feel the drip in real time. Here's the math nobody writes down:

| How long it's been running | What it's cost you |
|---|---|
| 1 week | $2–$5 |
| 1 month | $20–$90 |
| 6 months | $120–$540 |
| 12 months | $240–$1,080 |

A $20 flapper costs less than most people spend on coffee in a week. The math should be unambiguous. It usually isn't, because we only see the bill every three months and by then we've mentally amortised it. If you've been ignoring it "until you have time" — today is worth about $3. Tomorrow, $3. This will continue until one of you cracks. If you've been ignoring it "until you have time" — today is worth about $3.

## Frequently asked

**What's the most common cause of a constantly running toilet?**
A worn flapper — the rubber seal at the bottom of the tank. It's the cause about 80% of the time. The food-dye test confirms it in 15 minutes.

**Can I fix a running toilet without turning off the water?**
Technically, yes, for some adjustments (like bending a float arm). For anything involving removing parts — the flapper, the fill valve, the chain — shut the isolation valve off first. Trying to do it with the water on is the plumbing equivalent of changing a tyre while the car's moving.

**What are the signs of a worn toilet flapper?**
Constant or intermittent trickle into the bowl, brown mineral build-up on the rubber, warping or cracking, the bowl turning coloured in the food-dye test. Also: it's more than five years old and you've never replaced it. Rubber is a consumable. Treat it like one.

**What happens if you don't fix a running toilet?**
Your water bill goes up by $20–$90/month. Over a year that's $240–$1,080. Eventually the component fails completely and you're replacing more than just the flapper. Also — and this is the one nobody mentions — the constant trickle can cause mineral staining in the bowl that's nearly impossible to clean off once it sets.

**Can I fix a running toilet myself?**
Yes, nine times out of ten. A flapper swap is 30 minutes of work and $20 of parts. If you're comfortable holding a screwdriver and putting your hand in clean cistern water, you can do this. If either of those sounds bad, call someone.

**Will a running toilet eventually stop on its own?**
No. The flapper isn't going to un-warp, and fill valves don't self-repair. If it's running now, it'll keep running until someone does something. Possibly forever — which, at Melbourne water rates, would make for an impressive bill.

**How much water does a running toilet waste?**
200–750 litres per day depending on severity. On Melbourne rates, $20–$90 per month on your bill. A moderate leak over a year is enough to fill four above-ground pools.

**How much does it cost to fix a running toilet?**
DIY: $20–$60 for parts. Plumber call-out (flat price, like ours): $149–$249 depending on whether it's a flapper, fill valve, or gasket. Emergency after-hours is more. Always get the price before the work starts.

**Is a running toilet an emergency?**
Not usually. Unless it's overflowing onto the floor, it's fine to leave overnight. Shut the isolation valve behind the toilet to stop the water in the meantime. The toilet will live. Probably.

## Still stuck? Give us a call

If you've done the food-dye test, swapped the flapper, said a few words you'd like to take back, and it's still running — give us a call on (03) 9041 8200 and describe what you're seeing. We'll tell you honestly whether a second part is worth buying or whether it's worth us coming out. Same-day if you ring before 2pm, across Prahran, South Yarra, St Kilda, Windsor, Toorak, Armadale, Malvern, Caulfield, Elwood, and Brighton.

And if you've read this far, congratulations. You now know more about the internal workings of a toilet than 98% of adults. Wear that knowledge with dignity. Maybe not at parties. But certainly at home.
  `.trim(),
  // FAQs map to the "People Also Ask" questions from Google's SERP for this keyword cluster.
  // Sourced from the top-3 ranking pages' FAQ sections (Apr 2026).
  faqs: [
    {
      q: "What's the most common cause of a constantly running toilet?",
      a: "A worn flapper — the rubber seal at the bottom of the tank. It's the cause about 80% of the time. The food-dye test confirms it in 15 minutes.",
    },
    {
      q: "Can I fix a running toilet without turning off the water?",
      a: "Technically yes for small adjustments (like bending a float arm). For anything involving removing parts, shut the isolation valve off first. Doing it with the water on is the plumbing equivalent of changing a tyre while the car's still moving.",
    },
    {
      q: "What are the signs of a worn toilet flapper?",
      a: "Constant or intermittent trickle into the bowl, brown mineral build-up on the rubber, warping or cracking, the bowl turning coloured in the food-dye test. Also: it's more than five years old and you've never replaced it. Rubber is a consumable.",
    },
    {
      q: "What happens if you don't fix a running toilet?",
      a: "Your water bill jumps by $20–$90/month. Over a year that's $240–$1,080. Eventually the component fails completely and you're replacing more than just the flapper. The constant trickle can also cause mineral staining in the bowl that's nearly impossible to clean off once it sets.",
    },
    {
      q: "How much water does a running toilet waste?",
      a: "200–750 litres per day depending on severity. On Melbourne rates, $20–$90 per month on your bill. A moderate leak over a year is enough to fill four backyard above-ground pools.",
    },
    {
      q: "Can I fix a running toilet myself?",
      a: "Yes, nine times out of ten. A flapper swap is 30 minutes of work and $20 of parts. If you're comfortable holding a screwdriver and putting your hand in clean cistern water, you can do this.",
    },
    {
      q: "How much does it cost to fix a running toilet?",
      a: "DIY: $20–$60 for parts. Plumber call-out with a flat price like ours: $149 for a flapper, $189 for a fill valve, $249 for a tank-to-bowl gasket. Always get the price before the work starts — never agree to 'we'll see'.",
    },
    {
      q: "Will a running toilet eventually stop on its own?",
      a: "No. The flapper isn't going to un-warp, and fill valves don't self-repair. If it's running now, it'll keep running until someone does something. Possibly forever — which, at Melbourne water rates, would make for an impressive bill.",
    },
  ],
};
