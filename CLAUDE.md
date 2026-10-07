# Kinara

Working name. "Kinara" means shore: the safe place you reach after a storm. Rahul may rename it.

## What this is

A free, one-page website for girls and women in India who are hurt, controlled or blamed at home, often since childhood. It should feel like warm sunshine on a quiet shore: calm, gentle and safe.

Its job, in this order:
1. Help her feel less alone, and know that it is not her fault.
2. Calm her body and mind for a moment.
3. Connect her, in one tap, to trained people who can help.

Who uses it: mostly girls and women on low-cost Android phones (often 360px wide), on slow mobile data, sometimes with someone checking their phone. Many read an Indian language more easily than English.

Who builds it: Rahul, who is not a programmer. Explain every change in simple words. Build one thing at a time, and stop after each step so he can check it on his phone. When a step changes files, push the changes, open a pull request, and give Rahul its link with one line on what to check.

Tech: plain HTML, CSS and JavaScript. No frameworks, no build step, no npm packages. Hosted free on Vercel from this GitHub repository.
- index.html: the page, its styles, and the small Quick exit script.
- js/app.js: languages, the calm tools and the sound mixer. js/sea.js: the moving sunrise sea at the top (WebGL, with a painted CSS sky if WebGL is missing).
- lang/xx.js: one file per language. fonts/, images/, sounds/: everything the page needs, kept in this repository.
- vercel.json: only safety headers and caching.
- Stable address: https://kinara-lake.vercel.app (used in the og: tags).

## Safety rules (never break these)

1. Save nothing. No localStorage, sessionStorage, IndexedDB, cookies, or forms that submit anywhere. Anything she types disappears when she leaves. Text boxes use autocomplete="off", autocorrect="off" and spellcheck="false".
2. Load nothing from other websites. No analytics (Vercel Analytics included), ads, tracking pixels, social media embeds, CDNs or Google Fonts. Fonts, images and sounds live in this repository. Links she chooses to tap are fine.
3. Quick exit on every screen: a clear button fixed at the top, plus the Esc key (Esc always exits, even when a window is open). It stops every sound, clears the sand box, hides the page, then calls window.location.replace() with a neutral page (a weather search), so pressing Back does not return here. Quick exit must stay fully visible on a 320px-wide phone in every language (app.js shrinks the header step by step to make room).
4. Look harmless. The browser tab title, the web address and the link preview (description, og: tags) show only gentle, neutral words, never words like "abuse" or "violence".
5. No chat box, contact form, inbox or AI chatbot. Asking for help means one tap to a trained, 24x7 helpline.
6. Use only the numbers in "Verified helplines". Never invent, change or "correct" a number. If one looks wrong, tell Rahul instead of editing it.
7. Never promise what a helpline will do, or that a call is private. Say what they offer, and that she can ask them before giving her name.
8. Wherever suicide or self-harm is mentioned: no details of methods, a hopeful tone, and Tele-MANAS (14416) and 112 shown right there.
9. Never blame her. No "why didn't you leave" and no "you should". Short, warm sentences in simple words.
10. The helpline numbers must stay readable even if JavaScript fails to load.
11. Keep `<meta name="robots" content="noindex">` and the `X-Robots-Tag: noindex` header in vercel.json until Rahul says the site has launched.
12. Never invent stories, testimonials, quotes, "real stories", communities or listeners. Only real, credited material, used with permission.

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

Every 3 months: re-check every number against its source and every outside link in "Read, listen and look", then update the date in the footer and the key foot.checked in every lang file.

## How it should feel

The warmth of the ocean and morning sunshine. A safe shore after a storm.

