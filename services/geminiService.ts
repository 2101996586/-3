import { GoogleGenAI } from "@google/genai";

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const generateInsights = async (contextData: any) => {
  // OFFLINE MODE / MOCK FALLBACK
  // If no API key is present or we want to force offline simulation
  const useMock = !process.env.API_KEY || true; // Set to true for demo stability as requested "usable without net"

  if (useMock) {
    return new Promise<string[]>((resolve) => {
        setTimeout(() => {
            resolve([
                "💡 趋势洞察: '螺钿'工艺品在25-30岁女性群体中关注度提升45%，建议加强小红书'国潮'标签投放。",
                "📦 产品机会: 结合环保材料的非遗文创（如再生纸漆器）搜索量环比上涨20%，市场存在空白。",
                "🎥 内容策略: 制作过程类ASMR视频在夜间时段完播率最高，建议增加微距特写镜头。"
            ]);
        }, 1500);
    });
  }

  const model = "gemini-3-flash-preview"; 
  
  try {
    if (!ai) throw new Error("AI not initialized");

    const prompt = `
      You are a senior Business Intelligence Analyst for the Chinese market.
      Analyze the following JSON data which represents social media trends and e-commerce performance for specific keywords (3C, Non-legacy/Feiyi, Trendy Toys, etc.).
      
      Data Context: ${JSON.stringify(contextData).substring(0, 3000)}... (truncated for brevity)
      
      Please provide 3 concise, high-value strategic insights in CHINESE.
      Focus on:
      1. Content strategy suggestions for Douyin/Red.
      2. Product opportunity for the "Feiyi/Luodian" (Intangible Heritage/Mother-of-pearl) category.
      3. Audience targeting advice.

      Return the result as a raw JSON array of strings, e.g. ["Insight 1", "Insight 2", "Insight 3"].
      Do not use markdown formatting.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return ["Data analysis unavailable at this moment."];
    
    return JSON.parse(text) as string[];

  } catch (error) {
    console.error("Gemini Analysis Failed (Switching to offline mode):", error);
    return [
      "本地分析: '螺钿'相关话题热度持续上升，建议增加短视频投稿量。",
      "本地分析: 3C数码类目在周五晚间直播转化率最高。",
      "本地分析: 建议结合'非遗'关键词进行跨界联名营销。"
    ];
  }
};