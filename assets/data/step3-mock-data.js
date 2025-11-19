/**
 * Step 3: 竞争运营分析 - Mock Data
 * 包含5个完整的竞品数据 + 策略建议
 */

const Step3MockData = {
  // Charter数据（从Step 2传入，这里作为fallback）
  charter: {
    productName: 'PawGenius Smart Ball',
    coreFeatures: [
      '智能互动 (APP控制)',
      '自动滚动',
      '耐咬材质'
    ],
    targetPrice: 24.99,
    targetAudience: '中大型犬主人',
    differentiators: [
      'AI算法控制滚动轨迹',
      'APP远程控制',
      '内置零食仓'
    ],
    mainKeywords: [
      'smart dog toy',
      'interactive dog ball',
      'app controlled pet toy'
    ]
  },

  // 竞品数据（5个完整的竞品）
  competitors: [
    {
      id: 'kong-wobbler',
      name: 'KONG Wobbler',
      brand: 'KONG Company',
      asin: 'B003ALMW0M',
      price: 14.99,
      bsr: 156,
      rating: 4.6,
      reviews: 25342,
      launchDate: '2018-03',
      matchReasons: ['价格接近', '互动玩具', '类目搜索'],

      // Listing数据
      listing: {
        titleLength: 156,
        titleFillRate: 0.78,
        coreKeywords: ['dog toy', 'treat', 'wobbler'],
        brandPosition: 'first',
        sellingPoints: 3,
        imageCount: 7,
        mainImageStyle: '白底产品图',
        sceneImageCount: 3,
        sceneImageRate: 0.43,
        infoGraphCount: 2,
        hasVideo: false,
        bulletStructure: '功能罗列型',
        bulletAvgLength: 280,
        bulletKeywordDensity: 'medium',
        bulletPainPoints: 1,
        hasAPlus: true,
        aPlusModules: 4,
        aPlusContentType: '图文混排',
        aPlusInfoDensity: 'low',
        aPlusHasComparison: false,
        currentBSR: 156,
        avgBSR30d: 168,
        trendBSR90d: 'stable',
        seasonalVariation: 'low'
      },

      // 关键词数据
      keywords: {
        organicTotal: 234,
        organicTop10: 12,
        brandTermRank: 1,
        categoryTermRank: { 'dog toy': 156 },
        subcategoryTermRank: { 'interactive dog toy': 23 },
        longTailCoverage: 'low',
        longTailCount: 15,
        sponsoredTotal: 56,
        adKeywordOverlap: 0.24,
        adPositions: {
          topOfSearch: 0,
          sideOfSearch: 2,
          bottomOfSearch: 5
        },
        hasSBVideoAd: false,
        brandDefense: 'strong',
        categoryBidding: 'low',
        longTailStrategy: 'low'
      },

      // Review数据
      reviewData: {
        total: 25342,
        recent30Days: 78,
        dailyAverage: 2.6,
        vpCount: 8870,
        vpRatio: 0.35,
        avgRating: 4.6,
        ratingDistribution: {
          5: 0.68,
          4: 0.18,
          3: 0.06,
          2: 0.03,
          1: 0.05
        },
        withImageRate: 0.12,
        withVideoCount: 45,
        withVideoRate: 0.002,
        growthRate: 50,
        earlyStrategy: 'Vine计划(推测)',
        topPositiveWords: [
          { word: 'durable', count: 1234 },
          { word: 'fun', count: 1089 },
          { word: 'keeps busy', count: 876 },
          { word: 'easy to clean', count: 654 },
          { word: 'great for treats', count: 543 }
        ],
        topNegativeWords: [
          { word: 'too easy', count: 234 },
          { word: 'crack', count: 187 },
          { word: 'small dogs', count: 156 },
          { word: 'lose interest', count: 123 }
        ]
      },

      // 定价数据
      pricingData: {
        currentPrice: 14.99,
        historicalHigh: 16.99,
        historicalLow: 11.99,
        average90d: 14.49,
        volatility: 0.33,
        promotionFrequency: 'high',
        promotionsPerMonth: 2,
        hasLD: true,
        ldCount90d: 4,
        hasBD: true,
        bdCount90d: 1,
        hasCoupon: true,
        couponDiscount: 0.10,
        hasSubscribeAndSave: true,
        snsDiscount: 0.05,
        primeDayDiscount: 0.20,
        blackFridayDiscount: 0.15,
        priceElasticity: 'low',
        rankChangeOnPromo: 10
      },

      // QA数据
      qaData: {
        total: 234,
        answered: 228,
        answerRate: 0.97,
        sellerAnswered: 12,
        sellerAnswerRate: 0.05,
        topQuestions: [
          { category: '尺寸适配', percentage: 0.35, examples: ['适合多大的狗?', '我的拉布拉多能用吗?'] },
          { category: '使用方法', percentage: 0.28, examples: ['怎么清洁?', '能放什么零食?'] },
          { category: '耐用性', percentage: 0.22, examples: ['会不会被咬坏?', '能用多久?'] },
          { category: '其他', percentage: 0.15, examples: ['有异味吗?', 'BPA-free吗?'] }
        ]
      },

      // 定位数据（用于地图）
      positioning: {
        functionalityScore: 3,  // 1-5分
        priceLevel: 2           // 1-5分
      }
    },

    {
      id: 'outward-hound',
      name: 'Outward Hound IQ Treat Ball',
      brand: 'Outward Hound',
      asin: 'B003ARUKTG',
      price: 9.99,
      bsr: 245,
      rating: 4.4,
      reviews: 18765,
      launchDate: '2017-06',
      matchReasons: ['价格接近', '互动玩具', '周边搜索'],

      listing: {
        titleLength: 142,
        imageCount: 8,
        hasVideo: false,
        hasAPlus: true,
        aPlusModules: 5,
        currentBSR: 245
      },

      keywords: {
        organicTotal: 312,
        organicTop10: 18,
        sponsoredTotal: 89,
        adPositions: {
          topOfSearch: 1,
          sideOfSearch: 4,
          bottomOfSearch: 8
        },
        hasSBVideoAd: false,
        brandDefense: 'medium',
        longTailCoverage: 'medium'
      },

      reviewData: {
        total: 18765,
        recent30Days: 52,
        dailyAverage: 1.7,
        vpRatio: 0.28,
        avgRating: 4.4,
        withImageRate: 0.09,
        withVideoRate: 0.001
      },

      pricingData: {
        currentPrice: 9.99,
        historicalHigh: 12.99,
        historicalLow: 7.99,
        average90d: 9.49,
        promotionFrequency: 'high',
        hasLD: true,
        hasCoupon: true
      },

      qaData: {
        total: 187,
        answered: 172,
        answerRate: 0.92,
        sellerAnswered: 8,
        sellerAnswerRate: 0.04
      },

      positioning: {
        functionalityScore: 2,
        priceLevel: 1
      }
    },

    {
      id: 'ifetch',
      name: 'iFetch Interactive Ball Launcher',
      brand: 'iFetch',
      asin: 'B0050XN0BG',
      price: 109.99,
      bsr: 523,
      rating: 4.3,
      reviews: 8932,
      launchDate: '2019-01',
      matchReasons: ['互动玩具', '关联推荐', '长尾词'],

      listing: {
        titleLength: 178,
        imageCount: 9,
        hasVideo: true,
        hasAPlus: true,
        aPlusModules: 7,
        currentBSR: 523
      },

      keywords: {
        organicTotal: 187,
        organicTop10: 8,
        sponsoredTotal: 145,
        adPositions: {
          topOfSearch: 12,
          sideOfSearch: 8,
          bottomOfSearch: 3
        },
        hasSBVideoAd: true,
        brandDefense: 'strong',
        longTailCoverage: 'high'
      },

      reviewData: {
        total: 8932,
        recent30Days: 34,
        dailyAverage: 1.1,
        vpRatio: 0.42,
        avgRating: 4.3,
        withImageRate: 0.15,
        withVideoRate: 0.027
      },

      pricingData: {
        currentPrice: 109.99,
        historicalHigh: 129.99,
        historicalLow: 89.99,
        average90d: 104.99,
        promotionFrequency: 'medium',
        hasLD: false,
        hasCoupon: true
      },

      qaData: {
        total: 298,
        answered: 287,
        answerRate: 0.96,
        sellerAnswered: 45,
        sellerAnswerRate: 0.15
      },

      positioning: {
        functionalityScore: 5,
        priceLevel: 5
      }
    },

    {
      id: 'wickedbone',
      name: 'Wickedbone Smart Bone',
      brand: 'Cheerble',
      asin: 'B07FDQNB3R',
      price: 39.99,
      bsr: 867,
      rating: 4.1,
      reviews: 3421,
      launchDate: '2020-03',
      matchReasons: ['APP控制', '智能玩具', '关联推荐'],

      listing: {
        titleLength: 189,
        imageCount: 9,
        hasVideo: true,
        hasAPlus: true,
        aPlusModules: 6,
        currentBSR: 867
      },

      keywords: {
        organicTotal: 156,
        organicTop10: 5,
        sponsoredTotal: 78,
        adPositions: {
          topOfSearch: 3,
          sideOfSearch: 5,
          bottomOfSearch: 2
        },
        hasSBVideoAd: true,
        brandDefense: 'medium',
        longTailCoverage: 'high'
      },

      reviewData: {
        total: 3421,
        recent30Days: 28,
        dailyAverage: 0.9,
        vpRatio: 0.38,
        avgRating: 4.1,
        withImageRate: 0.18,
        withVideoRate: 0.035
      },

      pricingData: {
        currentPrice: 39.99,
        historicalHigh: 49.99,
        historicalLow: 29.99,
        average90d: 37.99,
        promotionFrequency: 'medium',
        hasLD: true,
        hasCoupon: true
      },

      qaData: {
        total: 145,
        answered: 132,
        answerRate: 0.91,
        sellerAnswered: 28,
        sellerAnswerRate: 0.19
      },

      positioning: {
        functionalityScore: 4,
        priceLevel: 3
      }
    },

    {
      id: 'petsafe-launcher',
      name: 'PetSafe Automatic Ball Launcher',
      brand: 'PetSafe',
      asin: 'B0721735K9',
      price: 149.95,
      bsr: 1234,
      rating: 4.2,
      reviews: 5678,
      launchDate: '2018-08',
      matchReasons: ['自动玩具', '关联推荐'],

      listing: {
        titleLength: 165,
        imageCount: 8,
        hasVideo: true,
        hasAPlus: true,
        aPlusModules: 6,
        currentBSR: 1234
      },

      keywords: {
        organicTotal: 198,
        organicTop10: 6,
        sponsoredTotal: 92,
        adPositions: {
          topOfSearch: 2,
          sideOfSearch: 3,
          bottomOfSearch: 4
        },
        hasSBVideoAd: false,
        brandDefense: 'strong',
        longTailCoverage: 'medium'
      },

      reviewData: {
        total: 5678,
        recent30Days: 21,
        dailyAverage: 0.7,
        vpRatio: 0.31,
        avgRating: 4.2,
        withImageRate: 0.11,
        withVideoRate: 0.018
      },

      pricingData: {
        currentPrice: 149.95,
        historicalHigh: 179.95,
        historicalLow: 119.95,
        average90d: 144.95,
        promotionFrequency: 'low',
        hasLD: false,
        hasCoupon: false
      },

      qaData: {
        total: 212,
        answered: 198,
        answerRate: 0.93,
        sellerAnswered: 34,
        sellerAnswerRate: 0.16
      },

      positioning: {
        functionalityScore: 5,
        priceLevel: 5
      }
    }
  ],

  // 策略建议数据（基于竞品分析）
  strategyRecommendations: {
    insights: [
      {
        id: 1,
        title: '竞品流量高度依赖广告，自然流量不足',
        dataSupport: [
          'iFetch: SP广告出现频率38% (首页侧边)',
          'Outward: 广告投放关键词89个 (vs 自然排名312个)',
          'Kong: 广告位占比25% (搜索页底部)'
        ],
        implications: [
          '我们应该重投SEO优化，降低广告依赖',
          '长尾词布局机会大 (竞品覆盖度低)',
          '前3个月重点做自然排名，ACoS控制在35%以内'
        ]
      },
      {
        id: 2,
        title: '高价位产品视频内容明显优于低价产品',
        dataSupport: [
          'iFetch ($109.99): 有Listing视频 + SB视频广告',
          'Wickedbone ($39.99): 有Listing视频',
          'Kong/Outward (<$15): 均无视频内容'
        ],
        implications: [
          '视频是高价值产品的必备要素',
          '我们的定价($24.99)必须有高质量视频',
          '建议制作15秒演示视频 + 30秒详细讲解视频'
        ]
      },
      {
        id: 3,
        title: 'Review增长策略差异明显：Vine vs 自然增长',
        dataSupport: [
          'Kong: VP占比35% (老产品稳定增长)',
          'iFetch: VP占比42% (新产品冷启动)',
          'Outward: VP占比28% (自然增长为主)'
        ],
        implications: [
          '新产品冷启动必须使用Vine计划',
          '目标: 前2个月200条VP Review，占比40%',
          '6个月后降至20%，以自然增长为主'
        ]
      },
      {
        id: 4,
        title: '定价策略：低价产品促销频繁，高价产品促销克制',
        dataSupport: [
          'Outward ($9.99): 促销频率高，LD 4次/90天',
          'Kong ($14.99): 促销频率高，LD 4次/90天',
          'iFetch ($109.99): 促销频率中等，LD 0次/90天'
        ],
        implications: [
          '我们的定价($24.99)应避免频繁LD',
          '建议: 促销频率1次/月，主要用Coupon+S&S',
          '保持利润率33%以上，避免价格战'
        ]
      },
      {
        id: 5,
        title: 'QA管理：卖家主动回答率普遍偏低',
        dataSupport: [
          'Wickedbone: 卖家回答率19% (最高)',
          'iFetch: 卖家回答率15%',
          'Kong/Outward: 卖家回答率<5%'
        ],
        implications: [
          'QA是差异化机会点，竞品普遍不重视',
          '我们目标: 卖家回答率30%，24小时内回复',
          '预先准备10个FAQ，主动发布'
        ]
      }
    ],

    trafficStrategy: {
      listing: {
        title: '填满200字符，前50字符放核心卖点',
        titleExample: 'Smart Dog Ball with APP Control - Auto Rolling Interactive Pet Toy for Large Dogs...',
        mainImage: '场景图 (狗在使用) + APP界面截图',
        video: '15秒演示视频 (APP控制+自动滚动)',
        bulletPoints: '痛点导向型 (竞品多为功能罗列型)',
        bulletExample: '没时间陪狗狗? APP远程控制，随时随地互动',
        aPlus: '高质量 (7+模块，含功能对比图)'
      },
      keywords: {
        avoid: ['dog toy (500K搜索，竞争激烈)'],
        target: ['smart dog toy (15K搜索，竞品少)'],
        longTail: ['app controlled dog toy (3K搜索，排名机会大)'],
        brandDefense: '100%投放SB广告'
      },
      advertising: {
        sp: 'SP广告: 中等投入，避开大词竞价。前3个月ACoS目标60%，3个月后降至35%',
        sb: 'SB视频广告: 重点投放 (竞品少有)，展示APP控制差异化功能',
        sd: 'SD广告: 在竞品详情页截流 (Kong/Outward/iFetch页面下方)'
      },
      offAmazon: {
        deals: 'Deals网站: 上架前2周重点推广 (Slickdeals、DealNews、Kinja Deals)，首单折扣20%',
        kol: 'KOL合作: 3-5个宠物博主，粉丝规模50K+，提供产品+佣金15%',
        social: '社交媒体: TikTok (产品演示短视频)、Instagram (用户UGC内容)',
        target: '目标: 站外流量占比20% (竞品平均10%)'
      }
    },

    conversionStrategy: {
      review: {
        target: '6个月500条Review，评分4.5+',
        path: [
          'Month 1-2: Vine计划 (200条，VP占比40%)',
          'Month 3-6: 自然增长 (50条/月)',
          'Early Reviewer Program',
          '包裹插卡引导 (合规话术)'
        ],
        quality: [
          '鼓励带图/视频Review (iFetch占比2.7%，我们目标5%)',
          '快速回复负面Review (24小时内)'
        ]
      },
      pricing: {
        launchPrice: 29.99,
        firstMonthPrice: 24.99,
        longTermPrice: 27.99,
        promotionFrequency: '1次/月 (Prime Day/Black Friday重点)',
        differentiation: 'Subscribe & Save 8折 (竞品Kong/Outward有)',
        strategy: [
          '避免频繁LD (Outward 3次/月，我们仅1次/月)',
          '用Coupon+S&S替代大幅降价',
          '保持利润率33% (不低于30%)'
        ]
      },
      qa: {
        targetResponseRate: 0.3,
        faq: [
          '电池续航多久? (对标iFetch高频问题)',
          'APP兼容性? (iOS/Android)',
          '适合多大的狗? (尺寸适配)',
          '噪音大吗? (室内使用)'
        ],
        differentiation: '在QA中强调APP控制优势'
      }
    },

    differentiationTactics: [
      {
        id: 1,
        title: '视频内容差异化',
        competitorStatus: [
          '只有iFetch和Wickedbone有Listing视频',
          '只有iFetch投SB视频广告',
          'Kong/Outward均无视频内容'
        ],
        ourApproach: [
          'Listing主图后放15秒演示视频 (APP控制+自动滚动)',
          'SB视频广告展示差异化功能 (AI轨迹算法)',
          'A+页面嵌入多个使用场景视频',
          '社交媒体重点做短视频内容 (TikTok/Instagram Reels)'
        ],
        expectedResults: [
          'CTR提升20% (相比无视频Listing)',
          '视频Review占比5% (竞品<1%)',
          '转化率提升15%'
        ]
      },
      {
        id: 2,
        title: '站外流量重投',
        competitorStatus: [
          'Kong/Outward: 站外流量<5% (主要靠Amazon站内)',
          'iFetch: 站外流量约12% (Deals网站)',
          '竞品普遍缺乏KOL合作和社交媒体运营'
        ],
        ourApproach: [
          'Deals网站: Slickdeals/DealNews重点推广，首单20% off',
          'KOL合作: 3-5个宠物博主 (粉丝50K+)，佣金15%',
          'TikTok: 每周2条短视频 (产品演示+用户UGC)',
          'Instagram: 用户UGC内容聚合，每月抽奖活动'
        ],
        expectedResults: [
          '站外流量占比20% (vs 竞品平均10%)',
          '降低广告依赖，ACoS从50%降至35%',
          '品牌曝光提升，自然流量增长30%'
        ]
      },
      {
        id: 3,
        title: '长尾词精准打击',
        competitorStatus: [
          'Kong: 长尾词覆盖低 (仅15个)',
          'Outward: 长尾词覆盖中等',
          'iFetch: 长尾词覆盖高，但价格过高($109.99)导致转化低'
        ],
        ourApproach: [
          '布局50+长尾关键词 (app controlled, smart, automatic等)',
          '针对长尾词优化Listing (标题/五点/A+)',
          '长尾词SP广告低竞价策略 (ACoS目标25%)',
          '长尾词着陆页优化 (强调APP控制差异化)'
        ],
        expectedResults: [
          '长尾词自然排名Top 10占比30%',
          '长尾词流量占比25% (竞品平均10%)',
          '长尾词转化率比大词高20%'
        ]
      },
      {
        id: 4,
        title: '客户服务差异化',
        competitorStatus: [
          'Kong: 卖家QA回答率5% (几乎不回答)',
          'Outward: 卖家QA回答率4%',
          'Wickedbone: 卖家QA回答率19% (最高，但仍不足30%)'
        ],
        ourApproach: [
          'QA卖家回答率目标30%，24小时内回复',
          '预先发布10个FAQ (电池/APP/尺寸/噪音等)',
          '负面Review 24小时内回复 + 主动联系解决',
          '售后服务: 30天无理由退换 + 1年质保'
        ],
        expectedResults: [
          'QA回答率30% (vs 竞品平均<10%)',
          '负面Review占比<10% (vs 竞品15%)',
          '客户满意度提升，复购率提高25%'
        ]
      }
    ]
  }
};

// 导出数据（兼容浏览器和Node.js）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Step3MockData;
}
