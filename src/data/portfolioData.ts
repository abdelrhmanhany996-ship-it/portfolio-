export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  client: string;
  year: string;
  coverImage: string;
  galleryImages: string[];
  description: string;
  credits: {
    artDirection: string;
    artist: string;
    retouching?: string;
    agency?: string;
  };
  featured: boolean;
  behanceUrl?: string;
}

export const PROJECTS_DATA: Project[] = [
  {
    id: 'ford-ksa',
    title: 'Ford KSA',
    subtitle: 'The Beast Built for Extreme Terrains',
    category: 'MASTER KV',
    client: 'Ford Middle East',
    year: '2024',
    coverImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Master Key Visual commercial campaign produced for Ford Saudi Arabia. CGI composite blending snow terrain, extreme mountain passes, and high-performance automotive retouched highlights.',
    credits: {
      artDirection: 'Medhat Labib',
      artist: 'Medhat Labib & Team',
      retouching: 'Labib Studio',
      agency: 'Ford KSA Agency'
    },
    featured: true,
    behanceUrl: 'https://www.behance.net'
  },
  {
    id: 'berain-water',
    title: 'Berain Water',
    subtitle: 'Always With You — Fluid Hydration Campaign',
    category: 'CAMPAIGN',
    client: 'Berain Water KSA',
    year: '2024',
    coverImage: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1560023907-5f339617ea30?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Mixed media campaign blending 3D CGI fluid ribbons with live-action photography showcasing Berain Water in everyday lifestyle scenarios from office productivity to intense sports.',
    credits: {
      artDirection: 'Medhat Labib',
      artist: 'Mohammad Mustafa & Medhat Labib',
      retouching: 'Labib Studio',
      agency: 'Berain Creative Dept'
    },
    featured: true,
    behanceUrl: 'https://www.behance.net'
  },
  {
    id: 'new-vision',
    title: 'New Vision',
    subtitle: 'Architectural Heritage & Modern Saudi Futurism',
    category: 'MASTER KV',
    client: 'Saudi Vision Project',
    year: '2023',
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Monumental 3D architectural artwork merging traditional Najdi heritage archways with futuristic minimalist spatial monuments set in lush desert oasis landscapes.',
    credits: {
      artDirection: 'Medhat Labib',
      artist: 'Medhat Labib',
      retouching: 'Labib Studio'
    },
    featured: true,
    behanceUrl: 'https://www.behance.net'
  },
  {
    id: 'al-baraka-bank',
    title: 'Al Baraka Bank',
    subtitle: 'AI Digital Companion Launch Campaign',
    category: 'SM DESIGNS',
    client: 'Al Baraka Bank Egypt',
    year: '2023',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Integrated digital campaign for Al Baraka Bank introducing an friendly AI assistant character across mobile banking apps, social media, and billboards.',
    credits: {
      artDirection: 'Medhat Labib',
      artist: 'Labib Studio',
      agency: 'M&C Saatchi'
    },
    featured: true,
    behanceUrl: 'https://www.behance.net'
  },
  {
    id: 'dubai-golf',
    title: 'Dubai Golf',
    subtitle: 'Feel the Adventure — The Destination',
    category: 'CAMPAIGN',
    client: 'Dubai Tourism',
    year: '2023',
    coverImage: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Luxury hospitality and leisure campaign showcasing championship golf courses and hot air balloon adventures across Dubai.',
    credits: {
      artDirection: 'Medhat Labib',
      artist: 'Medhat Labib',
      retouching: 'Labib Studio'
    },
    featured: true,
    behanceUrl: 'https://www.behance.net'
  },
  {
    id: 'grills-campaign',
    title: 'Steakhouse Grill',
    subtitle: "Grill's Just a Tap Away",
    category: 'RETOUCHING',
    client: 'Gourmet Dining Group',
    year: '2024',
    coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'High-end commercial food retouching and key visual composition featuring cast iron steaks, searing flames, and smartphone delivery UI integration.',
    credits: {
      artDirection: 'Medhat Labib',
      artist: 'Labib Studio'
    },
    featured: false,
    behanceUrl: 'https://www.behance.net'
  },
  {
    id: 'post-production-mastery',
    title: 'Cold Enough to Freeze',
    subtitle: 'Extreme Refrigeration Commercial Key Visual',
    category: 'POST PRODUCTION',
    client: 'Home Appliances Co',
    year: '2024',
    coverImage: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Sub-zero frost CGI retouching and ice particle FX post production for major consumer electronics campaign.',
    credits: {
      artDirection: 'Medhat Labib',
      artist: 'Labib Studio'
    },
    featured: false,
    behanceUrl: 'https://www.behance.net'
  },
  {
    id: 'social-media-suite',
    title: 'Social Media Key Visuals',
    subtitle: 'From Store to Score — Regional Campaign',
    category: 'SM DESIGNS',
    client: 'Various Regional Brands',
    year: '2024',
    coverImage: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Curated collection of high-performing social media campaign posters created for clients in Egypt, KSA, UAE, and Kuwait.',
    credits: {
      artDirection: 'Medhat Labib',
      artist: 'Labib Studio'
    },
    featured: false,
    behanceUrl: 'https://www.behance.net'
  }
];

