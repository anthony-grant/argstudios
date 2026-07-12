# Case study content outline

Use this as the template for describing each project in `src/app/data.ts` (or,
for password-protected projects, in `api/protected.js`). Keep it short and
visual — 1-2 sentences per section, the images should carry most of the
weight.

## 1. Snapshot (already on the page)
- `title` — client/project name
- `category` — e.g. "Product Design" or "Comms Design"
- `tags` — 2-4 short keywords
- `description` — one sentence, the hook. Shown large on the hero.

## 2. Role
One line. What did you specifically own? ("Sole product designer," "Design
lead across a 4-person team," "Freelance brand identity.") Field: `role`.

## 3. Approach
1-2 sentences. The key decision or process that shaped the work — not a full
step-by-step, just the interesting part. Field: `approach`.

## 4. Outcome
1-2 sentences. What shipped, and how it landed — reception, adoption,
whatever's true. Doesn't need a number. Field: `outcome`.

## 5. Metric (optional)
If there's a real, specific number worth naming, add it — it renders as a
prominent stat instead of being buried in prose. Skip it entirely if nothing
fits; don't force one.

```
metric: { value: "3.2M", label: "monthly active users onboarded" }
```

Leave as `metric: null` when there isn't one.

## 6. Visuals
- `img` — the cover image, shown full-width right below the hero.
- `gallery` — an array of additional image URLs, shown as a grid below the
  writeup. Zero or many, however the project needs it:

```
gallery: [
  "https://.../shot-1.jpg",
  "https://.../shot-2.jpg",
]
```

Leave as `gallery: []` if the cover image is enough on its own.

## Where each project's fields live

- Regular projects (Branch, UJET, Eventbrite, Tilt, Facebook F8): edit the
  matching object in `src/app/data.ts`.
- Meta (password protected): edit the `meta` entry in `api/protected.js`
  instead — nothing about a protected project's content should live in
  `data.ts`, since that file ships to every visitor's browser.
- Additional Projects: not a case study — it's the tagged image gallery,
  edited separately (see the comment at the top of the `additionalImages`
  array in `data.ts`).

## Example (filled in)

```
{
  index: "02",
  slug: "branch",
  title: "Branch International",
  category: "Product Design",
  tags: ["Mobile", "Fintech", "UX"],
  description: "Designed core lending and financial product flows for Branch's mobile-first platform serving emerging markets across Africa and India.",
  role: "Product designer, lending team — one of three designers on a 12-person product org.",
  approach: "Rebuilt the loan application flow around offline-first patterns after usage data showed most sessions started on unreliable connections.",
  outcome: "Shipped to all five markets; became the default flow for new borrowers within two quarters.",
  metric: { value: "40%", label: "drop in application abandonment" },
  img: "https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?w=800&h=600&fit=crop&auto=format",
  gallery: [],
}
```

Until a project's `role`/`approach`/`outcome` are filled in, its page will
keep showing a "Case study coming soon" placeholder instead of empty
sections — so there's no rush, and nothing looks broken in the meantime.
