export enum Platform {
  Douyin = '抖音',
  Red = '小红书',
  Weibo = '微博',
  VideoAccount = '视频号'
}

export enum EcommercePlatform {
  DouyinMall = '抖音商城',
  TmallJD = '天猫/京东',
  Weidian = '微店'
}

export const KEYWORDS = [
  '3C数码', 
  '潮玩', 
  '环保', 
  '非遗', 
  '漆器', 
  '螺钿', 
  '装饰', 
  '盲盒'
];

export interface TrendData {
  date: string;
  heat: number;
  posts: number;
  playCount: number;
  engagement: number; // calculated from post/play ratio
}

export interface PlatformMetric {
  name: string;
  value: number;
}

export interface SalesData {
  category: string;
  platform: EcommercePlatform;
  revenue: number;
  units: number;
  avgPrice: number;
}

export interface KeywordAnalysis {
  word: string;
  count: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface AudienceData {
  ageGroup: string;
  percentage: number;
  genderRatio: { male: number; female: number };
  topInterests: string[];
}
