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
      "approach": "My approach centered on getting close to peer reviewers and understanding how they are using our tools. I ran direct research and stakeholder interviews to surface pain points that weren't showing up in tickets, then translated those findings into shipped UX and process improvements. From there, I owned roadmap prioritization for the team — balancing user impact against engineering cost and business priority to sequence what actually got built each quarter. I leveraged AI-assisted workflows to proactively make changes that were not high-priority for engineers. Throughout, I mentored junior designers on craft, systems thinking, and conflict resolution as the team expanded and contracted over the years.",
      "outcome": "Reduced TTM by 84% over four years and increased peer reviewer capacity by 83%",
      "metric": null,
      "img": "",
      "video": "",
      "overlayColor": "",
      "overlayOpacity": 0,
      "backgroundColor": "",
      "gallery": [],
      "overlayBlendMode": "normal",
      "galleryModal": false,
      "demos": [
        {
          "url": "https://www.figma.com/deck/ZrwFGy6HwrfosmznoZlpzJ/Balancing-efficiency-and-quality-presentation?node-id=0-1&t=F2yVll2M1y5HgzwH-1",
          "label": "View Project Presentation"
        }
      ]
    }
  },
  "branch": {
    "password": "parrot",
    "content": {
      "description": "Designed core lending and financial product flows for Branch's mobile-first platform serving emerging markets across Africa and India.",
      "role": "Lead Product and Brand Designer",
      "approach": "123",
      "outcome": "",
      "metric": {
        "value": "30 million",
        "label": "Downloads"
      },
      "img": "/uploads/hero-branch-1783976880696.png",
      "video": "",
      "overlayColor": "#19355e",
      "overlayOpacity": 0.78,
      "backgroundColor": "#19355e",
      "gallery": [
        "/uploads/work-branch-1-1783965043976.png",
        "/uploads/work-branch-4-1783965053000.png",
        "/uploads/work-branch-3-1783965056615.png",
        "/uploads/work-branch-2-1783965061157.png"
      ],
      "overlayBlendMode": "normal",
      "galleryModal": false,
      "demos": [
        {
          "url": "/work/branch/credit-score",
          "label": "Try the interactive credit score animation"
        }
      ]
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
      "video": "",
      "overlayColor": "",
      "overlayOpacity": 0,
      "backgroundColor": "",
      "gallery": [],
      "overlayBlendMode": "normal",
      "galleryModal": false,
      "demos": []
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
