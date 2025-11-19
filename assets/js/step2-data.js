/**
 * Step 2 品类洞察 - Mock数据
 * 项目：AI选品助手
 * 数据来源: docs/design/从品类到产品的战略决策/2.1-2.7设计文档
 * 更新时间：2025-11-19
 */

window.Step2Data = {

  /**
   * 获取完整分析数据
   * @param {string} category - 品类名称
   * @returns {Object} 完整的分析数据
   */
  getAllData(category) {
    return {
      wukan: this.getWuKanData(category),
      marketMap: this.getMarketMapData(category),
      stp: this.getSTPData(category),
      span: this.getSPANData(category),
      appeals: this.getAPPEALSData(category),
      kano: this.getKANOData(category),
      charter: this.getCharterData(category)
    };
  },

  /**
   * 获取五看洞察数据
   * 数据来源: 2.1-五看洞察仪表板设计.md
   */
  getWuKanData(category) {
    const dataMap = {
      "宠物用品": {
        // ========== 1. 看行业 ==========
        industry: {
          gmv: "$18.7B",
          cagr: "28.4%",
          maturity: "成长期",
          maturityDesc: "快速扩张中",

          // 品类结构分布
          subcategories: [
            { name: "宠物食品", share: 42, gmv: "$7.85B" },
            { name: "健康护理", share: 23, gmv: "$4.30B" },
            { name: "玩具娱乐", share: 15, gmv: "$2.81B" },
            { name: "家居用品", share: 12, gmv: "$2.24B" },
            { name: "清洁用品", share: 8, gmv: "$1.50B" }
          ],

          // 增长趋势
          growthTrend: {
            years: ['2020', '2021', '2022', '2023', '2024E', '2025E', '2026E', '2027E', '2028E'],
            gmv: [8.2, 10.5, 12.8, 14.6, 18.7, 24.0, 30.8, 39.5, 50.7]
          }
        },

        // ========== 2. 看市场 ==========
        market: {
          subcategories: [
            {
              id: "toys",
              name: "玩具娱乐",
              gmv: "$2.81B",
              share: "15%",
              growth: 67,
              isHighGrowth: true,
              radarScores: [60, 95, 72, 65, 70], // [市场规模, 增长潜力, 利润空间, 竞争强度, 进入难度]
              highlights: ["67% CAGR", "智力训练需求爆发", "CR3仅35%"]
            },
            {
              id: "food",
              name: "宠物食品",
              gmv: "$7.85B",
              share: "42%",
              growth: 18,
              isHighGrowth: false,
              radarScores: [95, 45, 55, 85, 40],
              highlights: ["最大子品类", "竞争激烈", "品牌壁垒高"]
            },
            {
              id: "health",
              name: "健康护理",
              gmv: "$4.30B",
              share: "23%",
              growth: 35,
              isHighGrowth: true,
              radarScores: [75, 70, 80, 70, 55],
              highlights: ["35% CAGR", "专业门槛高", "利润率高"]
            },
            {
              id: "home",
              name: "家居用品",
              gmv: "$2.24B",
              share: "12%",
              growth: 22,
              isHighGrowth: false,
              radarScores: [50, 55, 60, 60, 65],
              highlights: ["稳定增长", "同质化严重", "价格竞争"]
            },
            {
              id: "cleaning",
              name: "清洁用品",
              gmv: "$1.50B",
              share: "8%",
              growth: 15,
              isHighGrowth: false,
              radarScores: [40, 40, 50, 55, 70],
              highlights: ["低增长", "刚需品类", "复购率高"]
            }
          ]
        },

        // ========== 3. 看客户 ==========
        customer: {
          personas: [
            {
              id: "quality-mom",
              avatar: "‍",
              name: "品质妈妈",
              tags: ["30-45岁", "家庭年收入$80K+", "一线城市"],
              share: "42%",
              arpu: "$186/年",
              retention: "73%",
              description: "追求高品质宠物产品，愿意为科学喂养支付溢价。关注产品安全性、品牌口碑和其他家长的推荐。",
              painPoints: ["产品安全", "科学喂养", "品牌信任"],
              channels: ["Amazon搜索", "妈妈群推荐", "Instagram KOL"]
            },
            {
              id: "young-professional",
              avatar: "‍",
              name: "年轻专业人士",
              tags: ["25-35岁", "单身/新婚", "互联网从业"],
              share: "35%",
              arpu: "$142/年",
              retention: "68%",
              description: "重视便捷性和设计感，活跃在社交媒体分享宠物日常。喜欢尝试新品牌，对网红推荐敏感。",
              painPoints: ["时间有限", "颜值要求", "社交需求"],
              channels: ["TikTok种草", "小红书", "Amazon Prime"]
            },
            {
              id: "senior-parent",
              avatar: "",
              name: "银发宠物家长",
              tags: ["55-70岁", "退休/半退休", "子女独立"],
              share: "23%",
              arpu: "$98/年",
              retention: "82%",
              description: "宠物是情感寄托，注重安全性和实用性。价格敏感度低，但需要简单易用的产品。",
              painPoints: ["操作简单", "安全可靠", "情感陪伴"],
              channels: ["Walmart线下", "Facebook群组", "电视购物"]
            }
          ],

          // Top 5 客户痛点
          painPoints: [
            {
              rank: 1,
              title: "玩具耐用性差",
              mentionRate: "34.2%",
              avgRating: "2.8",
              quote: "我家狗一天就咬坏了，太不耐用",
              impact: "高",
              opportunity: "天然橡胶+TPR材质，通过50磅咬合力测试"
            },
            {
              rank: 2,
              title: "缺乏智力刺激",
              mentionRate: "28.7%",
              avgRating: "3.1",
              quote: "狗狗玩5分钟就没兴趣了，需要更有挑战性的玩具",
              impact: "高",
              opportunity: "3档可调难度系统，持续激发兴趣"
            },
            {
              rank: 3,
              title: "清洁困难",
              mentionRate: "23.5%",
              avgRating: "3.3",
              quote: "KONG的缝隙太难洗，发霉了很恶心",
              impact: "中",
              opportunity: "一体成型设计，可机洗"
            },
            {
              rank: 4,
              title: "尺寸不合适",
              mentionRate: "19.8%",
              avgRating: "3.5",
              quote: "买大了狗狗咬不动，买小了吞下去危险",
              impact: "中",
              opportunity: "精准尺码指南（按犬种/体重）"
            },
            {
              rank: 5,
              title: "价格偏高",
              mentionRate: "15.3%",
              avgRating: "3.8",
              quote: "一个玩具$25太贵了，性价比不高",
              impact: "低",
              opportunity: "$24.99定价，提供更多附加值（训练指南+质保）"
            }
          ]
        },

        // ========== 4. 看竞争 ==========
        competition: {
          cr5: "35%",
          cr3: "27%",
          topBrand: "KONG",
          topBrandShare: "12%",
          newBrandSurvivalRate: "67%",
          competitiveLevel: "竞争分散",

          // Top 5 竞争对手
          topCompetitors: [
            {
              rank: 1,
              brand: "KONG",
              asin: "B0002AR0II",
              marketShare: "12%",
              avgPrice: "$18.99",
              rating: 4.7,
              reviewCount: "128.5K",
              skuCount: "230+",
              radarScores: [95, 92, 70, 88, 95], // [品牌知名度, 产品质量, 价格竞争力, 客户满意度, SKU丰富度]
              strengths: ["品牌认知度高", "产品质量可靠", "SKU丰富"],
              weaknesses: ["价格偏高", "设计老旧", "清洁困难"]
            },
            {
              rank: 2,
              brand: "Outward Hound",
              asin: "B0711Y9XTF",
              marketShare: "8%",
              avgPrice: "$15.49",
              rating: 4.5,
              reviewCount: "85.2K",
              skuCount: "180+",
              radarScores: [75, 78, 85, 82, 80],
              strengths: ["性价比高", "设计创新", "品类多样"],
              weaknesses: ["品牌力较弱", "耐用性一般"]
            },
            {
              rank: 3,
              brand: "Chuckit!",
              asin: "B000F4AVPA",
              marketShare: "7%",
              avgPrice: "$12.99",
              rating: 4.6,
              reviewCount: "92.3K",
              skuCount: "95+",
              radarScores: [70, 85, 90, 80, 60],
              strengths: ["价格低", "耐用性好", "专注细分"],
              weaknesses: ["功能单一", "设计简陋"]
            },
            {
              rank: 4,
              brand: "ZippyPaws",
              asin: "B07QKDK8PP",
              marketShare: "5%",
              avgPrice: "$9.99",
              rating: 4.4,
              reviewCount: "56.7K",
              skuCount: "150+",
              radarScores: [50, 65, 95, 75, 70],
              strengths: ["价格极低", "设计可爱", "SKU多"],
              weaknesses: ["质量一般", "品牌认知低"]
            },
            {
              rank: 5,
              brand: "Benebone",
              asin: "B00O5TCEOA",
              marketShare: "3%",
              avgPrice: "$14.99",
              rating: 4.5,
              reviewCount: "38.9K",
              skuCount: "45+",
              radarScores: [55, 88, 75, 85, 50],
              strengths: ["质量优秀", "口碑好", "专注细分"],
              weaknesses: ["SKU少", "知名度低"]
            }
          ],

          // 竞争威胁
          threats: {
            whiteLabelRisk: "高",
            whiteLabelDesc: "中国白牌工厂通过1688/Alibaba直接铺货Amazon，价格$6-8，严重冲击市场",
            substitutes: ["自制玩具", "普通球类", "食物奖励"],
            barriers: {
              capital: "低 (启动资金$25K)",
              brand: "中 (需6-12月建立信任)",
              supply: "低 (成熟供应链)",
              technology: "低 (无技术壁垒)"
            }
          }
        },

        // ========== 5. 看自己 ==========
        resource: {
          overallScore: 78,
          verdict: " 适合进入",
          recommendation: "资源匹配度良好，建议从智力训练细分切入，采用Routine品类角色策略，目标4-6月盈亏平衡",

          dimensions: [
            {
              name: "资金能力",
              score: 85,
              maxScore: 100,
              required: "$25K",
              actual: "$35K",
              detail: "启动资金需求: $25K | 你的预算: $35K ",
              verdict: "充足",
              gap: 0
            },
            {
              name: "供应链能力",
              score: 72,
              maxScore: 100,
              required: "MOQ 500件, 30天交期, FDA食品级认证",
              actual: "有义乌供应商资源，需验证认证",
              detail: "MOQ: 500件 | 交期: 30天 | 质量认证: FDA食品级 ️",
              verdict: "基本满足",
              gap: -15,
              action: "需提前验证供应商FDA认证资质，建议索要SGS检测报告"
            },
            {
              name: "运营能力",
              score: 80,
              maxScore: 100,
              required: "Amazon PPC + 社交媒体营销",
              actual: "2年Amazon运营经验",
              detail: "需要: Amazon PPC + 社交媒体营销 | 你的经验: 2年电商运营 ",
              verdict: "满足",
              gap: 0
            },
            {
              name: "产品开发能力",
              score: 68,
              maxScore: 100,
              required: "产品设计 + 模具开发",
              actual: "无设计经验",
              detail: "需要: 产品设计 + 模具开发 | 建议: 寻找ODM合作伙伴 ️",
              verdict: "需补足",
              gap: -20,
              action: "推荐联系深圳/东莞ODM工厂，提供参考设计，由工厂完成3D建模和开模"
            },
            {
              name: "时间投入",
              score: 75,
              maxScore: 100,
              required: "20小时/周",
              actual: "25小时/周",
              detail: "启动期需要: 20小时/周 | 你的可用时间: 25小时/周 ",
              verdict: "满足",
              gap: 0
            },
            {
              name: "风险承受能力",
              score: 70,
              maxScore: 100,
              required: "可接受$25K全损",
              actual: "可接受$20K损失",
              detail: "需要: 可接受$25K全损风险 | 实际: 可接受$20K损失 ️",
              verdict: "基本满足",
              gap: -10,
              action: "建议首批订单降至1000件（$15K投入），验证市场后再追加"
            }
          ],

          // 资源匹配建议
          suggestions: [
            {
              priority: "高",
              action: "验证供应商FDA认证",
              reason: "产品直接接触宠物口腔，必须符合FDA食品级标准",
              timeline: "启动前完成"
            },
            {
              priority: "高",
              action: "寻找ODM合作伙伴",
              reason: "缺乏产品设计能力，需要工厂提供设计支持",
              timeline: "2周内"
            },
            {
              priority: "中",
              action: "降低首批订单量",
              reason: "风险承受能力略低于需求，建议分批投入",
              timeline: "订单前"
            },
            {
              priority: "中",
              action: "学习TikTok营销",
              reason: "TikTok Shop ROI更高（11.7x vs 8.0x），需补足社交媒体能力",
              timeline: "1个月内"
            }
          ]
        }
      },

      // 其他品类数据（后续补充）
      "家居装饰": {
        industry: {
          gmv: "$24.5B",
          cagr: "15.2%",
          maturity: "成熟期",
          maturityDesc: "稳定增长",
          subcategories: [],
          growthTrend: { years: [], gmv: [] }
        },
        market: { subcategories: [] },
        customer: { personas: [], painPoints: [] },
        competition: { cr5: "0%", topCompetitors: [], threats: {} },
        resource: { overallScore: 0, verdict: "", recommendation: "", dimensions: [], suggestions: [] }
      }
    };

    return dataMap[category] || dataMap["宠物用品"];
  },

  /**
   * 获取市场地图数据
   * 数据来源: 2.2-数字化市场地图设计.md
   */
  getMarketMapData(category) {
    const dataMap = {
      "宠物用品": {
        // 决策流映射
        decisionFlow: {
          buyerNeeds: [
            { trigger: "宠物无聊破坏家具", percentage: "32%" },
            { trigger: "节日送礼需求", percentage: "28%" },
            { trigger: "社交媒体种草", percentage: "23%" },
            { trigger: "兽医/训犬师推荐", percentage: "17%" }
          ],
          searchKeywords: {
            safetyOriented: [
              { keyword: "non-toxic dog toy", volume: "18.2K" },
              { keyword: "safe chew toy", volume: "12.7K" }
            ],
            functionOriented: [
              { keyword: "durable dog toy", volume: "23.5K" },
              { keyword: "interactive puzzle", volume: "9.8K" }
            ],
            scenarioOriented: [
              { keyword: "toy for aggressive", volume: "15.3K" },
              { keyword: "puppy teething toy", volume: "11.2K" }
            ]
          },
          buyerCriteria: [
            { name: "价格合理性", desc: "$15-25甜蜜点", icon: "" },
            { name: "安全认证", desc: "FDA/CPSC标识", icon: "" },
            { name: "品牌信任度", desc: "评论>1000", icon: "" },
            { name: "教育价值", desc: "智力开发", icon: "" },
            { name: "清洁便利", desc: "可机洗", icon: "" },
            { name: "退货政策", desc: "30天无理由", icon: "" }
          ],
          petCriteria: [
            { name: "趣味性", desc: "持续时长>30分钟", icon: "" },
            { name: "口感/触感", desc: "柔软/有弹性", icon: "" },
            { name: "气味", desc: "无异味", icon: "" },
            { name: "声音刺激", desc: "吱吱声", icon: "" }
          ],
          returnRate: "18%",
          returnWindow: "15天",
          insights: [
            "购买前: 主人基于理性评估(评论/参数/价格)",
            "购买后: 宠物基于本能反应(15天内退货率高达18%)",
            "产品必须同时满足双方,否则高退货风险"
          ]
        },

        // 渠道影响力
        channelInfluence: {
          channels: [
            {
              name: "Amazon",
              type: "搜索驱动",
              trafficSource: "主动搜索",
              conversionCycle: "3-5天",
              roi: "8.0x",
              pros: ["流量精准", "转化率高", "评论体系完善"],
              cons: ["获客成本高", "价格竞争激烈"],
              strategy: "增长期主战场(4-12M)",
              acos: "25-35%"
            },
            {
              name: "TikTok Shop",
              type: "发现驱动",
              trafficSource: "内容种草",
              conversionCycle: "即时",
              roi: "11.7x",
              pros: ["ROI更高", "病毒式传播", "用户年轻化"],
              cons: ["流量不稳定", "品牌信任度低"],
              strategy: "冷启动期快速积累销量(0-3M)",
              cpm: "$8-12"
            },
            {
              name: "独立站",
              type: "品牌阵地",
              trafficSource: "付费广告+自然流量",
              conversionCycle: "7-14天",
              roi: "6.5x",
              pros: ["完全自主", "数据私有", "利润率高"],
              cons: ["流量成本高", "运营复杂"],
              strategy: "成熟期品牌建设(12M+)",
              cac: "$45-60"
            }
          ],
          lifecycle: [
            {
              period: "冷启动期 (0-3M)",
              primary: "TikTok Shop",
              strategy: "快速积累销量+评论",
              target: "500单 + 50条4星评论"
            },
            {
              period: "增长期 (4-12M)",
              primary: "Amazon",
              strategy: "利用评论基础冲Best Seller",
              target: "进入类目Top 100"
            },
            {
              period: "成熟期 (12M+)",
              primary: "Amazon + 独立站",
              strategy: "品牌建设+高利润DTC",
              target: "独立站占比达30%"
            }
          ]
        },

        // 竞争生态
        competitiveEcosystem: {
          layers: [
            {
              level: "直接竞争",
              desc: "同类互动玩具品牌",
              competitors: ["KONG", "Outward Hound", "Chuckit!", "ZippyPaws"],
              threat: "高",
              strategy: "差异化设计 + 价格优势"
            },
            {
              level: "预算竞争",
              desc: "白牌低价玩具",
              competitors: ["1688白牌工厂", "速卖通直发"],
              threat: "中",
              priceRange: "$6-8",
              strategy: "强调质量认证 + 品牌故事"
            },
            {
              level: "功能替代",
              desc: "非玩具替代方案",
              competitors: ["训犬课程", "宠物日托", "自制玩具"],
              threat: "低",
              strategy: "教育内容营销 + 便利性卖点"
            }
          ]
        }
      }
    };

    return dataMap[category] || dataMap["宠物用品"];
  },

  /**
   * 获取STP数据
   * 数据来源: 2.3-STP战略聚焦设计.md
   */
  getSTPData(category) {
    const dataMap = {
      "宠物用品": {
        // 市场细分
        segmentation: {
          method: "Job-to-be-Done + Price Tiering",
          segments: [
            {
              id: "dental-care",
              name: "牙齿护理型",
              icon: "",
              coreJob: "帮助狗狗清洁牙齿，同时提供娱乐",
              marketSize: "$420M",
              share: "15%",
              monthlySearches: "67,300",
              cagr: "18.5%",
              targetPet: "中大型犬（Golden Retriever, Labrador）",
              targetOwner: "关注宠物健康的中产家庭, 35-45岁, $75K+",
              topKeywords: [
                { keyword: "dental chew toy", volume: "23.2K" },
                { keyword: "teeth cleaning dog toy", volume: "18.5K" }
              ],
              topCompetitor: "Nylabone DuraChew",
              competitorPrice: "$8.99",
              competitorRating: 4.3,
              painPoints: ["硬度过高伤牙龈", "缺乏互动性", "设计单调"],
              opportunity: "软硬适中材料 + 互动设计 + 牙齿清洁功能三合一",
              scores: {
                marketSize: 65,
                growth: 72,
                competition: 68,
                profit: 70,
                accessibility: 75,
                strategicFit: 60
              },
              totalScore: 68.3
            },
            {
              id: "mental-stimulation",
              name: "智力训练型",
              icon: "",
              coreJob: "消耗狗狗精力，防止破坏行为",
              marketSize: "$640M",
              share: "23%",
              monthlySearches: "92,100",
              cagr: "31.2%",
              isHighGrowth: true,
              targetPet: "高智商犬种（Border Collie, Poodle, German Shepherd）",
              targetOwner: "年轻专业人士25-35岁, 工作繁忙, 城市公寓",
              topKeywords: [
                { keyword: "puzzle toy for smart dogs", volume: "28.7K" },
                { keyword: "interactive treat dispenser", volume: "19.3K" }
              ],
              topCompetitor: "Outward Hound Hide-A-Squirrel",
              competitorPrice: "$14.99",
              competitorRating: 4.5,
              painPoints: ["难度单一(聪明狗5分钟破解)", "零件易丢失", "无法调节难度"],
              opportunity: "可调节难度等级 + 模块化设计 + 持续挑战性",
              scores: {
                marketSize: 78,
                growth: 95,
                competition: 65,
                profit: 82,
                accessibility: 70,
                strategicFit: 75
              },
              totalScore: 79.8,
              isSelected: true
            },
            {
              id: "aggressive-chewer",
              name: "耐久咀嚼型",
              icon: "",
              coreJob: "满足破坏欲强的大型犬咀嚼需求",
              marketSize: "$720M",
              share: "26%",
              monthlySearches: "125,600",
              cagr: "22.8%",
              targetPet: "大型/巨型犬（Rottweiler, Mastiff, Pit Bull）",
              targetOwner: "经验丰富的养犬者, 男性居多62%, 注重耐用性",
              topKeywords: [
                { keyword: "indestructible dog toy", volume: "47.2K" },
                { keyword: "tough chew toy for aggressive", volume: "35.8K" }
              ],
              topCompetitor: "KONG Extreme",
              competitorPrice: "$16.99",
              competitorRating: 4.7,
              painPoints: ["价格较高", "颜色单一(仅黑色)", "缝隙藏脏难清洁"],
              opportunity: "KONG级别耐用性 + 可机洗 + 多彩配色 + 亲民价格",
              scores: {
                marketSize: 92,
                growth: 80,
                competition: 85,
                profit: 68,
                accessibility: 55,
                strategicFit: 82
              },
              totalScore: 77.2
            },
            {
              id: "puppy-teething",
              name: "幼犬磨牙型",
              icon: "",
              coreJob: "缓解幼犬出牙期疼痛，保护家具",
              marketSize: "$380M",
              share: "14%",
              monthlySearches: "54,200",
              cagr: "12.3%",
              seasonality: "春季高峰（3-5月新生幼犬增多）",
              targetPet: "3-8个月龄幼犬（所有品种）",
              targetOwner: "首次养犬的年轻家庭, 高度焦虑型, 依赖兽医推荐",
              topKeywords: [
                { keyword: "safe puppy teething toy", volume: "21.3K" },
                { keyword: "soft chew toy for puppy", volume: "16.7K" }
              ],
              topCompetitor: "Nylabone Puppy Chew",
              competitorPrice: "$5.99",
              competitorRating: 4.2,
              painPoints: ["安全性疑虑(BPA担忧)", "尺寸不合适", "使用周期短(3个月)"],
              opportunity: "FDA认证材料 + 可成长设计（可替换配件）",
              scores: {
                marketSize: 58,
                growth: 50,
                competition: 72,
                profit: 55,
                accessibility: 80,
                strategicFit: 52
              },
              totalScore: 61.2
            },
            {
              id: "outdoor-fetch",
              name: "户外运动型",
              icon: "",
              coreJob: "户外运动时的投掷互动",
              marketSize: "$450M",
              share: "16%",
              monthlySearches: "78,900",
              cagr: "15.7%",
              seasonality: "夏季高峰（6-8月）",
              targetPet: "运动型犬种（Retriever, Shepherd, Terrier）",
              targetOwner: "活跃型户外爱好者, 周末常带狗去公园/海滩",
              topKeywords: [
                { keyword: "fetch ball for dogs", volume: "32.5K" },
                { keyword: "outdoor dog toy", volume: "18.9K" }
              ],
              topCompetitor: "Chuckit! Ultra Ball",
              competitorPrice: "$11.99",
              competitorRating: 4.6,
              painPoints: ["易丢失", "泥土难清洁", "咬穿后有碎片"],
              opportunity: "鲜艳配色防丢失 + 浮水设计 + 耐脏材质",
              scores: {
                marketSize: 68,
                growth: 62,
                competition: 78,
                profit: 60,
                accessibility: 72,
                strategicFit: 48
              },
              totalScore: 64.7
            }
          ]
        },

        // 目标选择
        targeting: {
          selectedSegment: "mental-stimulation",
          selectionReason: [
            "最高综合得分 79.8分",
            "CAGR 31.2% 远超行业平均",
            "目标用户年轻化，社交媒体活跃，UGC潜力大",
            "竞品痛点明显，差异化空间大",
            "与我们的产品开发能力匹配度高"
          ],
          targetPersona: {
            name: "Emily",
            age: 29,
            occupation: "产品经理",
            location: "旧金山",
            income: "$95K/年",
            pet: {
              name: "Bella",
              breed: "2岁金毛",
              personality: "聪明活泼"
            },
            painPoints: [
              "KONG太难清洁，缝隙发霉",
              "Bella很快失去兴趣，5-10分钟就不玩了",
              "市面产品设计丑，不上相（社交需求）"
            ],
            expectations: [
              "可机洗（洗碗机友好）",
              "可调难度（持续挑战性）",
              "高颜值（马卡龙配色）",
              "智能化（App记录进度最好）"
            ],
            channels: ["Instagram", "小红书", "Amazon"],
            monthlyBudget: "$50-80",
            purchaseFrequency: "2-3次/年"
          }
        },

        // 市场定位
        positioning: {
          tagline: "现代化KONG替代品",
          fullStatement: "专为高智商犬种设计的可调节难度智力训练玩具，兼具KONG级耐用性与现代审美，可机洗设计彻底解决清洁痛点",
          differentiators: [
            {
              dimension: "功能创新",
              ourBrand: "3档可调难度（8mm/5mm/3mm孔径）",
              competitor: "KONG单一难度",
              advantage: "持续挑战性，延长使用周期"
            },
            {
              dimension: "清洁体验",
              ourBrand: "一体成型，可机洗/洗碗机",
              competitor: "KONG缝隙藏脏，只能手洗",
              advantage: "节省时间，更卫生"
            },
            {
              dimension: "设计美学",
              ourBrand: "5种马卡龙配色（北欧设计）",
              competitor: "KONG单调红色/黑色",
              advantage: "社交媒体友好，UGC激励"
            },
            {
              dimension: "价格策略",
              ourBrand: "$24.99（Medium尺寸）",
              competitor: "KONG $18.99 + Outward $14.99",
              advantage: "中高端定位，性价比优势"
            }
          ],
          valueProposition: "让聪明狗狗保持30分钟以上专注，主人再也不用担心家具被破坏"
        },

        // 品类角色
        categoryRole: {
          selected: "Routine",
          options: [
            {
              role: "Destination",
              desc: "目标品类",
              breakEven: "6-12个月",
              investment: "高",
              suitable: "核心战略品类，长期深耕"
            },
            {
              role: "Routine",
              desc: "常规品类",
              breakEven: "4-6个月",
              investment: "中",
              suitable: "稳定现金流，快速回本",
              isSelected: true
            },
            {
              role: "Seasonal",
              desc: "季节品类",
              breakEven: "节日冲刺",
              investment: "低",
              suitable: "节日礼物，短期爆发"
            },
            {
              role: "Convenience",
              desc: "便捷品类",
              breakEven: "2-3个月",
              investment: "极低",
              suitable: "快速周转，低毛利"
            }
          ],
          strategy: "采用Routine品类角色，目标4-6月盈亏平衡，稳定现金流后再考虑升级为Destination品类"
        }
      }
    };

    return dataMap[category] || dataMap["宠物用品"];
  },

  /**
   * 获取SPAN数据
   * 数据来源: 2.4-SPAN矩阵智能评估设计.md
   */
  getSPANData(category) {
    const dataMap = {
      "宠物用品": {
        // 市场细分评估数据
        segments: [
          {
            id: "mental-stimulation",
            name: "智力训练型",
            icon: "",

            // Y轴：市场吸引力评估 (5维度)
            attractiveness: {
              marketSize: { score: 82, value: "$580M/年", weight: 0.30 },
              growthRate: { score: 95, value: "+31.2% CAGR", weight: 0.30 },
              profitPotential: { score: 72, value: "34.8% 毛利率", weight: 0.25 },
              marketStability: { score: 78, value: "CV 16.2%", weight: 0.10 },
              strategicValue: { score: 85, value: "高技术趋势契合", weight: 0.05 },
              total: 83.15
            },

            // X轴：竞争地位评估 (4维度, 转化为可进入性)
            competitivePosition: {
              marketConcentration: { score: 85, value: "CR3 35.2%", weight: 0.35, desc: "分散, 易进入" },
              listingQualityGap: { score: 88, value: "竞品LQS 66.2", weight: 0.30, desc: "质量普遍偏低" },
              reviewMoat: { score: 72, value: "平均3,247条", weight: 0.25, desc: "中等门槛" },
              brandDominance: { score: 85, value: "品牌化65%", weight: 0.10, desc: "无巨头垄断" },
              total: 82.65
            },

            // 四象限判定
            quadrant: "star", // star, cash-cow, question, dog
            quadrantName: "明星象限",
            recommendation: "GO",
            confidence: "高",

            // 详细分析
            analysis: {
              strengths: [
                "市场快速增长(+31.2% CAGR)",
                "竞争分散(CR3仅35.2%)",
                "Listing质量普遍偏低(平均66分)",
                "无Amazon自营品牌威胁"
              ],
              risks: [
                "评论积累需要时间(3K+平均)",
                "需要差异化设计突围",
                "品牌冷启动成本较高"
              ],
              strategy: "激进投资, 快速抢占市场份额。首批订购1,500件(vs 原计划1,000件), ACoS可接受20-25%, 目标6-12个月内完成市场渗透。"
            }
          },
          {
            id: "durable-chew",
            name: "耐久咀嚼型",
            icon: "",

            attractiveness: {
              marketSize: { score: 88, value: "$720M/年", weight: 0.30 },
              growthRate: { score: 78, value: "+22.8% CAGR", weight: 0.30 },
              profitPotential: { score: 72, value: "34.8% 毛利率", weight: 0.25 },
              marketStability: { score: 78, value: "CV 16.2%", weight: 0.10 },
              strategicValue: { score: 85, value: "高技术趋势契合", weight: 0.05 },
              total: 79.85
            },

            competitivePosition: {
              marketConcentration: { score: 62, value: "CR3 48.3%", weight: 0.35, desc: "KONG统治, 需差异化" },
              listingQualityGap: { score: 88, value: "竞品LQS 66.2", weight: 0.30, desc: "质量偏低" },
              reviewMoat: { score: 38, value: "平均12,458条", weight: 0.25, desc: "高门槛(KONG 78K)" },
              brandDominance: { score: 68, value: "KONG占20%", weight: 0.10, desc: "KONG强势但非垄断" },
              total: 64.40
            },

            quadrant: "star-cow-border",
            quadrantName: "明星/金牛边界",
            recommendation: "SELECTIVE",
            confidence: "中",

            analysis: {
              strengths: [
                "市场规模大($720M)",
                "增长稳定(+22.8%)",
                "毛利率健康(34.8%)"
              ],
              risks: [
                "KONG统治力强(28.5%份额, 78K评论)",
                "评论护城河极高",
                "品牌忠诚度高(NPS 72)",
                "需2-3倍营销投入对抗KONG"
              ],
              strategy: "差异化切入, 避开KONG正面竞争。定位'现代化KONG', 强调设计美学/易清洁/智能功能三大差异。目标年轻宠物主(25-35岁)。设置止损点: 6个月月销<150件则考虑退出。"
            }
          }
        ],

        // 四象限战略指南
        quadrantGuide: {
          star: {
            name: "明星/增长象限",
            icon: "",
            threshold: "Y轴>60, X轴>60",
            strategy: "激进投资 (Aggressive Investment)",
            actions: [
              "资源分配: 优先级最高, 不惜成本快速扩张",
              "定价策略: 可适度溢价, 强调品质与创新",
              "营销投入: 高ACoS可接受(首年20-25%), 目标快速起量",
              "产品策略: 极致差异化, 至少2个$APPEALS维度显著领先",
              "时间窗口: 6-12个月内完成市场渗透"
            ]
          },
          cashCow: {
            name: "金牛/获利象限",
            icon: "",
            threshold: "Y轴<60, X轴>60",
            strategy: "效率优先 (Efficiency Focus)",
            actions: [
              "资源分配: 适度投入, 严控成本",
              "定价策略: 竞争性定价, 重视性价比",
              "营销投入: 低ACoS(8-10%), 依赖自然流量",
              "产品策略: 简化设计, 优化供应链效率",
              "现金流: 用于支持明星产品或新品开发"
            ]
          },
          question: {
            name: "问题象限",
            icon: "",
            threshold: "Y轴>60, X轴<60",
            strategy: "差异化突围或观望 (Selective Investment)",
            actions: [
              "风险评估: 高风险高回报",
              "进入条件: 必须找到巨大的未被满足痛点",
              "资源分配: 分阶段投入, 设置止损点",
              "差异化: 必须在$APPEALS至少3个维度上颠覆式创新",
              "监控指标: 6个月月销<150件则考虑退出"
            ]
          },
          dog: {
            name: "瘦狗/退出象限",
            icon: "",
            threshold: "Y轴<60, X轴<60",
            strategy: "坚决规避 (Avoid)",
            actions: [
              "判定: 夕阳产业 + 激烈竞争 = 死亡陷阱",
              "行动: 直接标记为红色预警, 不予考虑"
            ]
          }
        },

        // AI决策报告
        decision: {
          finalScore: 83,
          finalDecision: "GO",
          finalRecommendation: "强烈推荐进入",
          selectedSegment: "mental-stimulation",

          scoreBreakdown: {
            span: { score: 90, weight: "", desc: "智力训练型落入明星象限" },
            financial: { score: 85, weight: "", desc: "预估毛利率34.8%, ROI 72%" },
            technical: { score: 92, weight: "", desc: "ODM供应链成熟, 无技术壁垒" },
            team: { score: 78, weight: "", desc: "资金充足, 运营能力需补强" },
            risk: { score: 75, weight: "", desc: "白牌仿制风险中高" }
          },

          criticalSuccessFactors: [
            { priority: "P0", desc: "产品必须真正耐用 (材料不能缩水)", reason: "KONG用户对耐用性零容忍" },
            { priority: "P0", desc: "前200条评论必须4.5以上", reason: "使用Early Reviewer + Vine Program" },
            { priority: "P0", desc: "Listing质量必须Top 10%", reason: "聘请专业摄影师+文案优化" },
            { priority: "P1", desc: "TikTok冷启动 (15个达人合作)", reason: "积累初始销量+UGC内容" },
            { priority: "P1", desc: "建立品牌DTC触点 (独立站+邮件)", reason: "降低对Amazon平台依赖" }
          ],

          financialForecast: {
            month_1_3: {
              sales: [80, 150, 280],
              gmv: "$17.8K",
              adSpend: "$5.4K",
              acos: "30%",
              profit: "-$8.2K"
            },
            month_4_6: {
              sales: [420, 580, 720],
              gmv: "$63.5K",
              adSpend: "$8.9K",
              acos: "14%",
              profit: "+$2.1K (盈亏平衡: Month 5)"
            },
            month_7_12: {
              salesAvg: "650-800 件/月",
              gmv12M: "$187K",
              netProfit: "$28.5K",
              roi: "114%"
            }
          },

          conditions: [
            "必须100%执行关键成功因素(CSF)",
            "设置止损点: 6个月月销<200件则考虑pivot",
            "预留$5K应急资金 (补货/营销追加)"
          ]
        }
      }
    };

    return dataMap[category] || dataMap["宠物用品"];
  },

  /**
   * 获取$APPEALS数据
   * 数据来源: 2.5-APPEALS差异化分析设计.md
   */
  getAPPEALSData(category) {
    const dataMap = {
      "宠物用品": {
        // 竞品选择
        competitors: [
          {
            id: "kong-classic",
            name: "KONG Classic",
            asin: "B0002AR0II",
            price: "$12.99",
            rating: "4.6",
            reviews: 78345,
            bsr: 18,
            monthlySales: 35000,
            marketShare: "28.5%",
            coreValue: "超强耐用性 + 兽医推荐",
            role: "市场领导者"
          },
          {
            id: "outward-hound",
            name: "Outward Hound Hide-A-Squirrel",
            asin: "B0711Y9XTF",
            price: "$14.99",
            rating: "4.5",
            reviews: 31287,
            bsr: 142,
            monthlySales: 8500,
            marketShare: "14.8%",
            coreValue: "益智设计 + 趣味性",
            role: "创新者"
          },
          {
            id: "chuckit-ultra",
            name: "Chuckit! Ultra Ball",
            asin: "B000F4AVPA",
            price: "$8.99",
            rating: "4.4",
            reviews: 52119,
            bsr: 35,
            monthlySales: 22000,
            coreValue: "超高性价比 + 户外适用",
            role: "性价比王"
          }
        ],

        // 我们的产品定位
        ourProduct: {
          name: "PawGenius™ Smart Interactive Toy",
          targetPrice: "$24.99",
          positioning: "现代化的KONG + 智能化的Outward Hound",
          coreValue: "智能 + 耐用 + 美学 三合一",
          targetScore: 8.86
        },

        // 8维度评分矩阵
        dimensions: [
          {
            key: "price",
            name: "$ Price",
            nameZh: "价格感知",
            weight: 0.15,
            scores: {
              kong: 6.0,
              outward: 7.5,
              chuckit: 9.0,
              ideal: 8.0,
              ours: 7.5
            },
            analysis: {
              kongReason: "$12.99, 性价比中等",
              outwardReason: "$14.99, 合理",
              chuckitReason: "$8.99, 超高性价比",
              oursReason: "$24.99, 价格偏高但强调长期价值",
              gap: "填平(-0.5)",
              strategy: "突出'长期价值' → 'Costs 2x, Lasts 10x', 强调智能功能 + 设计溢价"
            }
          },
          {
            key: "availability",
            name: "A Availability",
            nameZh: "可获得性",
            weight: 0.10,
            scores: {
              kong: 9.0,
              outward: 8.5,
              chuckit: 9.5,
              ideal: 9.0,
              ours: 9.0
            },
            analysis: {
              kongReason: "FBA, 库存稳定, OOS率<2%",
              outwardReason: "FBA, 偶尔断货",
              chuckitReason: "FBA, 库存充足",
              oursReason: "计划使用FBA",
              gap: "持平(0)",
              strategy: "维持30天安全库存, 避免断货"
            }
          },
          {
            key: "packaging",
            name: "P Packaging",
            nameZh: "包装体验",
            weight: 0.12,
            scores: {
              kong: 5.5,
              outward: 7.0,
              chuckit: 4.0,
              ideal: 9.0,
              ours: 9.0
            },
            analysis: {
              kongReason: "简易塑封包装, 评论提及'包装简陋'23次",
              outwardReason: "彩盒包装, 有产品展示窗",
              chuckitReason: "吸塑包装, 功能性为主",
              oursReason: "环保礼盒装 + 品牌故事",
              gap: "建优(+2.0)",
              strategy: "环保牛皮纸礼盒(FSC认证) + 磁吸开合 + 使用指南 + 品牌故事卡 + 训练技巧小册子, 开箱即可晒Instagram",
              costImpact: "+$0.90/件, 但提升感知价值+$5"
            }
          },
          {
            key: "performance",
            name: "P Performance",
            nameZh: "核心性能",
            weight: 0.20,
            scores: {
              kong: 9.5,
              outward: 7.0,
              chuckit: 6.5,
              ideal: 9.0,
              ours: 9.0
            },
            analysis: {
              kongReason: "耐用性10/10, 互动性5/10, 智能化0/10 → 综合9.5",
              outwardReason: "耐用性6/10(差评18%破损), 互动性9/10, 智能化0/10 → 综合7.0",
              chuckitReason: "耐用性7/10, 互动性3/10, 智能化0/10 → 综合6.5",
              oursReason: "耐用性9/10(TPR橡胶), 互动性9/10(可调难度), 智能化8/10(App连接) → 综合9.0",
              gap: "填平(-0.5)",
              strategy: "天然橡胶+TPR复合配方, 3档可调难度, 不规则弹跳, 藏食功能, 接近KONG耐用性但增加互动性"
            }
          },
          {
            key: "easeOfUse",
            name: "E Ease of use",
            nameZh: "易用性",
            weight: 0.18,
            scores: {
              kong: 7.0,
              outward: 6.5,
              chuckit: 9.0,
              ideal: 9.5,
              ours: 9.5
            },
            analysis: {
              kongReason: "痛点: '难清洁'(342条评论), '不知道怎么用'(首次使用门槛)",
              outwardReason: "痛点: '小松鼠容易丢'(187条评论), '难度太低'(156条评论)",
              chuckitReason: "优点: '开箱即用'(无学习成本)",
              oursReason: "一体成型设计(零件不丢) + 可机洗 + 包装二维码看视频 + 难度指示",
              gap: "建优(+2.5)",
              strategy: "1) 一体成型, 2) 可机洗(Dishwasher Safe), 3) 包装印二维码(30秒使用视频), 4) 表面刻字'Level 1/2/3'难度指示, 目标开箱3分钟内宠物开始玩"
            }
          },
          {
            key: "assurances",
            name: "A Assurances",
            nameZh: "保证服务",
            weight: 0.10,
            scores: {
              kong: 8.5,
              outward: 7.0,
              chuckit: 6.5,
              ideal: 9.0,
              ours: 9.0
            },
            analysis: {
              kongReason: "兽医推荐率82%, 质保90天, 客服响应48小时",
              outwardReason: "品牌知名度中等, 质保30天",
              chuckitReason: "低价品, 质保较弱",
              oursReason: "12个月质保(行业最长) + '不耐咬全额退款' + 24小时响应 + 专属训犬师咨询",
              gap: "建优(+0.5)",
              strategy: "1) 12个月质保(vs行业30-90天), 2) 承诺'If your dog destroys it, we replace it FREE', 3) CPSC/FDA认证标识可视化, 4) 24小时邮件响应, 5) 专属训犬师咨询(购买后7天免费)"
            }
          },
          {
            key: "lifecycle",
            name: "L Life cycle cost",
            nameZh: "生命周期成本",
            weight: 0.08,
            scores: {
              kong: 7.0,
              outward: 5.5,
              chuckit: 6.0,
              ideal: 8.5,
              ours: 8.5
            },
            analysis: {
              kongReason: "$12.99, 使用18-24月, 月均$0.54-0.72",
              outwardReason: "$14.99, 使用6-9月(松鼠易丢), 需补充配件$6.99, 月均$2.16",
              chuckitReason: "$8.99, 使用3-6月, 月均$1.50-3.00",
              oursReason: "$24.99, 设计寿命24-36月, 无耗材, 可机洗延长寿命, 月均$0.69-1.04",
              gap: "建优(+1.5)",
              strategy: "Listing文案: '虽然价格是KONG的2倍, 但功能是3倍, 寿命是1.5倍, 总体TCO更低'"
            }
          },
          {
            key: "social",
            name: "S Social acceptance",
            nameZh: "社会认同",
            weight: 0.07,
            scores: {
              kong: 6.0,
              outward: 7.5,
              chuckit: 5.0,
              ideal: 9.5,
              ours: 9.5
            },
            analysis: {
              kongReason: "Instagram #kongdog 127K posts, 产品辨识度高但设计传统",
              outwardReason: "Instagram #hideAsquirrel 8.3K posts, 产品有趣UGC多",
              chuckitReason: "功能性产品, 晒图率低",
              oursReason: "5种马卡龙配色, 北欧极简设计, UGC激励机制(Tag #PawGeniusMoment), KOL合作15个",
              gap: "建优(+2.0)",
              strategy: "1) 高颜值设计(薄荷绿/樱花粉/天空蓝/奶油黄/珊瑚橙), 2) 包装内卡片'Tag #PawGeniusMoment赢月度大奖', 3) 官方转发优质UGC, 4) 合作15个宠物博主(10K-50K粉丝), 目标6个月内话题达5K+ posts"
            }
          }
        ],

        // 加权综合得分
        finalScores: {
          kong: 7.45,
          outward: 7.05,
          chuckit: 7.18,
          ours: 8.86
        },

        // 优势差距
        advantages: {
          vsKong: 1.41,
          vsOutward: 1.81,
          vsChuckit: 1.68
        },

        // 价值曲线洞察
        valueInsights: {
          advantages: [
            { dimension: "Packaging", ourScore: 9.0, avgCompetitor: 6.2, gap: 2.8, badge: "最大优势" },
            { dimension: "Social acceptance", ourScore: 9.5, avgCompetitor: 6.2, gap: 3.3, badge: "核心差异" },
            { dimension: "Ease of use", ourScore: 9.5, avgCompetitor: 7.5, gap: 2.0, badge: "显著领先" },
            { dimension: "Life cycle cost", ourScore: 8.5, avgCompetitor: 6.2, gap: 2.3, badge: "长期价值" }
          ],
          fillGaps: [
            { dimension: "Price", ourScore: 7.5, competitor: "Chuckit", competitorScore: 9.0, action: "需强化价值传达" },
            { dimension: "Performance", ourScore: 9.0, competitor: "KONG", competitorScore: 9.5, action: "耐用性需接近KONG" }
          ],
          parity: [
            { dimension: "Availability", ourScore: 9.0, action: "FBA保证" },
            { dimension: "Assurances", ourScore: 9.0, action: "12个月质保建立信任" }
          ]
        },

        // 产品规格输出(PRD)
        productSpec: {
          productName: "PawGenius™ Smart Interactive Dog Toy",
          version: "V1.0 MVP",
          targetLaunch: "Q1 2025",

          material: {
            composition: "天然橡胶(60%) + TPR(40%)",
            hardness: "Shore A 70-75",
            tensileStrength: "≥15 MPa",
            tearStrength: "≥35 kN/m",
            certifications: ["CPSC", "FDA食品级", "无BPA", "无邻苯二甲酸盐"],
            voc: "< 50 ppm"
          },

          features: {
            difficultyLevels: ["Level 1: 8mm开口(简单)", "Level 2: 5mm开口(中等)", "Level 3: 3mm开口(困难)"],
            adjustMethod: "手动旋转顶部旋钮(无需工具)",
            bouncePattern: "不规则弹跳(底部非对称凸起)",
            waterProof: "浮水功能(比重0.92)",
            dishwasher: "可机洗(≤60°C)"
          },

          sizes: [
            { name: "Small", weight: "85g", diameter: "7.5cm", price: "$19.99", suitFor: "<20磅犬" },
            { name: "Medium", weight: "145g", diameter: "9.5cm", price: "$24.99", suitFor: "20-60磅犬", badge: "主推款" },
            { name: "Large", weight: "215g", diameter: "11.5cm", price: "$29.99", suitFor: ">60磅犬" }
          ],

          colors: [
            { name: "薄荷绿", pantone: "324C" },
            { name: "樱花粉", pantone: "182C" },
            { name: "天空蓝", pantone: "278C" },
            { name: "奶油黄", pantone: "1205C" },
            { name: "珊瑚橙", pantone: "171C" }
          ],

          packaging: {
            material: "FSC认证牛皮纸(350g铜版纸)",
            size: "12×12×8 cm",
            structure: "磁吸开合礼盒",
            window: "透明PVC窗口",
            includes: ["产品本体", "使用指南折页(中英双语)", "品牌故事卡(90×54mm)", "训练技巧小册子(16页A6)", "UGC激励卡"],
            cost: "$0.90/件",
            valueAdd: "+$5感知价值"
          },

          warranty: {
            duration: "12个月(行业最长)",
            promise: "If your dog destroys it, we replace it FREE",
            return: "30天无理由退货"
          },

          costStructure: {
            material: "$3.50",
            moldAmortization: "$1.80 (5000件分摊)",
            labor: "$1.70",
            packaging: "$0.90",
            qc: "$0.40",
            manual: "$0.25",
            totalCOGS: "$8.55",
            sellingPrice: "$24.99",
            platformFee: "$8.80",
            grossProfit: "$7.64",
            margin: "30.6%"
          }
        },

        // 差异化总结
        summary: {
          overallScore: "8.86/10 (行业领先)",
          coreAdvantages: [
            "社会认同 (9.5分) - 高颜值+UGC激励",
            "易用性 (9.5分) - 一体成型+可机洗",
            "包装体验 (9.0分) - 礼盒装+品牌故事"
          ],
          gapsToFill: [
            "Performance: 达到9.0分 (接近KONG 9.5)",
            "Price: 强化价值传达 (TCO vs 单价)"
          ],
          nextStep: "进入 Module 2.6 执行KANO需求分级, 将$APPEALS特征分类为Must-be/One-dim/Attractive, 确定功能优先级与MVP范围"
        }
      }
    };

    return dataMap[category] || dataMap["宠物用品"];
  },

  /**
   * 获取KANO数据
   * 数据来源: 2.6-KANO需求分级引擎设计.md
   */
  getKANOData(category) {
    const dataMap = {
      "宠物用品": {
        // 产品信息
        productName: "PawGenius™ Smart Interactive Toy",
        targetCOGS: 7.50,
        originalCOGS: 11.38,

        // 特征列表 (按KANO分类)
        features: [
          // Must-be (基本型) - 6个特征
          {
            id: "F1",
            name: "天然橡胶材质",
            category: "must-be",
            categoryName: "Must-be (基本型)",
            mentionRate: 78,
            satisfactionImpact: 45,
            cost: 0.85,
            reason: "78% review提及, 缺失会导致45%满意度下降",
            analysis: {
              withFeature: "满意度: 82%",
              withoutFeature: "满意度: 37% (-45%)",
              conclusion: "用户默认期望,缺失会极大降低满意度"
            },
            status: "retained",
            priority: "P0"
          },
          {
            id: "F2",
            name: "适配不同犬型尺寸",
            category: "must-be",
            categoryName: "Must-be (基本型)",
            mentionRate: 65,
            satisfactionImpact: 38,
            cost: 0.35,
            reason: "65% review提及, 缺失会导致38%满意度下降",
            analysis: {
              withFeature: "满意度: 79%",
              withoutFeature: "满意度: 41% (-38%)",
              conclusion: "不同犬型需求不同,缺失直接影响适用性"
            },
            status: "retained",
            priority: "P0"
          },
          {
            id: "F3",
            name: "耐咬耐磨 (≥10,000次)",
            category: "must-be",
            categoryName: "Must-be (基本型)",
            mentionRate: 72,
            satisfactionImpact: 42,
            cost: 1.20,
            reason: "72% review提及, 缺失会导致42%满意度下降",
            analysis: {
              withFeature: "满意度: 85%",
              withoutFeature: "满意度: 43% (-42%)",
              conclusion: "耐久性是基本要求,破损率高会导致大量差评"
            },
            status: "retained",
            priority: "P0"
          },
          {
            id: "F4",
            name: "无毒无异味 (FDA认证)",
            category: "must-be",
            categoryName: "Must-be (基本型)",
            mentionRate: 68,
            satisfactionImpact: 52,
            cost: 0.45,
            reason: "68% review提及, 缺失会导致52%满意度下降",
            analysis: {
              withFeature: "满意度: 88%",
              withoutFeature: "满意度: 36% (-52%)",
              conclusion: "安全问题是红线,缺失会导致退货和法律风险"
            },
            status: "retained",
            priority: "P0"
          },
          {
            id: "F5",
            name: "易清洗 (可机洗/洗碗机)",
            category: "must-be",
            categoryName: "Must-be (基本型)",
            mentionRate: 55,
            satisfactionImpact: 32,
            cost: 0.25,
            reason: "55% review提及, 缺失会导致32%满意度下降",
            analysis: {
              withFeature: "满意度: 75%",
              withoutFeature: "满意度: 43% (-32%)",
              conclusion: "卫生便利性是基本期望,难清洗会降低复购"
            },
            status: "retained",
            priority: "P0"
          },
          {
            id: "F6",
            name: "基础零食填充孔 (直径2cm)",
            category: "must-be",
            categoryName: "Must-be (基本型)",
            mentionRate: 62,
            satisfactionImpact: 35,
            cost: 0.80,
            reason: "62% review提及, 缺失会导致35%满意度下降",
            analysis: {
              withFeature: "满意度: 80%",
              withoutFeature: "满意度: 45% (-35%)",
              conclusion: "零食互动是核心玩法,缺失会失去竞争力"
            },
            status: "retained",
            priority: "P0"
          },

          // One-dimensional (期望型) - 4个特征
          {
            id: "F7",
            name: "浮水设计 (适配水上玩耍)",
            category: "one-dimensional",
            categoryName: "One-dimensional (期望型)",
            mentionRate: 45,
            satisfactionImpact: 28,
            cost: 0.35,
            reason: "45% review提及, 有该功能满意度提升28%",
            analysis: {
              withFeature: "满意度: 78%",
              withoutFeature: "满意度: 50% (中性)",
              conclusion: "有则加分,无则不扣分,提升产品适用场景"
            },
            status: "retained",
            priority: "P1"
          },
          {
            id: "F8",
            name: "多层次咬点设计 (≥3种纹理)",
            category: "one-dimensional",
            categoryName: "One-dimensional (期望型)",
            mentionRate: 38,
            satisfactionImpact: 22,
            cost: 0.40,
            reason: "38% review提及, 有该功能满意度提升22%",
            analysis: {
              withFeature: "满意度: 72%",
              withoutFeature: "满意度: 50% (中性)",
              conclusion: "丰富咬感提升体验,但不是必需"
            },
            status: "retained",
            priority: "P1"
          },
          {
            id: "F9",
            name: "不规则弹跳路径 (防滚设计)",
            category: "one-dimensional",
            categoryName: "One-dimensional (期望型)",
            mentionRate: 42,
            satisfactionImpact: 25,
            cost: 0.30,
            reason: "42% review提及, 有该功能满意度提升25%",
            analysis: {
              withFeature: "满意度: 75%",
              withoutFeature: "满意度: 50% (中性)",
              conclusion: "增加互动趣味性,但不影响基本功能"
            },
            status: "retained",
            priority: "P1"
          },
          {
            id: "F10",
            name: "品牌Logo印刻 (防伪标识)",
            category: "one-dimensional",
            categoryName: "One-dimensional (期望型)",
            mentionRate: 28,
            satisfactionImpact: 15,
            cost: 0.30,
            reason: "28% review提及, 有该功能满意度提升15%",
            analysis: {
              withFeature: "满意度: 65%",
              withoutFeature: "满意度: 50% (中性)",
              conclusion: "品牌信任背书,适度加分项"
            },
            status: "retained",
            priority: "P1"
          },

          // Attractive (兴奋型) - 4个特征
          {
            id: "F11",
            name: "AI难度自适应系统",
            category: "attractive",
            categoryName: "Attractive (兴奋型)",
            mentionRate: 18,
            satisfactionImpact: 48,
            cost: 1.25,
            reason: "仅18% review提及, 但有该功能满意度暴涨48%",
            analysis: {
              withFeature: "满意度: 92% (+42%)",
              withoutFeature: "满意度: 50% (中性)",
              conclusion: "创新亮点,超出预期,形成差异化优势"
            },
            status: "retained",
            priority: "P0",
            highlight: true
          },
          {
            id: "F12",
            name: "App联动 (游戏时长追踪)",
            category: "attractive",
            categoryName: "Attractive (兴奋型)",
            mentionRate: 12,
            satisfactionImpact: 35,
            cost: 0.55,
            reason: "仅12% review提及, 但有该功能满意度提升35%",
            analysis: {
              withFeature: "满意度: 85% (+35%)",
              withoutFeature: "满意度: 50% (中性)",
              conclusion: "科技感加成,吸引年轻宠物主"
            },
            status: "retained",
            priority: "P1",
            highlight: true
          },
          {
            id: "F13",
            name: "双色组合设计 (高对比度)",
            category: "attractive",
            categoryName: "Attractive (兴奋型)",
            mentionRate: 22,
            satisfactionImpact: 18,
            cost: 0.25,
            reason: "22% review提及, 有该功能满意度提升18%",
            analysis: {
              withFeature: "满意度: 68% (+18%)",
              withoutFeature: "满意度: 50% (中性)",
              conclusion: "视觉吸引力提升,增强辨识度"
            },
            status: "retained",
            priority: "P2",
            highlight: true
          },
          {
            id: "F14",
            name: "环保可降解包装",
            category: "attractive",
            categoryName: "Attractive (兴奋型)",
            mentionRate: 15,
            satisfactionImpact: 28,
            cost: 0.20,
            reason: "仅15% review提及, 但有该功能满意度提升28%",
            analysis: {
              withFeature: "满意度: 78% (+28%)",
              withoutFeature: "满意度: 50% (中性)",
              conclusion: "ESG价值观共鸣,提升品牌形象"
            },
            status: "retained",
            priority: "P2",
            highlight: true
          },

          // Indifferent (无差异) - 3个特征 (已删除)
          {
            id: "F15",
            name: "香味释放功能 (薄荷味胶囊)",
            category: "indifferent",
            categoryName: "Indifferent (无差异)",
            mentionRate: 8,
            satisfactionImpact: 2,
            cost: 1.85,
            reason: "仅8% review提及, 有无该功能满意度仅变化2%",
            analysis: {
              withFeature: "满意度: 52% (+2%)",
              withoutFeature: "满意度: 50% (中性)",
              conclusion: "成本高但用户无感,删除可节省$1.85"
            },
            status: "deleted",
            priority: "N/A",
            deletionReason: "高成本低价值,ROI仅1.1%, 删除后无满意度损失"
          },
          {
            id: "F16",
            name: "LED发光模块 (夜间可见)",
            category: "indifferent",
            categoryName: "Indifferent (无差异)",
            mentionRate: 5,
            satisfactionImpact: 3,
            cost: 1.58,
            reason: "仅5% review提及, 有无该功能满意度仅变化3%",
            analysis: {
              withFeature: "满意度: 53% (+3%)",
              withoutFeature: "满意度: 50% (中性)",
              conclusion: "噱头功能,用户实际使用率低,删除可节省$1.58"
            },
            status: "deleted",
            priority: "N/A",
            deletionReason: "故障率高(12%), 增加售后成本, 删除可提升可靠性"
          },
          {
            id: "F17",
            name: "GPS定位追踪 (防丢失)",
            category: "indifferent",
            categoryName: "Indifferent (无差异)",
            mentionRate: 3,
            satisfactionImpact: 1,
            cost: 0.45,
            reason: "仅3% review提及, 有无该功能满意度仅变化1%",
            analysis: {
              withFeature: "满意度: 51% (+1%)",
              withoutFeature: "满意度: 50% (中性)",
              conclusion: "玩具场景不适用,GPS耗电且信号差,删除可节省$0.45"
            },
            status: "deleted",
            priority: "N/A",
            deletionReason: "场景不匹配,增加续航压力, 用户反馈'没必要'"
          }
        ],

        // 统计摘要
        summary: {
          mustBe: {
            count: 6,
            totalCost: 3.90,
            percentage: 52,
            description: "保留所有基本型特征,确保底线满意度"
          },
          oneDimensional: {
            count: 4,
            totalCost: 1.35,
            percentage: 18,
            description: "期望型特征全部保留,提升竞争力"
          },
          attractive: {
            count: 4,
            totalCost: 2.25,
            percentage: 30,
            description: "兴奋型特征作为差异化亮点"
          },
          indifferent: {
            count: 3,
            deletedCount: 3,
            savedCost: 3.88,
            description: "无差异型特征全部删除,优化成本结构"
          }
        },

        // MVP总结
        mvpSummary: {
          version: "V1.0",
          retainedFeatures: 14,
          deletedFeatures: 3,
          finalCOGS: 7.50,
          costOptimization: {
            amount: 3.88,
            percentage: 34.1
          },
          recommendations: [
            {
              type: "success",
              icon: "",
              text: "保留所有Must-be特征,确保基本满意度≥75%"
            },
            {
              type: "success",
              icon: "",
              text: "Attractive特征(F11-F14)作为差异化亮点,形成'现代化KONG'定位"
            },
            {
              type: "warning",
              icon: "️",
              text: "建议F21训练小册子简化为4页折页, 成本从$0.25降至$0.10"
            },
            {
              type: "warning",
              icon: "️",
              text: "建议F24质保策略调整: 全额退款→6个月免费换新, 成本从$1.25降至$0.45"
            },
            {
              type: "info",
              icon: "",
              text: "删除Indifferent特征后, COGS从$11.38降至$7.50, 提升毛利率12.8个百分点"
            }
          ],
          nextStep: "进入 Module 2.7 生成完整Charter文档, 整合所有分析数据形成产品开发任务书"
        },

        // KANO模型元数据
        metadata: {
          analysisDate: "2025-11-19",
          sampleSize: "2,847条Amazon Review (2023-2025)",
          methodology: "Better-Worse系数分析法",
          confidenceLevel: "92%",
          categories: [
            {
              key: "must-be",
              name: "Must-be (基本型)",
              color: "#ef4444",
              description: "缺失会导致极度不满, 具备仅能达到中性",
              formula: "Better系数 < 0.3 且 Worse系数 > 0.5"
            },
            {
              key: "one-dimensional",
              name: "One-dimensional (期望型)",
              color: "#3b82f6",
              description: "有则加分, 无则扣分, 满意度线性相关",
              formula: "Better系数 > 0.3 且 Worse系数 > 0.3"
            },
            {
              key: "attractive",
              name: "Attractive (兴奋型)",
              color: "#22c55e",
              description: "超出预期的惊喜, 有则大幅加分, 无则不扣分",
              formula: "Better系数 > 0.5 且 Worse系数 < 0.3"
            },
            {
              key: "indifferent",
              name: "Indifferent (无差异)",
              color: "#6b7280",
              description: "有无皆可, 用户无感, 删除不影响满意度",
              formula: "Better系数 < 0.3 且 Worse系数 < 0.3"
            }
          ]
        }
      }
    };

    return dataMap[category] || dataMap["宠物用品"];
  },

  /**
   * 获取Charter数据
   * 数据来源: 2.7-数字化Charter生成器设计.md
   */
  getCharterData(category) {
    const dataMap = {
      "宠物用品": {
        // Charter元数据
        metadata: {
          productName: "PawGenius™ Smart Interactive Dog Toy",
          version: "V1.0 MVP",
          charterVersion: "Charter v1.0",
          date: "2025-11-19",
          status: "APPROVED",
          approvalScore: 83,
          targetLaunchDate: "2025 Q1"
        },

        // 数据源状态 (前置模块完成情况)
        dataSources: {
          wukan: { completed: true, name: "五看洞察" },
          marketMap: { completed: true, name: "市场地图" },
          stp: { completed: true, name: "STP聚焦" },
          span: { completed: true, name: "SPAN矩阵" },
          appeals: { completed: true, name: "$APPEALS" },
          kano: { completed: true, name: "KANO分级" }
        },

        // Chapter I: Executive Summary
        executiveSummary: {
          productOverview: {
            productName: "PawGenius™ Smart Interactive Dog Toy",
            productType: "智能互动宠物玩具（互动玩具细分市场）",
            targetLaunchDate: "2025 Q1",
            productVersion: "V1.0 MVP",
            oneLiner: "The Smart Toy That Grows With Your Dog - 与你的狗狗共同成长的智能玩具",
            strategicPositioning: "现代化的KONG替代品 - 保留KONG的超强耐用性基因，升级为年轻化/美学化/智能化的新一代互动玩具"
          },
          coreMetrics: [
            { metric: "目标市场规模", value: "$580M/年", source: "智力训练型细分市场GMV" },
            { metric: "市场增长率", value: "31.2% CAGR", source: "2021-2024搜索量趋势" },
            { metric: "SPAN矩阵评分", value: "(83, 83)", source: "Y轴市场吸引力 × X轴竞争地位" },
            { metric: "象限定位", value: " 明星象限", source: "高吸引力 + 强可进入性" },
            { metric: "目标售价", value: "$24.99 (Medium)", source: "空白价格带$18-28" },
            { metric: "目标毛利率", value: "34.8%", source: "高于行业基准25-30%" },
            { metric: "12月ROI预测", value: "114% ($28.5K净利)", source: "SPAN财务模型" },
            { metric: "MVP特征数", value: "14个 (删除3个无差异特征)", source: "KANO分级引擎" },
            { metric: "目标COGS", value: "$7.50", source: "成本优化后 (原$11.38)" }
          ],
          keyDecision: {
            decision: "GO",
            score: 83,
            reasoning: "基于SPAN矩阵综合评分83/100（明星象限），市场吸引力与竞争可进入性双高，财务预测12月ROI达114%，建议立即启动产品开发。"
          }
        },

        // Chapter II: Market Opportunity
        marketOpportunity: {
          marketSize: {
            totalMarket: "$3.2B",
            targetSegment: "$580M",
            growth: "31.2% CAGR",
            trend: "智力训练型需求爆发式增长，从2021年的$142M增长至2024年的$580M"
          },
          customerNeeds: [
            "宠物陪伴焦虑 (78% 提及率)",
            "智力刺激需求 (62% 提及率)",
            "耐用性要求 (72% 提及率)",
            "易清洁便利性 (55% 提及率)"
          ],
          marketGaps: [
            "空白价格带$18-28 (竞品集中在$12和$35+)",
            "现代化设计缺失 (KONG外观老化，年轻用户接受度低)",
            "智能化升级空间 (传统玩具无数据追踪功能)"
          ]
        },

        // Chapter III: Strategic Positioning
        strategicPositioning: {
          stp: {
            segmentation: "智力训练型细分市场 ($580M)",
            targeting: "现代化KONG替代品",
            positioning: "年轻化/美学化/智能化的新一代互动玩具"
          },
          differentiation: [
            "AI难度自适应系统 (满意度+48%)",
            "App联动游戏时长追踪 (满意度+35%)",
            "双色高对比度设计 (满意度+18%)",
            "环保可降解包装 (满意度+28%)"
          ],
          competitiveAdvantage: "$APPEALS综合得分8.86 vs KONG 7.45 (+19%优势)"
        },

        // Chapter IV: Competitive Landscape
        competitiveLandscape: {
          competitors: [
            { name: "KONG Classic", price: "$12.99", score: 7.45, position: "传统领导者", weakness: "设计老化" },
            { name: "Outward Hound", price: "$15.99", score: 7.05, position: "智力玩具专家", weakness: "耐久性差" },
            { name: "Chuckit Ultra", price: "$8.99", score: 7.18, position: "户外玩具", weakness: "室内场景弱" }
          ],
          competitiveStrategy: "差异化竞争 - 避免与KONG正面价格战，通过智能化功能占领年轻用户心智"
        },

        // Chapter V: Product Definition
        productDefinition: {
          mvpFeatures: {
            mustBe: [
              "天然橡胶材质 ($0.85)",
              "适配不同犬型尺寸 ($0.35)",
              "耐咬耐磨≥10,000次 ($1.20)",
              "无毒无异味FDA认证 ($0.45)",
              "易清洗可机洗 ($0.25)",
              "基础零食填充孔 ($0.80)"
            ],
            oneDimensional: [
              "浮水设计 ($0.35)",
              "多层次咬点设计 ($0.40)",
              "不规则弹跳路径 ($0.30)",
              "品牌Logo印刻 ($0.30)"
            ],
            attractive: [
              "AI难度自适应系统 ($1.25) ",
              "App联动时长追踪 ($0.55) ",
              "双色组合设计 ($0.25) ",
              "环保可降解包装 ($0.20) "
            ]
          },
          technicalSpecs: {
            material: "天然橡胶 + 食品级TPR",
            sizes: ["Small (2.5\")", "Medium (3.5\")", "Large (4.5\")"],
            colors: ["橙蓝双色", "绿紫双色"],
            durability: "≥10,000次咬合测试",
            safety: "FDA认证 + 欧盟EN71标准",
            packaging: "100%可降解纸盒 + FSC认证"
          },
          finalCOGS: "$7.50"
        },

        // Chapter VI: Financial Projections
        financialProjections: {
          pricingStrategy: {
            retailPrice: "$24.99",
            cogs: "$7.50",
            grossMargin: "70%",
            grossProfit: "$17.49",
            platformFee: "15%",
            netMargin: "34.8%"
          },
          forecast12Months: {
            month1_3: {
              units: 450,
              revenue: "$11,246",
              cogs: "$3,375",
              grossProfit: "$7,871",
              adSpend: "$5,623 (50% ACoS)",
              netProfit: "$2,248"
            },
            month4_6: {
              units: 780,
              revenue: "$19,492",
              cogs: "$5,850",
              grossProfit: "$13,642",
              adSpend: "$7,797 (40% ACoS)",
              netProfit: "$5,845"
            },
            month7_12: {
              units: 2340,
              revenue: "$58,478",
              cogs: "$17,550",
              grossProfit: "$40,928",
              adSpend: "$17,543 (30% ACoS)",
              netProfit: "$23,385"
            },
            total: {
              units: 3570,
              revenue: "$89,216",
              cogs: "$26,775",
              grossProfit: "$62,441",
              adSpend: "$30,963",
              netProfit: "$31,478",
              roi: "114%"
            }
          },
          breakEvenAnalysis: {
            monthsToBreakEven: 4.2,
            unitsToBreakEven: 892,
            note: "保守估计第5个月实现盈亏平衡"
          }
        },

        // Chapter VII: Risk Analysis
        riskAnalysis: {
          risks: [
            {
              category: "市场风险",
              risk: "KONG降价反击",
              probability: "中 (40%)",
              impact: "中",
              mitigation: "差异化定位，避免正面价格战；强化智能化功能壁垒"
            },
            {
              category: "供应链风险",
              risk: "FDA认证延迟",
              probability: "低 (15%)",
              impact: "高",
              mitigation: "提前3个月启动认证流程；备选供应商方案"
            },
            {
              category: "技术风险",
              risk: "AI算法迭代失败",
              probability: "低 (20%)",
              impact: "中",
              mitigation: "MVP简化为3档固定难度；V2.0再升级自适应算法"
            },
            {
              category: "财务风险",
              risk: "ACoS超预期",
              probability: "中 (35%)",
              impact: "中",
              mitigation: "月度ACoS监控；50%→40%→30%分阶段降低"
            }
          ],
          contingencyPlan: "如6个月ROI<50%，暂停新品研发，聚焦现有SKU优化"
        },

        // Chapter VIII: Go-to-Market Strategy
        gtmStrategy: {
          launchPlatform: "Amazon US (先行市场)",
          launchTimeline: [
            { phase: "产品开发", duration: "Month 1-2", milestone: "完成原型 + FDA认证" },
            { phase: "小批量测试", duration: "Month 3", milestone: "100单元Beta测试" },
            { phase: "正式上线", duration: "Month 4", milestone: "Amazon新品发布" },
            { phase: "增长期", duration: "Month 5-12", milestone: "扩展至Chewy/Walmart" }
          ],
          marketingStrategy: {
            phase1: "Amazon PPC + Influencer Seeding (50% ACoS)",
            phase2: "品牌视频 + Review积累 (40% ACoS)",
            phase3: "自然流量主导 (30% ACoS)"
          },
          keyMetrics: [
            "月度销量目标: 450 → 780 → 390单/月",
            "Review积累: 前3个月≥50条4.5+星评",
            "ACoS下降: 50% → 40% → 30%"
          ]
        },

        // Chapter IX: Approval Decision
        approvalDecision: {
          finalScore: 83,
          decision: "APPROVED",
          approvalDate: "2025-11-19",
          conditions: [
            "FDA认证必须在Month 2内完成",
            "Beta测试满意度≥80%方可正式上线",
            "Month 6 Review: 若ROI<50%，暂停后续SKU开发"
          ],
          nextSteps: [
            "组建PDT（产品开发团队）",
            "启动供应商筛选流程",
            "提交FDA认证申请",
            "制定详细项目计划（Gantt图）"
          ],
          signatures: {
            productManager: "AI Product Manager",
            technicalLead: "AI R&D Lead",
            financialController: "AI CFO",
            approver: "AI Virtual IRB"
          }
        }
      }
    };

    return dataMap[category] || dataMap["宠物用品"];
  }
};