export interface SocialLink {
  label: string;
  url: string;
}

export interface ArtistInfo {
  name: string;
  title: string;
  brand: string;
  headline: string;
  portrait: string;
  experienceYears: string;
  gulfExperienceYears: string;
  bio: string;
  phone: string;
  email: string;
  location: string;
  workingHours: string;
  socials: SocialLink[];
}

export interface Service {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  features: string[];
  filterCategory: string;
}

export interface SiteSettings {
  customCursor: boolean;
  heroAutoplaySeconds: number;
}

export interface SiteContent {
  profile: ArtistInfo;
  projects: Project[];
  services: Service[];
  categories: string[];
  settings: SiteSettings;
}

export const CATEGORIES = ['MASTER KV', 'CAMPAIGN', 'RETOUCHING', 'POST PRODUCTION', 'SM DESIGNS'];

export const ARTIST_INFO: ArtistInfo = {
  name: 'Medhat Labib',
  title: 'Visual Artist & Art Director',
  brand: 'labib.studio',
  headline: 'Visual artist with over a decade of experience crafting high-impact commercial campaigns across Egypt & the Gulf.',
  portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=85',
  experienceYears: '10+',
  gulfExperienceYears: '5+',
  bio: 'Visual artist with +10 years in Egypt & abroad, collaborating with leading agencies and global brands in Egypt and the Gulf market. Specialized in CGI composition, key visual master production, 3D retouching, and high-impact digital campaigns.',
  phone: '(+20) 01098757266',
  email: 'INFO@LABIBSTUDIO.COM',
  location: 'CAIRO, EGYPT',
  workingHours: '10:00 AM to 8:00 PM',
  socials: [
    { label: 'INSTAGRAM', url: 'https://instagram.com' },
    { label: 'BEHANCE', url: 'https://behance.net' },
    { label: 'LINKEDIN', url: 'https://linkedin.com' }
  ]
};

export const SERVICES_DATA: Service[] = [
  {
    id: 'post-production',
    title: 'POST PRODUCTION',
    subtitle: 'Advanced Retouching & CGI Integration',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=85',
    features: [
      '3D & CGI Asset Composite',
      'Complex High-Res Retouching',
      'Sub-zero Frost & Dynamic Particles',
      'Color Grading & Atmospheric Lighting',
    ],
    filterCategory: 'POST PRODUCTION',
  },
  {
    id: 'campaigns',
    title: 'CAMPAIGNS',
    subtitle: '360° Commercial Visual Key Art',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
    features: [
      'Master Key Visual (KV) Production',
      'Commercial Advertising Art Direction',
      'Regional Saudi & Gulf Campaigns',
      'Multi-Platform Campaign Adaptations',
    ],
    filterCategory: 'CAMPAIGN',
  },
  {
    id: 'posters',
    title: 'POSTERS & KV',
    subtitle: 'High-Impact Editorial Posters',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
    features: [
      'Billboard & Out-of-Home Graphics',
      'Social Media Master Banners',
      'Architectural & Spatial Typography',
      'Brand Identity Visual Language',
    ],
    filterCategory: 'MASTER KV',
  },
];

export const DEFAULT_CONTENT: SiteContent = {
  profile: ARTIST_INFO,
  projects: PROJECTS_DATA,
  services: SERVICES_DATA,
  categories: CATEGORIES,
  settings: {
    customCursor: true,
    heroAutoplaySeconds: 6,
  },
};
