// Get site URL from environment variable, use default value if not set
// Note: Please set the correct PUBLIC_SITE_URL in .env file after first deployment
const SITE_URL = (import.meta.env.PUBLIC_SITE_URL || "https://manuelhortelano.com/").replace(
  /\/+$/,
  "",
);

interface UTMConfig {
  source: string;
  medium: string;
  campaign: string;
}

interface MetaConfig {
  title: string;
  description: string;
  keywords: string;
  image: string;
}

interface SocialConfig {
  github: string;
  linkedin: string;
  email: string;
}

export interface SiteConfig {
  title: string;
  author: string;
  url: string;
  mail: string;
  resume: string;
  utm: UTMConfig;
  meta: MetaConfig;
  social: SocialConfig;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export const siteConfig: SiteConfig = {
  title: "Manuel Hortelano",
  author: "Manuel Hortelano Rodriguez",
  url: SITE_URL,
  mail: "manuel.hortelano.rodriguez@gmail.com",
  // Resume from path
  resume: "/assets/Manuel_CV_UX.pdf",
  utm: {
    source: `${SITE_URL}`,
    medium: "referral",
    campaign: "navigation",
  },
  meta: {
    title: "Manuel Hortelano - UX Engineer & Frontend Architect",
    description:
      "UX Engineer and HCID specialist building Astro + Preact frontend architectures and measurable UX outcomes across industrial, VR, and product design projects.",
    keywords:
      "UX Engineer, Frontend Architecture, Interaction Designer, HCID, Astro, Preact, UX Research, Usability Testing, Design Systems, Fitts Law",
    image: `${SITE_URL}/og.jpg`,
  },
  // social links
  social: {
    github: "https://github.com/manufus",
    linkedin: "https://www.linkedin.com/in/manuel-hortelano-rodriguez/",
    email: "mailto:manuel.hortelano.rodriguez@gmail.com",
  },
};

// Footer
export const socialLinks: SocialLink[] = [
  {
    name: "Github",
    url: siteConfig.social.github,
    icon: `<svg t="1730125604816" class="icon ic-github ic-social" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12741" width="256" height="256"><path d="M511.957333 21.333333C241.024 21.333333 21.333333 240.981333 21.333333 512c0 216.832 140.544 400.725333 335.573334 465.664 24.490667 4.394667 32.256-10.069333 32.256-23.082667 0-11.690667 0.256-44.245333 0-85.205333-136.448 29.610667-164.736-64.64-164.736-64.64-22.314667-56.704-54.4-71.765333-54.4-71.765333-44.586667-30.464 3.285333-29.824 3.285333-29.824 49.194667 3.413333 75.178667 50.517333 75.178667 50.517333 43.776 75.008 114.816 53.333333 142.762666 40.789333 4.522667-31.658667 17.152-53.376 31.189334-65.536-108.970667-12.458667-223.488-54.485333-223.488-242.602666 0-53.546667 19.114667-97.322667 50.517333-131.669334-5.034667-12.330667-21.930667-62.293333 4.778667-129.834666 0 0 41.258667-13.184 134.912 50.346666a469.802667 469.802667 0 0 1 122.88-16.554666c41.642667 0.213333 83.626667 5.632 122.88 16.554666 93.653333-63.488 134.784-50.346667 134.784-50.346666 26.752 67.541333 9.898667 117.504 4.864 129.834666 31.402667 34.346667 50.474667 78.122667 50.474666 131.669334 0 188.586667-114.730667 230.016-224.042666 242.090666 17.578667 15.232 33.578667 44.672 33.578666 90.453334v135.850666c0 13.141333 7.936 27.605333 32.853334 22.869334C862.250667 912.597333 1002.666667 728.746667 1002.666667 512 1002.666667 240.981333 783.018667 21.333333 511.957333 21.333333z" p-id="12742"></path></svg>`,
  },
  {
    name: "Linkedin",
    url: siteConfig.social.linkedin,
    icon: `<svg class="icon ic-linkedin ic-social" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="256" height="256"><path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM349.3 793.7H237.5V435.9h111.8v357.8zM293.4 387c-35.8 0-64.9-29-64.9-64.8s29.1-64.8 64.9-64.8 64.9 29 64.9 64.8-29.1 64.8-64.9 64.8zM793.7 793.7H681.8V603.2c0-45.4-16.2-76.4-56.9-76.4-31 0-49.5 20.9-57.6 41.1-3 7.2-3.7 17.2-3.7 27.2v198.6H451.9s1.5-322.2 0-357.8h111.8v50.7c14.9-23 41.6-55.8 101.1-55.8 73.8 0 128.9 48.2 128.9 151.8v151.1z" fill="currentColor"></path></svg>`,
  },
  {
    name: "Email",
    url: siteConfig.social.email,
    icon: `<svg class="icon ic-email ic-social" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="256" height="256"><path d="M938.8 243.2H85.2c-39.7 0-72 32.3-72 72v448c0 39.7 32.3 72 72 72h853.6c39.7 0 72-32.3 72-72v-448c0-39.7-32.3-72-72-72zM85.2 315.2h853.6c-4.4 3.7-14.7 13.5-30.8 29.8L512 559.4 116 345c-16-16.3-26.4-26.1-30.8-29.8zM921.7 780.8H102.3c-2.4 0-4.6-0.3-6.8-0.8V355L488.5 595.7c11.7 11.9 27.2 18.2 43.5 18.2s31.8-6.3 43.5-18.2L928.5 355v425c-2.2 0.5-4.4 0.8-6.8 0.8z" fill="currentColor"></path></svg>`,
  },
];
