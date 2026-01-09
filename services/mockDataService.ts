import { TrendData, SalesData, AudienceData, KeywordAnalysis, Platform, EcommercePlatform, KEYWORDS } from '../types';

// Helper to generate random integer
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export const generateTrendData = (days: number, keyword: string): TrendData[] => {
  const data: TrendData[] = [];
  const now = new Date();
  
  let baseHeat = 5000;
  let basePosts = 100;
  
  // Adjust base values based on keyword popularity simulation
  if (['3C数码', '盲盒', '潮玩'].includes(keyword)) {
    baseHeat = 15000;
    basePosts = 500;
  } else if (['非遗', '螺钿', '漆器'].includes(keyword)) {
    baseHeat = 8000; // Niche but trending
    basePosts = 150;
  }

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    // Add some randomness and a slight upward trend
    const trendFactor = 1 + (days - i) * 0.01;
    const dailyNoise = randomInt(-10, 20) / 100;
    
    const posts = Math.floor(basePosts * trendFactor * (1 + dailyNoise));
    const heat = Math.floor(baseHeat * trendFactor * (1 + dailyNoise) * 5); // Heat is usually higher
    const playCount = posts * randomInt(500, 2000); // Avg plays per post
    
    data.push({
      date: date.toISOString().split('T')[0],
      heat,
      posts,
      playCount,
      engagement: parseFloat((playCount / (posts || 1)).toFixed(2)),
    });
  }
  return data;
};

export const getPlatformDistribution = (keyword: string) => {
  // Custom logic to make it look realistic based on platform demographics
  if (['3C数码', '环保'].includes(keyword)) {
     return [
       { name: '抖音', value: 40 },
       { name: '微博', value: 30 }, // News/Announcements often on Weibo for 3C/Eco
       { name: '小红书', value: 20 },
       { name: '视频号', value: 10 },
     ];
  } else if (['非遗', '漆器', '螺钿', '装饰'].includes(keyword)) {
     return [
       { name: '小红书', value: 45 }, // Aesthetics heavy
       { name: '抖音', value: 35 },   // Process videos
       { name: '视频号', value: 15 }, // Older demographic/Circles
       { name: '微博', value: 5 },
     ];
  } else {
     // Default (Trend Toys, Blind Box etc)
     return [
       { name: '小红书', value: 40 },
       { name: '抖音', value: 40 },
       { name: '微博', value: 10 },
       { name: '视频号', value: 10 },
     ];
  }
};

export const generateSalesData = (keyword: string): SalesData[] => {
  // Simulating sales for specifically requested keywords: Non-legacy (Feiyi) and Luodian
  const platforms = [EcommercePlatform.DouyinMall, EcommercePlatform.TmallJD, EcommercePlatform.Weidian];
  const categories = ['首饰', '摆件', '日用品', '文具', '收藏品'];
  
  const data: SalesData[] = [];
  
  platforms.forEach(platform => {
    categories.forEach(cat => {
      let multiplier = 1;
      if (platform === EcommercePlatform.TmallJD) multiplier = 1.5;
      if (platform === EcommercePlatform.Weidian && ['非遗', '螺钿'].includes(keyword)) multiplier = 0.8; // Weidian strong for niche

      data.push({
        category: cat,
        platform,
        revenue: randomInt(10000, 50000) * multiplier,
        units: randomInt(100, 1000) * multiplier,
        avgPrice: randomInt(50, 500),
      });
    });
  });

  return data;
};

export const generateAudienceData = (keyword: string): AudienceData[] => {
  // Customize based on keyword
  let isYoung = ['潮玩', '盲盒', '3C数码'].includes(keyword);
  
  return [
    { 
      ageGroup: '18-24', 
      percentage: isYoung ? 45 : 20, 
      genderRatio: { male: 40, female: 60 }, 
      topInterests: ['Gaming', 'Fashion', 'Tech'] 
    },
    { 
      ageGroup: '25-34', 
      percentage: isYoung ? 35 : 40, 
      genderRatio: { male: 50, female: 50 }, 
      topInterests: ['Travel', 'Home Decor', 'Invest'] 
    },
    { 
      ageGroup: '35-44', 
      percentage: isYoung ? 15 : 25, 
      genderRatio: { male: 60, female: 40 }, 
      topInterests: ['Culture', 'Tea', 'Family'] 
    },
    { 
      ageGroup: '45+', 
      percentage: isYoung ? 5 : 15, 
      genderRatio: { male: 55, female: 45 }, 
      topInterests: ['Health', 'History', 'News'] 
    },
  ];
};

export const generateCommentKeywords = (keyword: string): KeywordAnalysis[] => {
  const commonWords = ['好看', '值得', '一般', '推荐', '太贵了', '精致', '喜欢'];
  const nicheWords = keyword.includes('螺钿') || keyword.includes('漆器') 
    ? ['工艺', '传承', '匠心', '绝美', '手工', '瑕疵', '等待时间长']
    : ['科技感', '复购', '隐藏款', '手感', '甚至', '溢价'];

  const allWords = [...commonWords, ...nicheWords];
  
  return allWords.map(word => ({
    word,
    count: randomInt(100, 5000),
    sentiment: (['瑕疵', '太贵了', '一般', '等待时间长', '溢价'].includes(word) ? 'negative' : 'positive') as 'positive' | 'neutral' | 'negative'
  })).sort((a, b) => b.count - a.count);
};