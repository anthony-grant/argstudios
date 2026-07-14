export const CORAL = "#FF5A5F";
export const DARK = "#0C0C0B";
export const CREAM = "#F6F2EC";

// This file is managed by the /admin panel. Manual edits here will be
// overwritten the next time someone saves from there.
export const projects = [
  {
    "index": "01",
    "slug": "meta",
    "title": "Meta",
    "category": "Product Design",
    "tags": [
      "Product",
      "Governance",
      "Lead"
    ],
    "protected": true
  },
  {
    "index": "02",
    "slug": "branch",
    "title": "Branch International",
    "category": "Product Design",
    "tags": [
      "Mobile",
      "Fintech",
      "UX"
    ],
    "protected": true
  },
  {
    "index": "03",
    "slug": "ujet",
    "title": "UJET",
    "category": "Product Design",
    "tags": [
      "SaaS",
      "Enterprise",
      "UX"
    ],
    "protected": true
  },
  {
    "index": "04",
    "slug": "eventbrite",
    "title": "Eventbrite",
    "category": "Comms Design",
    "tags": [
      "Brand",
      "Comms",
      "Identity"
    ],
    "description": "Brand communications, visual systems, and design collateral spanning decks, campaigns, and identity assets for one of the world's leading event platforms.",
    "role": "Lead Brand Communication Designer, Manager",
    "approach": "When we can create experiences together, we become more empathetic, we learn from each other, and we have fun. Eventbrite’s mission is to bring the world together through live experiences. During my time there I made a ton of friends, learned from them, and had way too much fun. I think I did some work along the way too. I started out as a designer working with the marketing and sales team to create seamless event pages / customer experiences. Along the way I became a design manager who got his hands dirty creating everything from A to Z for live experiences, recruited and hired several team members, and collaborated with many other teams within the organization. This is a tiny sample of what I did.",
    "outcome": "",
    "metric": null,
    "img": "/uploads/1450777600538-eb-sxsw.jpg",
    "video": "",
    "overlayColor": "#7c2a00",
    "overlayOpacity": 0.9,
    "overlayBlendMode": "multiply",
    "backgroundColor": "",
    "gallery": [
      "/uploads/1450781141982-sxsw-poster.jpg",
      "/uploads/1450777606696-eb-sxsw2.jpg",
      "/uploads/1450777894335-sxsw-app-email.png",
      "/uploads/1450781017596-tribkln-poster.jpg"
    ],
    "galleryModal": true,
    "demos": []
  },
  {
    "index": "05",
    "slug": "tilt",
    "title": "Tilt",
    "category": "Comms Design",
    "tags": [
      "Brand",
      "Comms",
      "Acquired"
    ],
    "description": "Brand communications and design collateral for Tilt, the social payments platform acquired by Airbnb.",
    "role": "",
    "approach": "Remember those days when you were just starting out, and having total financial freedom was something you could only dream of?\nTilt changed that dynamic by making it easy for groups of people to pool their money together to fund events, book trips, or pitch in to help someone in need. Although we were eventually acquired by Airbnb, Tilt was a deeply loved brand throughout its lifetime. I had the privilege of working alongside an insanely talented team—including sharp product managers, brilliant social media strategists, and a legendary copywriter—to take Tilt from a scrappy startup idea to a frat-house-hold name.",
    "outcome": "",
    "metric": null,
    "img": "https://images.unsplash.com/photo-1563281295-2a381fe5fed0?w=800&h=600&fit=crop&auto=format",
    "video": "https://youtu.be/UTlh0f8_ZTA?si=XzDtkFC1lvltCkGF",
    "overlayColor": "",
    "overlayOpacity": 0.99,
    "overlayBlendMode": "multiply",
    "backgroundColor": "",
    "gallery": [
      "/uploads/funding-awesome-1783988352303.jpg",
      "/uploads/tilt-tour-2x-1783988354023.jpg"
    ],
    "galleryModal": true,
    "demos": []
  },
  {
    "index": "06",
    "slug": "facebook-f8",
    "title": "Facebook F8",
    "category": "Comms Design",
    "tags": [
      "Presentations",
      "Narrative",
      "F8"
    ],
    "description": "Transformed engineering-heavy technical content into accessible narratives for Facebook's flagship developer conference — covering infrastructure, media, and Android performance.",
    "role": "",
    "approach": "For Facebook’s F8 conference I worked directly with presenters to craft complex technical jargon into easily digestible stories that a wide audience could understand and appreciate.",
    "outcome": "",
    "metric": null,
    "img": "/uploads/f8-sachin-1783987015852.jpg",
    "video": "",
    "overlayColor": "#001e57",
    "overlayOpacity": 0.99,
    "overlayBlendMode": "multiply",
    "backgroundColor": "",
    "gallery": [],
    "galleryModal": false,
    "demos": [
      {
        "url": "https://developers.facebook.com/videos/f8-2016/inside-facebooks-infrastructure-part-1-the-system-that-serves-billions/",
        "label": "Video 1"
      },
      {
        "url": "https://developers.facebook.com/videos/f8-2016/inside-facebooks-infrastructure-part-2-meet-the-system-watchdogs/",
        "label": "Video 2"
      },
      {
        "url": "https://developers.facebook.com/videos/f8-2016/inside-look-at-facebook-media-infrastructure/",
        "label": "Video 3"
      }
    ]
  },
  {
    "index": "07",
    "slug": "additional-projects",
    "title": "Additional Projects",
    "category": "Comms Design, Personal Projects",
    "description": "A collection of brand, illustration, experiential marketing, and personal experiments spanning a range of clients, collaborators, and interests.",
    "img": "/uploads/1450785721821-dougpagan.webp",
    "video": "",
    "overlayColor": "#b51a00",
    "overlayOpacity": 0.98,
    "overlayBlendMode": "normal",
    "backgroundColor": "",
    "tags": [
      "Brand",
      "Illustration",
      "Collection"
    ]
  }
];