- Look: inspired by Rahul's "Awaaz" prototype, made our own. A realistic, slow sunrise over a calm sea at the top (moonlit at night in dark mode), the girl with her flute in a polaroid, a few handwritten notes, soft watercolour doorways, and layered sea-wave dividers between sections (gentle swells, never stormy).
- Colours: warm sand, sea teal, soft aqua, sunrise gold, a touch of coral; the calm corner is a night-sea band. Text contrast meets WCAG AA in light and dark mode.
- Motion: slow and gentle. Nothing flashes, bounces or plays by itself. Respect prefers-reduced-motion (the sea becomes a still painting).
- Type: Newsreader for English headings, Caveat for handwritten notes, and Noto Serif for headings in each Indian script (only the script in use downloads). Body text uses the phone's own fonts, at least 18px. Urdu uses the phone's Nastaliq or Naskh font.
- Images: only Rahul's own pictures of the girl with the flute, plus public-domain paintings, saved as small AVIF and WebP files. No photos of real people, no video.
- Light: what loads before she scrolls stays under 300 KB over the network (now about 130 KB in English and about 210 KB in Bengali, which adds its heading font and language file). Sounds load only when she taps them; paintings and big images load only when she scrolls to them. It must work on slow 3G.
- Easy to use: tap targets at least 44px, works with screen readers, no tiny text, no sideways scrolling at 320px.

## What's on the site (one page, in this order)

1. Welcome: "Take a breath. You're not alone. None of this is your fault." Buttons to talk now or calm down, the languages, then four doorways (talk, calm, read and listen, rights) and a short tip: Quick exit, incognito tab, clear the history on a shared phone.
2. Talk to someone now: 112 first, then each helpline with a call button, a copy button, one line on what it helps with, and words she can say to start the call. Then the One Stop Centres and "what happens when you call".
3. Calm corner:
   - Sounds of the shore: ocean waves, birds in the sun, under the water (with little fish), and a bansuri flute. Real recordings (CC0 or CC BY, credited in the footer), loaded only when she taps. Each sound has on/off and its own volume; "Stop all sounds" and Quick exit stop everything.
   - The flute: real flute samples played live in Raag Bhupali over a tanpura. Each phrase rises for 4 seconds and falls for 6 (six breaths a minute), with soft swells and a breath of silence every few phrases. Keep this breathing pace; it is why the flute calms (research notes under "Why this flute?").
   - Breathe with the waves: the tide rises while she breathes in (4 seconds) and falls while she breathes out (6 seconds), with words guiding her, and a full-screen mode.
   - Write it in the sand: she types what is on her heart and a wave washes it away. Say clearly that nothing is saved or sent, and that some phone keyboards remember typed words.
   - Kind words: one gentle sentence at a time. Rahul approves every sentence before it goes in.
   - 5-4-3-2-1 grounding.
4. Read, listen and look: free paintings (public domain, stored here), free podcasts and articles from trusted sources. Outside sites are links only, never embedded, with a note that they may keep their own records.
5. Know your rights: the plain summary of the Protection of Women from Domestic Violence Act, 2005, marked as general information, not legal advice, pointing to 15100.
6. For family and friends: how to support her without blaming her.
7. Footer: "This site saves nothing", the "last checked" date, sources and credits.

## Languages

Twelve languages: English (en), Hindi (hi), Bengali (bn, Rahul's wife's language), Marathi (mr), Telugu (te), Tamil (ta), Gujarati (gu), Urdu (ur, right to left), Kannada (kn), Odia (or), Malayalam (ml) and Punjabi (pa).

- Each language is a file in lang/ with exactly the same keys as English (the English words in index.html plus the EN list in js/app.js).
- Claude drafts the translations. Until a native speaker has checked every line, the language shows a small notice at the top saying it was made with AI help and is still being checked. After the check, add the language to CHECKED in js/app.js, which hides the notice.
- Before launch (rule 11), every language must be checked, or removed from LANGS in js/app.js.
- The page opens in the phone's language (or ?lang=bn in the address) and never remembers her choice (rule 1).
- Numbers stay in plain digits (0-9) in every language. Keep the {n} slots and the ♡ hearts. Speak to her respectfully (आप, আপনি, మీరు and so on), in feminine forms where the language has them.
- When English text changes, change the same key in every lang file and take that language out of CHECKED until the new line is checked.

## Before every pull request

- Every lang file has every key, the same numbers and {n} slots, and 12 kind words.
- No request goes to any other website when the page loads (rule 2), and nothing is stored (rule 1).
- The page fits 360px and 320px phones with no sideways scrolling, Quick exit fully visible, in English, a long-word language (Tamil or Malayalam) and Urdu (right to left).
- Sounds start only on a tap, and Stop all sounds and Quick exit silence them.
- When you replace an image, sound or font, give the new file a new name, because phones keep the old file for up to 30 days (see vercel.json). When you change a lang file, change VERSION in js/app.js.
