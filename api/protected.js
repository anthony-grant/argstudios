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
      "overlayBlendMode": "normal",
      "backgroundColor": "",
      "gallery": [
        "/uploads/meta-case-study-1783984058713.png"
      ],
      "galleryModal": false,
      "demos": [
        {
          "url": "https://www.figma.com/deck/ZrwFGy6HwrfosmznoZlpzJ/Balancing-efficiency-and-velocity?node-id=2-1487&t=F2yVll2M1y5HgzwH-1",
          "label": "View case study"
        }
      ]
    }
  },
  "branch": {
    "password": "parrot",
    "content": {
      "description": "Designed core lending and financial product flows for Branch's mobile-first platform serving emerging markets across Africa and India.",
      "role": "Lead Product and Brand Designer",
      "approach": "Branch provides its customers store funds in its Wallet product, access to loans with favorable terms, and high-yield investment. Branch is one of the most downloaded mobile banking apps in Africa and India with over 20 million and counting.\n\nDuring my tenure I launched credit scoring, savings, investments, and physical debit card products. I also conducted user interviews, brainstorming sessions, prototyping, and managed designers Kenya, Nigeria, and Mumbai.",
      "outcome": "Evolved Branch app from a single to a multi product offering with full-service banking  features for emerging markets in Kenya, Nigeria, Tanzania, and Mumbai—downloaded by over 30 million people.",
      "metric": {
        "value": "30 million",
        "label": "Downloads"
      },
      "img": "/uploads/hero-branch-1783976880696.png",
      "video": "",
      "overlayColor": "#19355e",
      "overlayOpacity": 0.78,
      "overlayBlendMode": "normal",
      "backgroundColor": "#19355e",
      "gallery": [
        "/uploads/work-branch-1-1783965043976.png",
        "/uploads/work-branch-4-1783965053000.png",
        "/uploads/work-branch-3-1783965056615.png",
        "/uploads/work-branch-2-1783965061157.png"
      ],
      "galleryModal": true,
      "demos": []
    }
  },
  "ujet": {
    "password": "parrot",
    "content": {
      "description": "Shaped the product design direction for UJET's cloud contact-center platform — agent tooling, customer-facing flows, and omnichannel interaction design.",
      "role": "",
      "approach": "UJET is the innovation leader in cloud-based customer support SAAS. As their first design hire, I created all of the UI for each product, implemented design processes with the team and improved on those processes as we grew. Our product had several facets including an admin portal, embed-able widgets, a customer-facing chat widget, and a mobile SDK for both iOS and Android. Each product had to be highly configurable and user friendly.\n\nI worked cross-functionally with product managers, engineers ,QA, and our customer success team to deliver a best-in-class experience for our clients which included Nest, Noon, Anovo, SpotHero, and Fitbit.",
      "outcome": "",
      "metric": null,
      "img": "/uploads/ujet-general-flow-1783985191982.png",
      "video": "",
      "overlayColor": "",
      "overlayOpacity": 0,
      "overlayBlendMode": "normal",
      "backgroundColor": "",
      "gallery": [
        "/uploads/aw-buttons-1783985202908.png",
        "/uploads/typography-from-sketch-1783985204072.png",
        "/uploads/colors-1783985205329.png",
        "/uploads/icons-1783985206353.png",
        "/uploads/navigation-1783985207385.png"
      ],
      "galleryModal": true,
      "demos": [
        {
          "url": "https://www.figma.com/deck/OtFRXSOvE8wqfWjMkF3Ogf/UJET-Web-SDK?node-id=1-510&t=HNXyaNdW5sK4zb1d-1",
          "label": "View project"
        }
      ]
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
