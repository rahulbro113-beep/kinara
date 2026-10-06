# Kinara

Working name. "Kinara" means shore in Hindi: the safe place you reach after a storm. Rahul may rename it.

## What this is

A free, one-page website for girls and women in India who are hurt, controlled or blamed at home, often since childhood. It should feel like warm sunshine on a quiet shore: calm, gentle and safe.

Its job, in this order:
1. Help her feel less alone, and know that it is not her fault.
2. Calm her body and mind for a moment.
3. Connect her, in one tap, to trained people who can help.

Who uses it: mostly girls and women on low-cost Android phones, on slow mobile data, sometimes with someone checking their phone. Many read Hindi or Kannada more easily than English.

Who builds it: Rahul, who is not a programmer. Explain every change in simple words. Build one thing at a time, and stop after each step so he can check it on his phone. When a step changes files, push the changes, open a pull request, and give Rahul its link with one line on what to check.

Tech: plain HTML, CSS and a little JavaScript in index.html, plus a fonts folder. No frameworks, no build step, no npm packages. Hosted free on Vercel from this GitHub repository.

## Safety rules (never break these)

1. Save nothing. No localStorage, sessionStorage, IndexedDB, cookies, or forms that submit anywhere. Anything she types disappears when she leaves. Text boxes use autocomplete="off", autocorrect="off" and spellcheck="false".
2. Load nothing from other websites. No analytics (Vercel Analytics included), ads, tracking pixels, social media embeds, CDNs or Google Fonts. Fonts live in the fonts folder. Links she chooses to tap are fine.
3. Quick exit on every screen: a clear button fixed at the top, plus the Esc key. It hides the page instantly, then calls window.location.replace() with a neutral page (a weather search), so pressing Back does not return here.
4. Look harmless. The browser tab title and the web address show only the site name, never words like "abuse" or "violence".
5. No chat box, contact form, inbox or AI chatbot. Asking for help means one tap to a trained, 24x7 helpline.
6. Use only the numbers in "Verified helplines". Never invent, change or "correct" a number. If one looks wrong, tell Rahul instead of editing it.
7. Never promise what a helpline will do, or that a call is private. Say what they offer, and that she can ask them before giving her name.
8. Wherever suicide or self-harm is mentioned: no details of methods, a hopeful tone, and Tele-MANAS (14416) and 112 shown right there.
9. Never blame her. No "why didn't you leave" and no "you should". Short, warm sentences in simple words.
10. The helpline numbers must stay readable even if JavaScript fails to load.
11. Keep `<meta name="robots" content="noindex">` until Rahul says the site has launched.

## Verified helplines (last checked 7 October 2026)

| Number | Name | What to say about it | Source |
|---|---|---|---|
| 112 | Emergency | Police, ambulance and fire. Free, 24x7, all of India. | National emergency number |
| 181 | Women Helpline | 24x7, toll-free. Any violence or abuse, at home or outside. Counselling, and links to police, One Stop Centres, hospitals and legal aid. Anyone can call on a woman's behalf. | https://www.publicservicesmap.in/schemes/women-helpline--whl-181 |
| 14490 | National Commission for Women | 24x7, toll-free, for women 18 and over. Complaints about domestic violence, cyber harassment, stalking and sexual violence. The same helpline also answers on 78271 70170. | https://www.tribuneindia.com/news/india/ncw-launches-24x7-short-code-helpline-14490-for-women-in-distress |
| 14416 | Tele-MANAS | Ministry of Health. Free mental health counselling, 24x7, in her own language. Also 1800 891 4416. | https://telemanas.mohfw.gov.in |
| 15100 | NALSA free legal aid | Toll-free. Women and children get free legal aid whatever their income. She can also visit the legal aid office at her district court. | https://nalsa.gov.in/promoting-inclusive-legal-system/ |
| 1098 | Child Helpline | 24x7, for anyone under 18. | https://nicobartimes.com/?p=25834 |

Sakhi One Stop Centres: in most districts. Medical care, police help, free legal aid, counselling, and shelter for up to 5 days. She can bring her daughters, and her sons up to age 12. She finds the nearest one by calling 181. Source: https://en.vikaspedia.in/viewcontent/social-welfare/women-and-child-development/women-development-1/one-stop-centre-scheme

Re-check every number against its source every 3 months, and update the date in the footer.

## How it should feel

The warmth of the ocean and morning sunshine. A safe shore after a storm.

- Colours: warm sand background, sea teal, soft aqua, sunrise gold, a touch of coral. Dark mode is a calm night sea with moonlit text. Text contrast meets WCAG AA in both.
- Shapes: soft wave dividers drawn in inline SVG, rounded corners, plenty of space.
- Motion: slow and gentle, like waves. Nothing flashes, bounces or plays by itself. Respect prefers-reduced-motion.
- Type: rounded, friendly and very readable, body text at least 18px. Fonts must cover Hindi and Kannada (for example Baloo 2 and Mukta for English and Hindi, and Baloo Tamma 2 or Noto Sans Kannada for Kannada).
- Light: the whole page under 500 KB. No photos or video. It must work on slow 3G.
- Easy to use: tap targets at least 44px, works with screen readers, no tiny text.

## What's on the site (one page, in this order)

1. Welcome: "Take a breath. You're not alone, and none of this is your fault." Then a short tip: open this site in an incognito tab, and on a shared phone clear the history afterwards.
2. Talk to someone now: 112 first, then each helpline with a call button, a copy button, one line on what it helps with, and "words to start the call" she can read out, such as "Hello, I need help. I am having problems at home. What can you help me with?"
3. Calm corner, five gentle tools:
   - Breathe with the waves: a wave rises while she breathes in (4 seconds) and falls while she breathes out (6 seconds), with words guiding her.
   - Write it in the sand: she types what is on her heart, taps a button, and a wave washes the words away. Say clearly that nothing is saved or sent. Gently mention that some phone keyboards remember typed words.
   - Sound of the sea: a soft ocean sound made with the Web Audio API (no audio files). It starts only when she taps play, with a volume slider and a stop button.
   - Kind words: one gentle sentence at a time; she taps for another. Rahul approves every sentence before it goes in.
   - 5-4-3-2-1 grounding: notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell and 1 you can taste.
4. Know your rights: the plain summary of the Protection of Women from Domestic Violence Act, 2005, already in index.html. Mark it as general information, not legal advice, and point to 15100.
5. For family and friends: how to support her without blaming her (already in index.html).
6. Footer: the sources, the "last checked" date, and "This site saves nothing you do here."

## Languages

English, Hindi and Kannada, with a simple switch at the top. Start in Hindi or Kannada when the phone is set to that language, but never remember her choice between visits (rule 1). Claude drafts the translations; Rahul checks every line before it goes live. Never publish an unchecked translation.
