export interface Category {
  _id?: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface TrustStat {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
}

export interface NavLink {
  label: string;
  href: string;
}