// Each image can carry any number of role/type tags (e.g. "Brand", "Illustration",
// "Art Direction", "Package Design"). Tags populate the filter toggles on the
// Additional Projects page automatically — a toggle only appears once at least
// one image uses that tag. To tag an image, just add strings to its `tags` array.
// When an image has a `description`, its label renders as a clickable button on
// the gallery and it gets its own page at /work/additional-projects/:slug.
export const additionalImages = [
  {
    "slug": "slowfeed-zine",
    "src": "/uploads/sq-slowfeed-1783983414383.png",
    "label": "slowfeed zine",
    "tags": [
      "ai",
      "experimental publication"
    ],
    "description": "Rejecting mass media and traditional gatekeepers, Slowfeed decentralizes publishing. Every zine is generated at the point of purchase, ensuring no two copies are identical. By removing editorial bottlenecks, it connects readers with unfiltered art—creating a unique artifact at the intersection of data and discovery.\n\nFor this project I used AI to create a generator that randomly assembles submitted images into a PDF. I also used AI to build a multi-featured admin panel to approve, reject, edit layouts, assign tags, and generate social media images.",
    "linkUrl": "https://slowfeedzine.com",
    "linkLabel": "",
    "extraImages": [
      "/uploads/slowfeed-zines-1783983305058.jpg"
    ]
  },
  {
    "slug": "black-collagists-rebrand",
    "src": "/uploads/black-collagists-2x-1783978271170.png",
    "label": "Black Collagists Rebrand",
    "tags": [
      "brand"
    ],
    "description": "Black Collagists is a community founded by acclaimed writer / curator Teri Henderson which creates \nspace enabling artists to be showcased in virtual and physical spaces.",
    "linkUrl": "https://www.instagram.com/blackcollagists/",
    "linkLabel": "",
    "extraImages": [
      "/uploads/black-collagists-2023-edited-1-1783979269498.png",
      "/uploads/black-collagists-2023-edited-10-1783979270669.png",
      "/uploads/black-collagists-2023-edited-9-1783979272399.png",
      "/uploads/black-collagists-2023-edited-8-1783979273796.png",
      "/uploads/black-collagists-2023-edited-7-1783979275550.png",
      "/uploads/black-collagists-2023-edited-6-1783979278214.png",
      "/uploads/black-collagists-2023-edited-5-1783979281174.png",
      "/uploads/black-collagists-2023-edited-4-1783979282713.png",
      "/uploads/black-collagists-2023-edited-3-1783979284010.png",
      "/uploads/black-collagists-2023-edited-2-1783979285308.png"
    ]
  },
  {
    "slug": "voltage-records",
    "src": "/uploads/1450785721821-dougpagan.webp",
    "label": "Voltage Records",
    "tags": [
      "art direction",
      "design"
    ],
    "description": "Provided multiple album cover designs for the independent recording label Voltage Music which has a focus on dub, reggae, and dancehall music.",
    "linkUrl": "https://www.tomaspalermo.com/label",
    "linkLabel": "",
    "extraImages": [
      "/uploads/1451196243569-d4df.webp"
    ]
  },
  {
    "slug": "good-cigar-co",
    "src": "/uploads/1469425133957-logo-gcc-square-cream-text.webp",
    "label": "Good Cigar Co.",
    "tags": [
      "brand",
      "packaging"
    ],
    "description": "Provided the initial branding and packaging for an independent D2C cigar subscription product. Typographically driven, the simple yet striking logotype and package design was inspired by the 'smoke' that is emitted from a lit cigar. Launched by Will McQuain in 2016 this brand was acquired in 2019.",
    "linkUrl": "https://www.goodcigar.co",
    "linkLabel": "",
    "extraImages": [
      "/uploads/1539341602778-good-cigar-pouch-mock.jpg",
      "/uploads/1539341604989-gcc-box.jpg"
    ]
  },
  {
    "slug": "tilt",
    "src": "/uploads/1451179729878-logos-illos-tilt.webp",
    "label": "Tilt",
    "tags": [
      "brand",
      "comms",
      "experiential marketing"
    ],
    "description": "Remember those days when you were just starting out, and having total financial freedom was something you could only dream of? Tilt changed that dynamic by making it easy for groups of people to pool their money together to fund events, book trips, or pitch in to help someone in need. Although we were eventually acquired by Airbnb, Tilt was a deeply loved brand throughout its lifetime. I had the privilege of working alongside an insanely talented team—including sharp product managers, brilliant social media strategists, and a legendary copywriter—to take Tilt from a scrappy startup idea to a frat-household name.",
    "linkUrl": "",
    "linkLabel": "",
    "extraImages": [
      "/uploads/1539301440919-funding-awesome.webp",
      "/uploads/1539321593211-tilt-tour-2x.jpg",
      "https://youtu.be/UTlh0f8_ZTA?si=_Cv3gO1cjE06kj4a"
    ]
  },
  {
    "slug": "eventbrite",
    "src": "/uploads/1451179728518-logos-illos-ebsxsw.png",
    "label": "Eventbrite",
    "tags": [
      "brand",
      "comms",
      "experiential marketing"
    ],
    "description": "When we can create experiences together, we become more empathetic, we learn from each other, and we have fun. Eventbrite’s mission is to bring the world together through live experiences. During my time there I made a ton of friends, learned from them, and had way too much fun. I think I did some work along the way too. I started out as a designer working with the marketing and sales team to create seamless event pages / customer experiences. Along the way I became a design manager who got his hands dirty creating everything from A to Z for live experiences, recruited and hired several team members, and collaborated with many other teams within the organization. This is a tiny sample of what I did.",
    "linkUrl": "",
    "linkLabel": "",
    "extraImages": [
      "/uploads/1450777606696-eb-sxsw2.jpg",
      "/uploads/1450781141982-sxsw-poster.jpg",
      "/uploads/1450777600538-eb-sxsw.jpg"
    ]
  },
  {
    "slug": "seltz-co",
    "src": "/uploads/1539296418435-logos-illos-seltz.webp",
    "label": "Seltz Co.",
    "tags": [
      "brand"
    ],
    "description": "",
    "linkUrl": "",
    "linkLabel": "",
    "extraImages": []
  },
  {
    "slug": "sf-green-film-festival",
    "src": "/uploads/1451179729693-logos-illos-sfgff.webp",
    "label": "SF Green Film Festival",
    "tags": [
      "brand",
      "comms"
    ],
    "description": "",
    "linkUrl": "",
    "linkLabel": "",
    "extraImages": []
  },
  {
    "slug": "hetchy-vodka",
    "src": "/uploads/1539296743152-logos-illos-hetchy.webp",
    "label": "Hetchy Vodka",
    "tags": [
      "brand",
      "comms"
    ],
    "description": "I swear—I only tasted the product a few times to get inspired:) Available in fine stores throughout Northern California and beyond.",
    "linkUrl": "https://woodencork.com/products/hetchy-vodka?srsltid=AfmBOor7eoLWRzyJVKN1iy7PrdBGHFGtL9mduioQh3krnTnY6utcptBh",
    "linkLabel": "Grab a bottle or two",
    "extraImages": [
      "/uploads/hetchy-vodka-in-situ-1783982017203.jpg"
    ]
  },
  {
    "slug": "silverlake-ramen",
    "src": "/uploads/1539338961757-logos-illos-slr.webp",
    "label": "Silverlake Ramen",
    "tags": [
      "brand",
      "comms"
    ],
    "description": "One of those projects that did not go as far as I would have liked but it was more about the journey and creating something that I have always wanted to create—a restaurant brand. Did I have dreams of flying (coach) to LA for a weekend of art and yummy ramen—yes but I created a yummy case study instead.",
    "linkUrl": "",
    "linkLabel": "",
    "extraImages": [
      "/uploads/slr-presentation-2-6-1783980961622.png",
      "/uploads/slr-presentation-2-11-1783981021744.jpg",
      "/uploads/slr-presentation-2-19-1783980910995.png",
      "/uploads/slr-presentation-2-20-1783980925304.png"
    ]
  },
  {
    "slug": "weathertoons",
    "src": "/uploads/1451181065179-logos-illos-wt.webp",
    "label": "WeatherToons",
    "tags": [
      "brand",
      "iOS app"
    ],
    "description": "WeatherToons is an app that was available in the Appstore. This self initiated project was created to gain a better understanding of designing for iOS and managing a project geared towards consumers. My goal was to create a simple app that displayed the temperature and display an animation that corresponds to the current weather. My roles were visual designer, brand designer, illustrator, animator, product manager, and QA tester. After completing this project I learned that nothing is simple when it comes to development of any kind.  I am currently exploring ideas on how to update this app with the help of Claude.",
    "linkUrl": "",
    "linkLabel": "",
    "extraImages": [
      "/uploads/1450782177131-weathertoons.jpg",
      "/uploads/1451114669229-image-asset.webp",
      "/uploads/1451114253857-image-asset.jpeg",
      "/uploads/1543996772670-wt80t89v001sq.gif"
    ]
  },
  {
    "slug": "resonant-people",
    "src": "/uploads/1539338961595-logos-illos-resonantpeople.png",
    "label": "Resonant People",
    "tags": [
      "brand"
    ],
    "description": "",
    "linkUrl": "",
    "linkLabel": "",
    "extraImages": []
  },
  {
    "slug": "livestop",
    "src": "/uploads/1556232862486-pov-primary.webp",
    "label": "Livestop",
    "tags": [
      "brand"
    ],
    "description": "",
    "linkUrl": "",
    "linkLabel": "",
    "extraImages": []
  },
  {
    "slug": "urban-fit-sf",
    "src": "/uploads/1539296002131-logos-illos-urbanfitsf.webp",
    "label": "Urban Fit SF",
    "tags": [
      "brand"
    ],
    "description": "",
    "linkUrl": "",
    "linkLabel": "",
    "extraImages": []
  }
];

export const homeHero = {
  "introText": "anthony grant is a Designer of user interfaces / brands / visual artist / living & creating in the Bay Area, California.",
  "backgroundColor": "#FF5A5F",
  "navLinks": [
    {
      "id": "work",
      "label": "Work"
    },
    {
      "id": "about",
      "label": "About"
    },
    {
      "id": "contact",
      "label": "Contact"
    }
  ],
  "profileImage": "/uploads/portrait-default.webp",
  "profileTooltip": "Photo by [Olivia Chen](https://www.carolchen.org/photography)"
};
