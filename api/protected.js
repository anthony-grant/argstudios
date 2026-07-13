// Vercel serverless function — this file runs on the server only.
// It is never bundled into the client JavaScript, so the passwords and
// content below are not visible to site visitors until unlocked.
//
// Managed by the /admin panel — edit protected project content and
// passwords there instead of hand-editing this file.

const PROTECTED = {
  "meta": {
    "password": "parrot",
    "content": {
      "description": "Lead Product Designer for Ads Integration Portal—a governance tool used by 100+ teams to review and approve every feature launch into Ads Manager before it reaches advertisers. Reduced TTM from 56 days to 9 days—an 84% improvement over four years. Led and or contributed to multiple product and process improvements.",
      "role": "Lead Product Designer",
      "approach": "If you don't have a hard number, even a rough scope number helps (\"used by 12 product teams,\" \"reviews ~40 launches a quarter\") — it does more work than \"high-quality\" ever will. Do you have any usage or efficiency numbers for this project, even approximate ones?",
      "outcome": "Reduced TTM by 84% over four years\nIncreased peer reviewer capacity by XX%",
      "metric": null,
      "img": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&auto=format",
      "gallery": [],
      "demo": null
    }
  },
  "branch": {
    "password": "parrot",
    "content": {
      "description": "Designed core lending and financial product flows for Branch's mobile-first platform serving emerging markets across Africa and India.",
      "role": "Lead Product Designer",
      "approach": "123",
      "outcome": "",
      "metric": {
        "value": "30 million",
        "label": "Downloads"
      },
      "img": "/uploads/placeholder-1783905482300.jpg",
      "gallery": [
        "/uploads/img-3412-edited-2-1783905518883.jpg"
      ],
      "demo": {
        "url": "/work/branch/credit-score",
        "label": "Try the interactive credit score animation"
      }
    }
  },
  "ujet": {
    "password": "parrot",
    "content": {
      "description": "Shaped the product design direction for UJET's cloud contact-center platform — agent tooling, customer-facing flows, and omnichannel interaction design.",
      "role": "",
      "approach": "",
      "outcome": "",
      "metric": null,
      "img": "https://images.unsplash.com/photo-1686061592689-312bbfb5c055?w=800&h=600&fit=crop&auto=format",
      "gallery": [],
      "demo": null
    }
  }
};

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { slug, password } = req.body || {};
  const entry = PROTECTED[slug];

  if (!entry) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  if (password !== entry.password) {
    res.status(401).json({ error: "Incorrect password" });
    return;
  }

  res.status(200).json(entry.content);
}
