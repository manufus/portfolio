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
    icon: "simple-icons:github",
  },
  {
    name: "Linkedin",
    url: siteConfig.social.linkedin,
    icon: "simple-icons:linkedin",
  },
  {
    name: "Email",
    url: siteConfig.social.email,
    icon: "lucide:mail",
  },
];
