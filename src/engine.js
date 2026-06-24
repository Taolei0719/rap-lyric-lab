(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.RapLyricEngine = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const STYLE_PROFILES = {
    warmLight: {
      label: "雨后自省",
      aliases: ["love", "醒来", "自由", "平和"],
      cadence: "旋律说唱",
      energy: 55,
      tone: "温柔",
      hooks: [
        "我睁开眼，窗外的雨刚停",
        "all my life, still chasing what I need",
        "如果世界没给爱，我先抱紧自己",
        "wake up, wake up, let me breathe"
      ],
      nouns: ["清晨", "雨后", "镜子", "天空", "灯光", "梦", "自由", "代价"],
      verbs: ["醒来", "接纳", "拨开", "靠近", "放慢", "证明", "呼吸", "原谅"],
      images: ["雨后的街像一张刚洗过的底片", "我把坏情绪折好塞进外套里", "光从云缝里落下来像新的伴奏"],
      closers: ["这次我不逃了，我把自己写进黎明", "我用一口气，把昨天唱到天晴"]
    },
    brotherhood: {
      label: "老友并肩",
      aliases: ["兄弟", "背叛", "录音棚", "圈子"],
      cadence: "街头叙事",
      energy: 72,
      tone: "硬朗",
      hooks: [
        "给最早同行的人，路再窄也不换边",
        "失败可以吞下，背叛不能忍耐",
        "灯灭了还在录，直到天色变白",
        "we built this from dust, now the door opens wide"
      ],
      nouns: ["录音棚", "兄弟", "小圈子", "面具", "合同", "演出费", "夜路", "产业"],
      verbs: ["扛住", "推翻", "识破", "忍受", "兑现", "熬过", "靠近", "离开"],
      images: ["几百块演出费也能对半分", "有人递建议，有人递一张面具", "深夜的棚里只剩伴奏懂我"],
      closers: ["我只信一路走来的名字，不信后来递来的酒", "把灯关上也看得见，谁还站在我身后"]
    },
    smallTownFlex: {
      label: "小镇上升",
      aliases: ["小镇", "山里", "家乡", "出头"],
      cadence: "Trap 炫耀",
      energy: 86,
      tone: "张扬",
      hooks: [
        "小地方抬头看，山路也能接到云端",
        "from back roads, now the whole room knows",
        "我把家乡话唱到更远的地方",
        "walked out far, still know where I'm from"
      ],
      nouns: ["小镇", "山路", "家乡话", "舞台", "金字塔", "口哨声", "高楼", "街口"],
      verbs: ["翻过", "抢回", "拉满", "登上", "抬头", "闯出", "踩稳", "点亮"],
      images: ["万丈高楼从一块旧地基长起", "他们说地图太小，我偏要走到边界", "山风吹过来，我把口音放进鼓点"],
      closers: ["我从小地方来，但我的梦不小声", "让他们记住，这条路是我自己走成"]
    },
    battleBoss: {
      label: "Battle Boss",
      aliases: ["diss", "boss", "对手", "rapper"],
      cadence: "攻击性 Punchline",
      energy: 94,
      tone: "锋利",
      hooks: [
        "我握着方向，别来替我打表",
        "我站在顶上，低头也看不到",
        "don't press me, I came with the smoke",
        "嘴巴闭好，轮到我开口"
      ],
      nouns: ["对手", "擂台", "榜单", "奖杯", "顶端", "段位", "规则", "火药味"],
      verbs: ["压住", "击穿", "终结", "撕开", "反击", "踩过", "清场", "点燃"],
      images: ["他们忙着站队，我把整条路站稳", "你的段位像信号，进电梯就消失", "我一句落下，像鼓点砸在桌面"],
      closers: ["我不是来讲和的，我是来把声音放大", "等他们反应过来，现场只剩我的尾音"]
    },
    familyLetter: {
      label: "写给家人",
      aliases: ["妈妈", "奶奶", "亏欠", "小时候"],
      cadence: "真情叙事",
      energy: 48,
      tone: "克制",
      hooks: [
        "写给家里人，我把真话放进伴奏",
        "时间慢点走，让我再牵一次你的手",
        "我不是不回头，是怕眼泪先开口",
        "I got this far, 但亏欠还在胸口"
      ],
      nouns: ["相片", "行李箱", "旧房间", "伞", "病痛", "童年", "压岁钱", "家门口"],
      verbs: ["亏欠", "保护", "想起", "放慢", "藏起", "拥抱", "弥补", "长大"],
      images: ["你把几百块塞进行李箱，我假装没看见", "旧房子的天花板，比城市的夜还难忘", "我把奖牌拿回来，想换你少一点担心"],
      closers: ["我终于走远了，却更想听见你喊我回家", "这首不是炫耀，是我迟到很久的一句话"]
    },
    anxiousFame: {
      label: "成名焦虑",
      aliases: ["焦虑", "失眠", "钱", "负罪感"],
      cadence: "暗色旋律",
      energy: 63,
      tone: "阴冷",
      hooks: [
        "我有时开心，但焦虑也跟到来",
        "cash rules everything, 可填不平空白",
        "半夜三点半，我还在问自己该不该",
        "I don't wanna lose me in the spotlight"
      ],
      nouns: ["失眠", "回忆", "负罪感", "账户", "镜子", "合同", "舆论", "夜景"],
      verbs: ["拖走", "填平", "搜索", "吞下", "扩充", "挣脱", "消失", "道歉"],
      images: ["车窗外的城市很亮，我心里却没开灯", "钱像止痛药，过了时间还是会疼", "我点开旧歌，像走进自己的避难所"],
      closers: ["他们说这叫成功，可我还没学会睡着", "我把掌声关小，才听见心里在吵"]
    },
    loveRide: {
      label: "浪漫兜风",
      aliases: ["恋爱", "晚霞", "city", "couple"],
      cadence: "Melodic Trap",
      energy: 66,
      tone: "暧昧",
      hooks: [
        "你去追你的风，我在路口等你",
        "晚霞落在你肩上，我把时间暂停",
        "shawty we fly, city lights below",
        "你明明在身边，why I miss you so"
      ],
      nouns: ["晚霞", "沙发", "房门", "巴黎", "城市灯", "相机", "香水", "总统套房"],
      verbs: ["等待", "靠近", "记录", "推开", "飞往", "错过", "拥抱", "点燃"],
      images: ["我按下快门，晚霞刚好从你发梢经过", "城市在窗外倒退，你在副驾挑歌", "你一个眼神，比舞台灯还亮"],
      closers: ["全城都在响，只有你的名字最清楚", "我把浪漫写狠一点，怕你听不出"]
    }
  };
  
  const RAPPER_PROFILES = {
    asen: {
      label: "Asen 艾志恒",
      description: "小镇叙事、中英混写、西南口语、情绪自省和攻击性 punchline 并存。",
      aliases: ["小镇", "出头", "家人", "兄弟", "焦虑", "boss", "hiphop", "Digi"],
      nouns: ["小镇", "山路", "家乡话", "录音棚", "兄弟", "妈妈", "舞台", "项链", "夜景", "合同", "回忆", "焦虑"],
      verbs: ["翻过", "走起", "拉满", "证明", "写进", "挣脱", "扛住", "熬过", "点燃", "保护"],
      hooks: [
        "小地方抬头看，山路也能接到云端",
        "我把家乡话唱到更远的地方",
        "写给家里人，我把真话放进伴奏",
        "我有时开心，但焦虑也跟到来"
      ],
      images: [
        "山风吹过来，我把口音放进鼓点",
        "车窗外的城市很亮，我心里却没开灯",
        "旧房子的天花板，比城市的夜还难忘",
        "深夜的棚里只剩伴奏懂我"
      ],
      albumStyles: {
        general: {
          label: "综合风格",
          aliases: [],
          nouns: [],
          verbs: [],
          hooks: [],
          images: [],
          learned: {
            nouns: [],
            verbs: [],
            hooks: [],
            images: [],
            fragments: []
          }
        },
        smallTownKid: {
          label: "Small Town Kid",
          cover: "./assets/covers/asen-small-town-kid.jpg",
          themeHint: "new wave、冰、清晨、年轻野心",
          aliases: ["Small Town Kid", "Lil Ace", "new wave", "冰", "moshpit", "领队"],
          nouns: ["冰水", "玻璃", "清晨六点", "new wave", "moshpit", "Broly", "Rambo", "火锅", "英美", "领队", "A$en", "Same page"],
          verbs: ["迷失", "flexin", "超过", "扯掉", "射穿", "领跑", "住口", "变冷", "清澈", "心碎"],
          hooks: [
            "又到清晨六点，我望着玻璃还是不睡",
            "脖子上挂的是冰，年轻的心还在往上飞",
            "new wave 不是讨论，是我站在前面带队",
            "Lil Ace 没得 manners，世界在我对面排队"
          ],
          images: [
            "清晨六点的玻璃像一面冷掉的镜子",
            "钻石挂在脖子上，像冰水顺着鼓点滴落",
            "昨晚现场像 moshpit，年轻的野心还没散场",
            "火锅店门口的风，把英文 adlib 吹进街上"
          ],
          learned: {
            nouns: [],
            verbs: [],
            hooks: [],
            images: [],
            fragments: []
          }
        },
        smallTownLegend: {
          label: "Small Town Legend",
          cover: "./assets/covers/asen-small-town-legend.jpg",
          themeHint: "传奇、兄弟、底层、Boss",
          aliases: ["Small Town Legend", "legend", "Day1", "boss", "bando", "后背"],
          nouns: ["Day1", "bando", "legend", "拳头", "兄弟后背", "六枚戒指", "Sofa", "中国 Hova", "蓝图", "丛林", "孤独", "钱的臭味"],
          verbs: ["握紧", "grindin", "卷走", "远离", "赌上", "面对", "跑到", "变立体", "踩死", "走到顶"],
          hooks: [
            "Still the same Ace，从开始我就没变过",
            "我要死也死成 legend，拳头握紧不退后",
            "兄弟永远在我背后，bando 走到顶楼",
            "Small Town Legend，钱的臭味让我更清醒"
          ],
          images: [
            "从沙发醒来的人，把蓝图一点点画成立体",
            "丛林里没有退路，我把孤独背在后背",
            "六枚戒指不只为我，也为最早那几个名字",
            "钱的臭味钻进空气，我反而更像自己"
          ],
          learned: {
            nouns: [],
            verbs: [],
            hooks: [],
            images: [],
            fragments: []
          }
        },
        nesa: {
          label: "NESA",
          cover: "./assets/covers/asen-nesa.jpg",
          themeHint: "Digi、rapstar、合同、说唱钱",
          aliases: ["NESA", "Digi", "rapstar", "sold out", "说唱钱", "换血"],
          nouns: ["Prada bag", "basement", "Goyard", "合同", "金牌", "Digi Gang", "sold out", "说唱钱", "Rolex", "蓝图", "土黑娃", "rapstar"],
          verbs: ["made it", "灌满", "签下", "卖完", "换血", "忙完", "赢下", "装钱", "抢饭碗", "登顶"],
          hooks: [
            "我们赚的钱叫说唱钱，合同摊在桌上面",
            "Digi Gang 走进来，蓝图开始有雏形",
            "从 basement 到 sold out，我把灰尘变成金",
            "NESA 不是标签，是我把游戏换血的声音"
          ],
          images: [
            "声卡和电脑没落灰，地下室的灯还亮着",
            "Goyard 装着钱，也装着从小地方来的胆子",
            "麦克风走进 Rolex，时间开始替我作证",
            "衣柜被奢侈品灌满，但底层口音还没改"
          ],
          learned: {
            nouns: [],
            verbs: [],
            hooks: [],
            images: [],
            fragments: []
          }
        },
        lifeAfterSmallTown: {
          label: "Life after small town",
          cover: "./assets/covers/asen-life-after-small-town.jpg",
          themeHint: "成名后、财富、权力、家人亏欠",
          aliases: ["Life after small town", "great", "顶峰", "G63", "家人", "胜利者"],
          nouns: ["顶峰", "G63", "凯雷德", "Rolex", "权力", "名声", "家人朋友", "止痛片", "胜利者微笑", "小镇之后", "巡演", "泳池"],
          verbs: ["起飞", "登顶", "挥霍", "亏欠", "证明", "飞远", "回望", "补偿", "变伟大", "承认"],
          hooks: [
            "All the pains, all the gains，我从小镇之后起飞",
            "我想要财富权力名声，也想把亏欠追回",
            "站到顶峰再回头，才发现家人离我很远",
            "Life after small town，胜利也会带着止痛片"
          ],
          images: [
            "胸口挂满冰，心却还像刚出发那年火热",
            "凯雷德开过夜色，后座坐着没说完的歉意",
            "顶峰的风很大，把家人的声音吹得很远",
            "泳池和豪车都有了，旧问题还在门口等我"
          ],
          learned: {
            nouns: [],
            verbs: [],
            hooks: [],
            images: [],
            fragments: []
          }
        },
        wakeAfterRain: {
          label: "在雨后醒来",
          cover: "./assets/covers/asen-wake-after-rain.jpg",
          themeHint: "爱、雨后、自省、小镇、家人",
          aliases: ["雨后醒来", "love", "wake up", "小镇娃儿", "光", "questions"],
          nouns: ["雨后", "光", "爱", "小镇娃儿", "彩色天空", "问题", "妈妈", "旧歌", "焦虑", "舞台闪光", "Day1", "窗外"],
          verbs: ["醒来", "看见", "追逐", "接纳", "原谅", "问自己", "放慢", "找到", "照亮", "走出"],
          hooks: [
            "我在雨后醒来，窗外的光终于落下来",
            "All my life I'm chasing love，代价我也明白",
            "小镇娃儿抬头看，雨停以后天会变彩色",
            "二十一个问题问完，我还是想做回自己"
          ],
          images: [
            "雨后的天空变彩色，像小时候的画突然变成 IMAX",
            "我睁开眼看见光，也看见自由后面的代价",
            "窗外雨停了，旧歌像避难所一样打开",
            "舞台闪光照到小镇，也照到没说出口的爱"
          ],
          learned: {
            nouns: [],
            verbs: [],
            hooks: [],
            images: [],
            fragments: []
          }
        }
      },
      learned: {
        nouns: [],
        verbs: [],
        hooks: [],
        images: [],
        fragments: []
      }
    },
    sasi: {
      label: "Sasi",
      description: "强烈 money drive、Mudbach/车标意象、痛苦焦虑、攻击性脏话、四川口语和玄学轮回感。",
      aliases: ["mudbach", "cash", "痛苦", "焦虑", "街上", "显化", "money", "gang"],
      nouns: ["Mudbach", "Maybach", "车标", "金钱", "账单", "泥泞", "出租房", "街上", "焦虑", "轮回", "中阴身", "项链", "账单", "manifest"],
      verbs: ["数钱", "显化", "翻篇", "冲出", "挣扎", "证明", "反攻", "走起", "堆叠", "冷却", "兑现"],
      hooks: [
        "cash money 让我晓得啥子叫坚强",
        "数钱数到手抽筋，痛苦还在旁边站到",
        "这是我的 mudbach，风雨挡不住我开到",
        "我不想再回到没得光的出租房"
      ],
      images: [
        "银色轮毂转动，把岁月磨成一段冷歌",
        "钱像液体流过身体，焦虑在旁边点火",
        "贴着玻璃摸雨，雷声平静但我恐惧",
        "死亡不是终点，梦像另一条没亮灯的街"
      ],
      albumStyles: {
        general: {
          label: "综合风格",
          aliases: [],
          nouns: [],
          verbs: [],
          hooks: [],
          images: [],
          learned: {
            nouns: [],
            verbs: [],
            hooks: [],
            images: [],
            fragments: []
          }
        },
        nasalik: {
          label: "纳萨力克",
          cover: "./assets/covers/sasi-nasalik.jpg",
          themeHint: "死亡、轮回、白光、神话",
          aliases: ["纳萨力克", "轮回", "中阴身", "死亡", "神话", "白光"],
          nouns: ["纳萨力克", "白光", "中阴身", "轮回", "月亮", "神话", "封印", "血刃", "枯井", "梦境", "亡者", "战士"],
          verbs: ["轮回", "捕捉", "封印", "避开", "扫荡", "匍匐", "重启", "转生", "破裂", "降临"],
          hooks: [
            "死亡不是终点，我在轮回里重启",
            "纳萨力克开门，白光照不进我的眼睛",
            "走到出口以前，先把前世的债清零",
            "所有秘密死后等我，我把神话写进鼓里"
          ],
          images: [
            "白光贴着月亮落下，像一张没写完的判决",
            "枯井连接天空，我在梦里听见机器失灵",
            "封印打开以前，烟和血刃都要保持安静",
            "柔软的心被催眠，醒来还记得上一世的雨"
          ],
          learned: {
            nouns: [],
            verbs: [],
            hooks: [],
            images: [],
            fragments: []
          }
        },
        thatBoy: {
          label: "那小子真帅",
          cover: "./assets/covers/sasi-that-boy.jpg",
          themeHint: "数钱、显化、改命、出租房",
          aliases: ["数钱", "显化", "countin", "money", "grrah", "Focus"],
          nouns: ["Countin", "手抽筋", "显化", "出租房", "点钞机", "现金", "地球游戏", "成功画面", "money trap", "焦虑伞"],
          verbs: ["数钱", "具象", "显化", "running", "聚焦", "堆叠", "改命", "冷却", "兑现", "转运"],
          hooks: [
            "Countin that's my money，数到手都抽筋",
            "先想再做，显化到现实重叠",
            "Focus on money，钱不会对我关机",
            "为钱生为钱活，我把命运往上拧"
          ],
          images: [
            "钱像液体灌进身体，每个部位都在发烫",
            "出租房里想象成功，墙皮都开始发光",
            "点钞机围到转圈，像给欲望做法",
            "焦虑像一把伞，撑不开家庭就会散"
          ],
          learned: {
            nouns: [],
            verbs: [],
            hooks: [],
            images: [],
            fragments: []
          }
        },
        superSun: {
          label: "超级孙先生",
          cover: "./assets/covers/sasi-super-sun.jpg",
          themeHint: "奢侈品、车型、拜金、老板",
          aliases: ["超级孙先生", "luxury", "拜金", "V12", "迪通拿", "boss"],
          nouns: ["迪通拿", "AP霜金", "白陶瓷", "玫瑰金", "古斯特", "V12", "蒙口", "Gucci bag", "满天星", "幻影", "品牌清单", "老板儿"],
          verbs: ["报菜名", "接管", "闪瞎", "消费", "查到", "甩出", "炫富", "照亮", "买下", "安排"],
          hooks: [
            "失败让我暴躁，钞票让我变俏",
            "冰蓝迪通拿，满天星在手上报到",
            "我想要的都是 luxury，旧日子别来打扰",
            "哎爸给我买个冠军，我唱完直接躺倒"
          ],
          images: [
            "黑云压城的时候，V12 像灯把路照亮",
            "品牌名一排排落下，像钞票在副歌里点将",
            "演播厅后面有套房，唱完把焦虑关上",
            "白陶瓷和玫瑰金，把失败者的脸都照亮"
          ],
          learned: {
            nouns: [],
            verbs: [],
            hooks: [],
            images: [],
            fragments: []
          }
        },
        chengDaoliang: {
          label: "成嶋亮",
          cover: "./assets/covers/sasi-cheng-daoliang.jpg",
          themeHint: "旧地址、家庭、兄弟、冷感",
          aliases: ["成嶋亮", "家庭", "旧地址", "五个老铁", "冷", "成长"],
          nouns: ["旧地址", "小旅馆", "家庭裂缝", "五个老铁", "面包店", "窗台雾", "吸血鬼", "重庆上海北京", "街头故事", "纹身机"],
          verbs: ["冷掉", "刺痛", "翻身", "带走", "吸附", "破裂", "怀念", "冲刷", "变好", "走远"],
          hooks: [
            "岁月带走气愤，财富替代了仇恨",
            "五个老铁像火炬，把冷掉的街重新点燃",
            "我想念旧地址，也想把未来攥紧",
            "温柔只在歌里出现，窗台起雾我还没睡醒"
          ],
          images: [
            "嘴巴吐出刀的时候，我站在原地看清亲情",
            "小旅馆最冷的夜，我像磁铁吸住一点温存",
            "每句歌词像纹身机，把嫉妒刺进皮肤",
            "面包店里的笑很单纯，后来被现实慢慢磨钝"
          ],
          learned: {
            nouns: [],
            verbs: [],
            hooks: [],
            images: [],
            fragments: []
          }
        }
      },
      learned: {
        nouns: [],
        verbs: [],
        hooks: [],
        images: [],
        fragments: []
      }
    }
  };
  
  const MOOD_BANK = {
    confident: {
      label: "自信",
      openers: ["今晚我把计划摊开", "我把名字刻在鼓点上", "他们抬头的时候我已经出发"],
      pivots: ["没空解释，我直接把成绩摆出来", "风声太吵，我只听见心跳在催"],
      adlibs: ["god damn", "for real", "let's go"]
    },
    heavy: {
      label: "沉重",
      openers: ["凌晨的墙比白天更安静", "我把旧事翻开又合上", "有些话卡在喉咙很久"],
      pivots: ["可我还得走，哪怕每一步都硌脚", "我不想装没事，伤口还在发热"],
      adlibs: ["I know", "too much", "I'm sorry"]
    },
    warm: {
      label: "温柔",
      openers: ["今天风没那么急", "我终于能慢慢说", "把灯留着，我还想写完这句"],
      pivots: ["如果爱来得慢，我先学会等", "世界很硬，但我不想再硬撑"],
      adlibs: ["alright", "breathe", "love"]
    },
    cold: {
      label: "冷静",
      openers: ["我把情绪调成静音", "账单和计划都摆在桌面", "所有热闹都离我很远"],
      pivots: ["越安静，越能看清谁在表演", "我不多说，答案会自己出现"],
      adlibs: ["no cap", "too cold", "watch"]
    },
    chaotic: {
      label: "爆发",
      openers: ["鼓一响我就不想收了", "今晚别问我能不能冷静", "这口气憋太久该放出来"],
      pivots: ["他们要烟，那我把整条街点亮", "声音拉满，谁也别想让我停"],
      adlibs: ["go crazy", "turn up", "boom"]
    }
  };
  
  const COMMON = {
    scene: ["成都夜里", "上海雨后", "小镇街口", "后台走廊", "凌晨机场", "录音棚", "车窗外", "旧房间"],
    rhyme: ["骄傲", "煎熬", "记号", "轨道", "心跳", "口号", "解药", "喧闹", "燃烧", "祷告"],
    english: ["took the long road", "never switch my side", "still on my grind", "I need some peace", "money on my mind", "look into my eyes", "we outside", "built it from the dust"],
    explicitLight: ["烦得很", "别来管我", "少点废话", "嘴巴闭好"],
    explicitStrong: ["老子不退", "fuck that noise", "别来试我底线", "shit got real", "别他妈挡路", "老子今天不讲礼貌"],
    dialect: ["懂不起", "耍得凶", "莫法", "瓜起", "要得", "摆哈", "阔以", "拢了"],
    bridge: ["但是", "所以", "直到", "后来", "可惜", "反正", "如果", "现在"]
  };

  const STORY_ARCS = [
    {
      label: "低处出发到反击站稳",
      beats: ["出发", "压力", "反击", "站稳"],
      promise: "先交代处境，再把阻力推成反击，最后落到站稳"
    },
    {
      label: "自我怀疑到重新选择",
      beats: ["失衡", "追问", "看清", "重选"],
      promise: "先写情绪失衡，中段追问原因，结尾给出选择"
    },
    {
      label: "关系拉扯到边界清楚",
      beats: ["靠近", "拉扯", "摊牌", "转身"],
      promise: "从关系现场开始，写清矛盾，再完成态度转向"
    },
    {
      label: "野心铺开到代价落地",
      beats: ["野心", "加速", "代价", "落地"],
      promise: "先把目标抬高，再补上代价，让炫耀有重量"
    },
    {
      label: "夜里复盘到天亮收束",
      beats: ["夜里", "回放", "承认", "天亮"],
      promise: "用夜晚做场景，中段复盘，最后用天亮收住"
    }
  ];

  const LINE_BLUEPRINTS = [
    {
      key: "scene_theme_rhyme",
      render: ({ scene, theme, rhyme, english }) => `${scene}我把${theme}写成${rhyme}${english}`
    },
    {
      key: "noun_verb_cost",
      render: ({ connector, noun, verb, adlib }) => `${connector}${noun}还在${verb}，我不想再被谁消耗${adlib}`
    },
    {
      key: "opener_pressure",
      render: ({ opener, theme, beat }) => `${opener}，${theme}把${beat}压成新的记号`
    },
    {
      key: "image_dialect",
      render: ({ image, dialect }) => `${image}${dialect ? `，${dialect}` : ""}`
    },
    {
      key: "pivot_answer",
      render: ({ pivot, swear, noun }) => `${pivot}，${swear || `${noun}替我回答`}`
    },
    {
      key: "scene_trade",
      render: ({ scene, noun, rhyme, english }) => `我从${scene}走出来，把${noun}换成${rhyme}${english}`
    },
    {
      key: "not_slogan",
      render: ({ theme, beat }) => `${theme}不是口号，是我在${beat}里没睡着的理由`
    },
    {
      key: "verb_crowd",
      render: ({ verb, noun, rhyme }) => `${verb}${noun}的时候，我听见全场一起喊${rhyme}`
    },
    {
      key: "camera_cut",
      render: ({ scene, theme, noun }) => `镜头切到${scene}，${theme}和${noun}都没来得及躲`
    },
    {
      key: "question_answer",
      render: ({ theme, connector, verb }) => `他们问${theme}值不值，${connector}我只用${verb}回答`
    },
    {
      key: "memory_invoice",
      render: ({ noun, theme, rhyme }) => `${noun}像一张旧发票，提醒我${theme}买过${rhyme}`
    },
    {
      key: "turning_point",
      render: ({ connector, beat, theme, english }) => `${connector}${beat}不是结尾，是${theme}换挡的声音${english}`
    },
    {
      key: "room_detail",
      render: ({ scene, noun, verb }) => `${scene}只剩${noun}还亮着，陪我把话${verb}`
    },
    {
      key: "lineage",
      render: ({ theme, alias, rhyme }) => `${theme}从来不是凭空来的，${alias}把它磨成${rhyme}`
    },
    {
      key: "future_receipt",
      render: ({ connector, theme, noun }) => `${connector}把${theme}留到明天验收，今晚先把${noun}扛走`
    },
    {
      key: "split_screen",
      render: ({ scene, theme, beat }) => `${scene}一半是${theme}，一半是我还没说完的${beat}`
    },
    {
      key: "edge_control",
      render: ({ pivot, theme, rhyme }) => `${pivot}，我把${theme}从边缘拉回${rhyme}`
    },
    {
      key: "heartbeat",
      render: ({ noun, verb, english }) => `${noun}跟着心跳在${verb}，我没停下${english}`
    }
  ];

  const NARRATIVE_ARCS = [
    {
      label: "压力摊开到重新选择",
      promise: "先说明压力从哪里来，再写清楚为什么必须做选择，最后给出落点",
      pressure: ["账单和计划一起压过来", "机会来得太快，心里反而更乱", "旧问题没有消失，只是换了个名字"],
      stake: ["家里人的期待", "身边人的信任", "自己说过的话"],
      cost: ["每一次决定", "每个没睡着的晚上", "那些没说出口的亏欠"],
      turn: ["我先把情绪放低一点", "我开始重新看清顺序", "我不再急着证明给别人看"],
      ending: ["把答案慢慢走出来", "把这件事交代清楚", "让下一步走得更稳"]
    },
    {
      label: "夜里复盘到天亮继续",
      promise: "用一个夜晚做线索，从复盘、承认到天亮继续走",
      pressure: ["夜里安静得只剩心跳", "旧事一遍遍倒回去", "手机亮着，但没人能替我回答"],
      stake: ["明天还要面对的生活", "没完成的承诺", "那个不想再逃的自己"],
      cost: ["反复失眠的时间", "嘴硬之后的沉默", "被拖长的回忆"],
      turn: ["我终于承认这不是小事", "我把话重新捋了一遍", "我决定先把原因讲明白"],
      ending: ["等天亮以后继续走", "把昨晚留在歌里", "不再让同一个问题绕回原点"]
    },
    {
      label: "关系拉扯到边界清楚",
      promise: "先写关系里的拉扯，再把矛盾说清，最后确定边界",
      pressure: ["有些关系越靠近越难讲", "话说一半就会变成误会", "谁都想赢，结果都在受伤"],
      stake: ["还没断掉的信任", "一起走过的时间", "彼此最后的体面"],
      cost: ["每次冷处理", "每句没解释的话", "反复试探的耐心"],
      turn: ["我不想再用沉默解决问题", "我把边界说清楚", "我终于分清舍不得和应该走"],
      ending: ["该留下的会留下", "该转身的就转身", "把关系还给真实的样子"]
    },
    {
      label: "野心落地到代价算清",
      promise: "先写目标，再补上代价，让野心不是空喊",
      pressure: ["想往上走就不能只靠热血", "目标越亮，背后的影子越长", "每个人都想看结果，很少有人看过程"],
      stake: ["名字后面的重量", "一路积下来的信用", "当初离开原地的理由"],
      cost: ["被牺牲的休息", "反复计算的选择", "那些没人看见的低谷"],
      turn: ["我开始把野心写得具体一点", "我不再把冲动当成勇敢", "我先把代价算清楚"],
      ending: ["赢也要赢得明白", "把话落在真实的地方", "让结果对得起过程"]
    }
  ];

  const READABLE_ENDINGS = ["算数", "讲清楚", "不回头", "慢慢走", "有结果", "能承受", "会看见", "往前走"];

  const TOPIC_PACKS = {
    contract: {
      match: /合同|签约|条款|公司|机会|事业|项目/,
      setup: [
        "{scene}的灯照在{theme}上，我把每一页都看慢",
        "他们说机会难得，可我听见心里还有一点不安",
        "我想往前签，也怕把自己交给看不见的条款",
        "家里还等着好消息，所以我不能只凭冲动点头"
      ],
      conflict: [
        "数字看起来漂亮，责任却一条一条压下来",
        "签了就要承担，没签又怕错过这班车",
        "我不是怕吃亏，我怕以后连后悔都没资格",
        "桌上的笔很轻，落下去却像一块石头"
      ],
      turn: [
        "我把最诱人的话划掉，先看清自己要什么",
        "后来我懂了，真正的底气不是急着答应",
        "该问的我一条条问，该留的退路也要留",
        "如果这一步会改变以后，我就不能装作没看见"
      ],
      resolve: [
        "最后我把名字写得很慢，让每个字都对得起自己",
        "要走可以走，但我得知道这条路通向哪里",
        "这不是胆小，是把明天提前算进今天",
        "签不签都不是结局，清醒才是我真正的选择"
      ]
    },
    money: {
      match: /现金|钱|money|账单|数钱|改命|出租房|成功|财富/,
      setup: [
        "{scene}的灯还亮着，账单摊开在桌面上",
        "我以前以为{theme}只是数字，后来发现它也像重量",
        "家里的电话打过来，我听见沉默比催促还响",
        "我想把日子往上拉，所以不敢只靠一句漂亮话"
      ],
      conflict: [
        "想赚钱没有错，错的是把自己也算成筹码",
        "我跑得越快，越怕把重要的人落在身后",
        "有些选择看起来体面，背后全是没睡好的夜",
        "我不是贪心，我只是太清楚没钱时的难堪"
      ],
      turn: [
        "后来我把欲望放低一点，先问自己要去哪里",
        "我开始把每一步算清，不再拿冲动当答案",
        "该挣的我要挣，但不能让它牵着我走",
        "我把焦虑写进鼓里，至少让它有个出口"
      ],
      resolve: [
        "等我真的站稳，第一件事是让家里安心",
        "如果{theme}要有意义，就不能只拿来炫耀",
        "我会继续往前，但不再把自己丢在路上",
        "这条路还长，我先把今天走得踏实"
      ]
    },
    rain: {
      match: /雨后|雨|失眠|夜|焦虑|回忆|自省|醒来|天亮/,
      setup: [
        "{scene}的雨刚停，我坐在窗边把昨晚想完",
        "{theme}像一口慢下来的气，让我终于听见自己",
        "手机亮了又暗，我还是没找到想说的话",
        "有些事白天能装过去，到了夜里就会回来"
      ],
      conflict: [
        "我不是突然难过，是好多问题一直没散",
        "越想证明没事，心里越像没关紧的门",
        "那些没讲完的亏欠，反复在我耳边打转",
        "我怕自己走太远，又忘了最开始为什么出发"
      ],
      turn: [
        "后来我不再跟情绪硬碰，先让它慢慢落地",
        "我承认有些痛还在，但它不该替我做决定",
        "我把话写得轻一点，留一点位置给明天",
        "如果雨会停，我也可以重新开始呼吸"
      ],
      resolve: [
        "天亮以后我还要走，只是这次不再逃",
        "{theme}留下来的不是答案，是我愿意面对自己",
        "我把昨晚收进歌里，让它别再堵在胸口",
        "下一次醒来，我想先原谅那个撑住的我"
      ]
    },
    relationship: {
      match: /兄弟|朋友|关系|爱情|信任|背叛|边界|家人|妈妈|亏欠/,
      setup: [
        "{scene}的灯照着两个人，话到嘴边又停住",
        "我以为{theme}能靠沉默撑住，后来发现沉默最伤人",
        "一起走过的路还在，可有些距离已经变长",
        "我不是不在乎，只是不知道怎么把话说软"
      ],
      conflict: [
        "谁都不想先低头，结果误会越堆越高",
        "我把脾气当盔甲，却忘了对面也是会疼的人",
        "有些伤不是一句算了就能过去",
        "越想证明自己没错，越把关系推得更远"
      ],
      turn: [
        "后来我把话放慢，先承认自己也有问题",
        "该道歉的别绕，该离开的也别拖",
        "我终于分清舍不得和真的适合",
        "如果还要继续，就不能靠猜来维持"
      ],
      resolve: [
        "留下的人我会珍惜，走散的也不再强求",
        "{theme}不是绑住谁，是让彼此都活得明白",
        "我把边界说清楚，也把祝福留在原地",
        "这次不争输赢，只求以后想起时不亏欠"
      ]
    }
  };

  const RHYME_BANK = {
    ai: {
      label: "ai / eye",
      cn: ["舞台", "未来", "醒来", "离开", "重来", "摊开", "安排", "对白"],
      en: ["sky", "fly", "high", "my side", "outside", "tonight", "alright", "spotlight"],
      phrases: ["站上舞台", "走向未来", "fly to the sky", "we outside", "hold my side"]
    },
    an: {
      label: "an",
      cn: ["答案", "遗憾", "夜晚", "转弯", "上岸", "慢慢", "反叛", "灿烂"],
      en: ["plan", "again", "stand", "man", "land", "understand", "can't", "champagne"],
      phrases: ["找到答案", "熬过夜晚", "stick to the plan", "stand like a man", "try again"]
    },
    ang: {
      label: "ang",
      cn: ["滚烫", "方向", "声浪", "发光", "反抗", "欲望", "远方", "主场"],
      en: ["young", "strong", "belong", "song", "wrong", "long", "King Kong", "all night long"],
      phrases: ["冲向远方", "站稳主场", "stay strong", "write my song", "all night long"]
    },
    ao: {
      label: "ao / ow",
      cn: ["骄傲", "煎熬", "记号", "轨道", "解药", "燃烧", "喧闹", "祷告"],
      en: ["now", "wow", "down", "crown", "town", "sound", "around", "breakdown"],
      phrases: ["留下记号", "不怕煎熬", "take the crown", "run this town", "right now"]
    },
    e: {
      label: "e / uh",
      cn: ["选择", "颜色", "隔阂", "规则", "资格", "配合", "不舍", "沉默"],
      en: ["never", "forever", "pressure", "better", "weather", "together", "whatever", "treasure"],
      phrases: ["打破规则", "换种颜色", "under pressure", "do it better", "stay forever"]
    },
    en: {
      label: "en",
      cn: ["认真", "伤痕", "沉沦", "清晨", "灵魂", "开门", "根本", "分寸"],
      en: ["again", "friend", "end", "then", "pen", "ten", "when", "amen"],
      phrases: ["写到清晨", "靠近灵魂", "back again", "my friend", "not the end"]
    },
    eng: {
      label: "eng",
      cn: ["人生", "灯", "风声", "上升", "陌生", "掌声", "冷", "证明"],
      en: ["thing", "king", "ring", "bring", "sing", "spring", "bling", "everything"],
      phrases: ["听见风声", "一路上升", "do my thing", "feel like king", "sing everything"]
    },
    i: {
      label: "i / ee",
      cn: ["自己", "距离", "胜利", "秘密", "记忆", "锋利", "呼吸", "目的"],
      en: ["me", "free", "see", "key", "dream", "believe", "team", "energy"],
      phrases: ["找回自己", "拿下胜利", "set me free", "hold the key", "chase my dream"]
    },
    in: {
      label: "in / win",
      cn: ["现金", "靠近", "清醒", "回应", "命运", "上瘾", "原因", "脚印"],
      en: ["win", "spin", "within", "begin", "skin", "sin", "twin", "discipline"],
      phrases: ["握紧现金", "保持清醒", "born to win", "start again", "from within"]
    },
    ing: {
      label: "ing",
      cn: ["黎明", "宿命", "安静", "回应", "清醒", "倒影", "暂停", "证明"],
      en: ["king", "ring", "sing", "thing", "bling", "spring", "wing", "everything"],
      phrases: ["等到黎明", "保持清醒", "wear the ring", "spread my wing", "own everything"]
    },
    ong: {
      label: "ong / long",
      cn: ["合同", "长空", "疼痛", "做梦", "冲动", "失控", "红", "钟"],
      en: ["long", "song", "strong", "wrong", "belong", "King Kong", "all along", "move on"],
      phrases: ["签下合同", "望向长空", "all night long", "write my song", "stay strong"]
    },
    ou: {
      label: "ou / flow",
      cn: ["以后", "街口", "对手", "自由", "回头", "节奏", "理由", "宇宙"],
      en: ["flow", "show", "go", "know", "road", "soul", "control", "below"],
      phrases: ["不再回头", "找到自由", "let it flow", "on the road", "take control"]
    },
    u: {
      label: "u / ooh",
      cn: ["孤独", "态度", "退路", "雾", "礼物", "守护", "领悟", "脚步"],
      en: ["too", "true", "blue", "crew", "new", "through", "move", "prove"],
      phrases: ["没有退路", "保持态度", "stay true", "new move", "prove it through"]
    },
    ye: {
      label: "ie / yeah",
      cn: ["黑夜", "街", "改写", "热烈", "分别", "破裂", "边界", "世界"],
      en: ["yeah", "air", "rare", "share", "there", "nightmare", "elsewhere", "prepare"],
      phrases: ["穿过黑夜", "改写世界", "right there", "prepare", "out of nightmare"]
    }
  };

  const CN_FINALS = {
    爱: "ai", 在: "ai", 台: "ai", 来: "ai", 开: "ai", 白: "ai", 败: "ai", 买: "ai", 拍: "ai", 海: "ai",
    安: "an", 答: "an", 晚: "an", 慢: "an", 难: "an", 反: "an", 灿: "an", 岸: "an", 弯: "an",
    光: "ang", 方: "ang", 浪: "ang", 烫: "ang", 场: "ang", 抗: "ang", 望: "ang", 想: "ang", 强: "ang",
    傲: "ao", 熬: "ao", 号: "ao", 道: "ao", 药: "ao", 烧: "ao", 闹: "ao", 告: "ao", 小: "ao", 笑: "ao",
    了: "e", 和: "e", 歌: "e", 色: "e", 则: "e", 格: "e", 舍: "e", 默: "e", 车: "e",
    人: "en", 真: "en", 痕: "en", 晨: "en", 魂: "en", 门: "en", 本: "en", 寸: "en", 沦: "en",
    生: "eng", 灯: "eng", 风: "eng", 升: "eng", 声: "eng", 冷: "eng", 明: "eng", 证: "eng", 梦: "ong",
    己: "i", 离: "i", 利: "i", 密: "i", 忆: "i", 气: "i", 的: "i", 你: "i", 起: "i",
    金: "in", 近: "in", 醒: "ing", 因: "in", 印: "in", 命: "ing", 心: "in", 信: "in", 银: "in",
    星: "ing", 听: "ing", 静: "ing", 影: "ing", 停: "ing", 冰: "ing", 名: "ing", 清: "ing",
    同: "ong", 空: "ong", 痛: "ong", 动: "ong", 控: "ong", 红: "ong", 钟: "ong", 中: "ong", 穷: "ong",
    后: "ou", 口: "ou", 手: "ou", 由: "ou", 头: "ou", 奏: "ou", 走: "ou", 宙: "ou", 楼: "ou", 酒: "ou",
    独: "u", 度: "u", 路: "u", 雾: "u", 物: "u", 护: "u", 悟: "u", 步: "u", 酷: "u",
    夜: "ye", 街: "ye", 写: "ye", 烈: "ye", 别: "ye", 裂: "ye", 界: "ye"
  };

  const STORAGE_KEY = "rapLyricLab.rapperProfiles.v1";
  const emptyBank = () => ({ nouns: [], verbs: [], hooks: [], images: [], keywords: [], fragments: [] });
  const generationMemory = {
    fingerprints: new Set(),
    maxSize: 180
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function cloneProfiles() {
    return clone(RAPPER_PROFILES);
  }

  function mergeSavedProfiles(saved) {
    if (!saved || typeof saved !== "object") return cloneProfiles();
    const builtIns = cloneProfiles();
    const merged = { ...saved, ...builtIns };
    for (const [key, savedProfile] of Object.entries(saved)) {
      if (builtIns[key]) {
        merged[key].learned = savedProfile.learned || emptyBank();
        const builtInAlbums = builtIns[key].albumStyles || {};
        const savedAlbums = savedProfile.albumStyles || {};
        merged[key].albumStyles = { ...savedAlbums, ...builtInAlbums };
        for (const [albumKey, savedAlbum] of Object.entries(savedAlbums)) {
          if (builtInAlbums[albumKey]) {
            merged[key].albumStyles[albumKey].learned = savedAlbum.learned || emptyBank();
            merged[key].albumStyles[albumKey].keywords = savedAlbum.keywords || builtInAlbums[albumKey].keywords || [];
          }
        }
      }
    }
    return merged;
  }

  function sample(list) {
    if (!list || !list.length) return "";
    return list[Math.floor(Math.random() * list.length)];
  }

  function chance(percent) {
    return Math.random() * 100 < percent;
  }

  function normalizeThemes(value) {
    return String(value || "")
      .split(/[、,，/\\s]+/)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 6);
  }

  function normalizeKeywords(value) {
    return normalizeThemes(value).slice(0, 5);
  }

  function detectRhymeKey(value) {
    const raw = String(value || "").trim();
    if (!raw) return "ao";
    const compact = raw.replace(/\s+/g, "");
    const lastCn = compact.match(/[\u4e00-\u9fff](?!.*[\u4e00-\u9fff])/u)?.[0];
    if (lastCn && CN_FINALS[lastCn]) return CN_FINALS[lastCn];

    const lower = raw.toLowerCase().replace(/[^a-z]/g, "");
    if (!lower) return "ao";
    if (/(ight|ide|ife|ive|y|ai)$/.test(lower)) return "ai";
    if (/(ang|ung)$/.test(lower)) return "ang";
    if (/(own|ound|ow)$/.test(lower)) return "ao";
    if (/(ong|ongue)$/.test(lower)) return "ong";
    if (/(ing|ink)$/.test(lower)) return "ing";
    if (/(in|im|ine)$/.test(lower)) return "in";
    if (/(en|end|ent)$/.test(lower)) return "en";
    if (/(an|and|ant)$/.test(lower)) return "an";
    if (/(oo|ue|u|ew|ove)$/.test(lower)) return "u";
    if (/(ow|o|oa|oe)$/.test(lower)) return "ou";
    if (/(air|are|ear|ere)$/.test(lower)) return "ye";
    if (/(ee|ea|e|ey)$/.test(lower)) return "i";
    return "ao";
  }

  function uniqueWithoutInput(list, input) {
    const normalizedInput = String(input || "").trim().toLowerCase();
    return [...new Set(list)].filter((item) => item.toLowerCase() !== normalizedInput);
  }

  function generateRhymes(value) {
    const input = String(value || "").trim();
    const finalKey = detectRhymeKey(input);
    const bank = RHYME_BANK[finalKey] || RHYME_BANK.ao;
    return {
      input,
      finalKey,
      label: bank.label,
      cn: uniqueWithoutInput(bank.cn, input),
      en: uniqueWithoutInput(bank.en, input),
      phrases: uniqueWithoutInput(bank.phrases, input)
    };
  }

  function pickTheme(themes) {
    return themes.length ? sample(themes) : sample(["小镇", "野心", "家人"]);
  }

  function ensureAlbumStyles(rapper) {
    if (!rapper.albumStyles) {
      rapper.albumStyles = {
        general: {
          label: "综合风格",
          aliases: [],
          nouns: [],
          verbs: [],
          hooks: [],
          images: [],
          learned: emptyBank()
        }
      };
    }
    if (!rapper.albumStyles.general) {
      rapper.albumStyles.general = {
        label: "综合风格",
        aliases: [],
        nouns: [],
        verbs: [],
        hooks: [],
        images: [],
        learned: emptyBank()
      };
    }
    return rapper.albumStyles;
  }

  function mergedProfile({ profiles, styleKey, rapperKey, albumKey }) {
    const profile = styleKey === "auto" || !STYLE_PROFILES[styleKey] ? autoStyleProfile() : STYLE_PROFILES[styleKey];
    const allProfiles = profiles || cloneProfiles();
    const rapper = allProfiles[rapperKey] || allProfiles.asen;
    const albums = ensureAlbumStyles(rapper);
    const album = albums[albumKey] || albums.general;
    const learned = album.learned || emptyBank();
    return {
      ...profile,
      rapperLabel: rapper.label,
      albumLabel: album.label,
      rapperDescription: rapper.description,
      aliases: [...profile.aliases, ...rapper.aliases, ...(album.aliases || [])],
      nouns: [...profile.nouns, ...rapper.nouns, ...(album.nouns || []), ...(learned.nouns || [])],
      verbs: [...profile.verbs, ...rapper.verbs, ...(album.verbs || []), ...(learned.verbs || [])],
      hooks: [...profile.hooks, ...rapper.hooks, ...(album.hooks || []), ...(learned.hooks || [])],
      images: [...profile.images, ...rapper.images, ...(album.images || []), ...(learned.images || [])],
      keywords: [...(rapper.keywords || []), ...(album.keywords || []), ...(learned.keywords || [])],
      learnedHooks: learned.hooks || [],
      learnedImages: learned.images || [],
      learnedFragments: learned.fragments || []
    };
  }

  function autoStyleProfile() {
    const styles = Object.values(STYLE_PROFILES);
    return {
      label: "自动融合",
      aliases: styles.flatMap((style) => style.aliases),
      cadence: "专辑驱动",
      energy: 76,
      tone: "综合",
      hooks: styles.flatMap((style) => style.hooks),
      nouns: styles.flatMap((style) => style.nouns),
      verbs: styles.flatMap((style) => style.verbs),
      images: styles.flatMap((style) => style.images),
      closers: styles.flatMap((style) => style.closers)
    };
  }

  function explicitPhrase(level) {
    if (level <= 0) return "";
    if (level <= 2) return sample(COMMON.explicitLight);
    return sample([...COMMON.explicitLight, ...COMMON.explicitStrong]);
  }

  function maybeEnglish(mixLevel) {
    const rate = mixLevel === "high" ? 34 : mixLevel === "low" ? 4 : 12;
    return chance(rate) ? ` ${sample(COMMON.english)}` : "";
  }

  function shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function compactLine(line) {
    return String(line || "")
      .toLowerCase()
      .replace(/\[[^\]]+\]/g, "")
      .replace(/[^\w\u4e00-\u9fff]+/g, "")
      .trim();
  }

  function lyricOnlyLines(lines) {
    return lines
      .map((line) => String(line || "").trim())
      .filter(Boolean)
      .filter((line) => !/^\[.*\]$/.test(line));
  }

  function lineIncludesAny(line, tokens) {
    const lower = String(line || "").toLowerCase();
    return tokens.some((token) => token && lower.includes(String(token).toLowerCase()));
  }

  function chooseNarrativeArc(options) {
    const joined = [options.focusKeyword, ...(options.themes || [])].join(" ").toLowerCase();
    const findByLabel = (text) => NARRATIVE_ARCS.find((arc) => arc.label.includes(text));
    if (/合同|现金|钱|money|账单|野心|事业|成功|改命|机会/.test(joined)) {
      return chance(62) ? findByLabel("代价") : findByLabel("选择");
    }
    if (/雨后|失眠|夜|焦虑|回忆|自省|家人|亏欠/.test(joined)) {
      return chance(62) ? findByLabel("夜里") : findByLabel("选择");
    }
    if (/兄弟|关系|背叛|爱情|朋友|信任|边界/.test(joined)) {
      return chance(62) ? findByLabel("关系") : findByLabel("选择");
    }
    return sample(NARRATIVE_ARCS);
  }

  function chooseTopicPack(options, contextTheme = "") {
    const joined = [contextTheme, options.focusKeyword, ...(options.themes || [])].join(" ");
    return Object.values(TOPIC_PACKS).find((pack) => pack.match.test(joined)) || TOPIC_PACKS.relationship;
  }

  function renderTopicTemplate(template, context) {
    return String(template || "")
      .replace(/\{scene\}/g, context.scene)
      .replace(/\{theme\}/g, context.theme);
  }

  function createDraftContext(options, safeLineCount) {
    const arc = chooseNarrativeArc(options);
    const theme = options.focusKeyword || pickTheme(options.themes || []);
    const scene = sample(COMMON.scene);
    const flavorWords = shuffle([...(options.profile?.aliases || []), ...(options.profile?.nouns || [])])
      .filter((word) => word && String(word).length <= 12)
      .slice(0, 2);
    const keywordSlots = new Set();
    if (options.focusKeyword) {
      keywordSlots.add(0);
      keywordSlots.add(Math.max(2, Math.floor(safeLineCount * 0.48)));
      keywordSlots.add(safeLineCount - 1);
    }
    return {
      arc,
      theme,
      topicPack: chooseTopicPack(options, theme),
      refs: [theme, "这件事", "这个选择", "这个问题", "它"],
      scene,
      pressure: sample(arc.pressure),
      stake: sample(arc.stake),
      cost: sample(arc.cost),
      turn: sample(arc.turn),
      ending: sample(arc.ending),
      flavorWords,
      keywordSlots,
      blueprints: shuffle(LINE_BLUEPRINTS),
      usedBlueprints: [],
      usedLines: new Set(),
      stageCounts: { setup: 0, conflict: 0, turn: 0, resolve: 0 },
      nonce: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
    };
  }

  function maybeFlavor(context) {
    return context.flavorWords.length && chance(16) ? `，${sample(context.flavorWords)}` : "";
  }

  function readableTail(options) {
    if (options.mix === "high" && chance(34)) return ` ${sample(COMMON.english)}`;
    return chance(42) ? `，${sample(READABLE_ENDINGS)}` : "";
  }

  function keywordLine(keyword, profile, mood, options, index, context) {
    const tail = readableTail(options);
    const templates = [
      `说到${keyword}，我想到的不是口号，是那天没说完的决定${tail}`,
      `${keyword}不是装饰，它把前面的压力都连到一起`,
      `${keyword}摆在面前的时候，我才知道逃不开这个问题`,
      `我绕了一圈还是回到${keyword}，因为答案藏在这里`,
      `${keyword}让我慢下来，先把该想清楚的想清楚`
    ];
    return sample(templates);
  }

  function topicRef(index, context, options) {
    if (options.focusKeyword && context.keywordSlots.has(index)) return options.focusKeyword;
    if (index <= 1 || chance(18)) return context.theme;
    return sample(context.refs.slice(1));
  }

  function narrativeStage(index, safeLineCount) {
    const ratio = index / Math.max(1, safeLineCount - 1);
    if (ratio < 0.28) return "setup";
    if (ratio < 0.55) return "conflict";
    if (ratio < 0.78) return "turn";
    return "resolve";
  }

  function buildNarrativeLine(profile, mood, themes, options, index, context) {
    if (options.focusKeyword && context.keywordSlots.has(index)) {
      return keywordLine(options.focusKeyword, profile, mood, options, index, context);
    }
    const stage = narrativeStage(index, options.safeLineCount);
    const fallbackRef = topicRef(index, context, options);
    const fallbackFlavor = maybeFlavor(context);
    const fallback = {
      setup: [
        `${context.scene}的灯还亮着，我还在想${fallbackRef}到底值不值`,
        `${context.pressure}，所以我没有急着把话说满`
      ],
      conflict: [
        `${context.cost}让我明白，硬撑不等于真的能赢`,
        `我不是不想解释，是怕一开口又把问题绕回原地`
      ],
      turn: [
        `${context.turn}，先把最乱的那部分放到桌面上`,
        `这一次我不靠声音盖过去，我把原因一层一层摆清${fallbackFlavor}`
      ],
      resolve: [
        `${context.ending}，这比一句漂亮的狠话更重要`,
        `如果明天还要继续，我至少知道自己为什么出发`
      ]
    };
    const linesByStage = {
      setup: [...context.topicPack.setup.map((line) => renderTopicTemplate(line, context)), ...fallback.setup],
      conflict: [...context.topicPack.conflict.map((line) => renderTopicTemplate(line, context)), ...fallback.conflict],
      turn: [...context.topicPack.turn.map((line) => renderTopicTemplate(line, context)), ...fallback.turn],
      resolve: [...context.topicPack.resolve.map((line) => renderTopicTemplate(line, context)), ...fallback.resolve]
    };
    const stageIndex = context.stageCounts[stage] || 0;
    context.stageCounts[stage] = stageIndex + 1;
    let line = linesByStage[stage][stageIndex % linesByStage[stage].length];
    for (let attempts = 0; context.usedLines.has(compactLine(line)) && attempts < 6; attempts += 1) {
      line = sample(linesByStage[stage]);
    }
    line = line.replace(/\s+，/g, "，").replace(/，$/g, "").trim();
    context.usedLines.add(compactLine(line));
    context.usedBlueprints.push(stage);
    return line;
  }

  function buildHook(profile, hookRepeats, mix, focusKeyword = "", context) {
    if (hookRepeats === 0) return [];
    const theme = focusKeyword || context?.theme || "这件事";
    const hook = sample([
      `${theme}绕回来，我把答案讲清楚`,
      `不是每一步都稳，但我知道为什么走`,
      `把问题放在鼓里，我不再往后退`
    ]);
    const response = chance(mix === "high" ? 22 : 5)
      ? sample(COMMON.english)
      : sample([
        `${context?.ending || "下一步"}，让我继续往前走`,
        `${theme}还在，但我不再被它拖住`,
        `这一段不是结论，是我重新开始的路`
      ]);
    const variations = [
      hook,
      `${theme}还在心里，我把顺序慢慢捋清楚`,
      `我不急着赢，我先让这段话站得住`,
      response
    ].filter(Boolean);
    const lines = ["[Hook]", hook, response];
    for (let i = 1; i < hookRepeats; i += 1) {
      lines.push(sample(variations));
      if (chance(24)) lines.push(response);
    }
    return lines;
  }

  function buildDraft(profile, mood, themes, options, safeLineCount) {
    const context = createDraftContext(options, safeLineCount);
    const lines = [
      `[Rapper: ${profile.rapperLabel} | Album: ${profile.albumLabel} | Mood: ${mood.label}${options.focusKeyword ? ` | Keyword: ${options.focusKeyword}` : ""}]`,
      "",
      "[Intro]",
      `${sample(mood.openers)}，这次先把话慢慢摊开`,
      `${context.theme}不是随便抛出来的词，它背后有一件具体的事`,
      "",
      "[Verse]"
    ];
    for (let i = 0; i < safeLineCount; i += 1) {
      lines.push(buildNarrativeLine(profile, mood, themes, options, i, context));
      if (i === Math.floor(safeLineCount / 2) - 1) lines.push("");
    }
    const hook = buildHook(profile, options.hookRepeats, options.mix, options.focusKeyword, context);
    if (hook.length) lines.push("", ...hook);
    lines.push("", "[Outro]", `${context.ending}，我把${context.theme}留在这首歌里`);
    return { lines, context };
  }

  function fingerprintDraft(lines, context) {
    const compact = lyricOnlyLines(lines)
      .slice(0, 18)
      .map((line) => compactLine(line).slice(0, 10))
      .join("|");
    return `${context.arc.label}:${context.usedBlueprints.slice(0, 14).join("-")}:${compact}`;
  }

  function rememberFingerprint(fingerprint) {
    generationMemory.fingerprints.add(fingerprint);
    while (generationMemory.fingerprints.size > generationMemory.maxSize) {
      const first = generationMemory.fingerprints.values().next().value;
      generationMemory.fingerprints.delete(first);
    }
  }

  function reviewDraft(lines, context, options, themes) {
    const body = lyricOnlyLines(lines);
    const compacted = body.map(compactLine).filter(Boolean);
    const uniqueCount = new Set(compacted).size;
    const repeatRate = compacted.length ? 1 - uniqueCount / compacted.length : 1;
    const keywordHits = options.focusKeyword
      ? body.filter((line) => line.toLowerCase().includes(options.focusKeyword.toLowerCase())).length
      : 0;
    const theme = context.theme || options.focusKeyword || pickTheme(themes);
    const keywordTarget = options.focusKeyword ? Math.min(5, Math.max(3, Math.ceil(options.safeLineCount / 6))) : 0;
    const themeHits = body.filter((line) => line.includes(theme) || lineIncludesAny(line, themes)).length;
    const stageCoverage = new Set(context.usedBlueprints);
    const stageOk = ["setup", "conflict", "turn", "resolve"].every((stage) => stageCoverage.has(stage));
    const connectorHits = body.filter((line) => /(因为|所以|但是|后来|如果|至少|这一次|不是|只是|先|再|最后|结果|明白|懂了)/.test(line)).length;
    const readableHits = body.filter((line) => /(值不值|原因|问题|解释|承受|选择|继续|明白|讲顺|结果|为什么|走下去|真实)/.test(line)).length;
    const hasConcreteImage = body.some((line) => /(灯|夜|手机|桌面|鼓|家里|身边|路|明天|小镇|街口|房间|录音棚|合同|钱)/i.test(line));
    const verseIndex = lines.indexOf("[Verse]");
    const outroIndex = lines.indexOf("[Outro]");
    const verseHasClose = outroIndex > verseIndex && outroIndex > -1;
    const stageDetail = ["setup", "conflict", "turn", "resolve"]
      .map((stage) => `${stage}:${context.usedBlueprints.filter((item) => item === stage).length}`)
      .join(" ");

    let score = 100;
    const checks = [];
    const issues = [];

    const keywordOk = !options.focusKeyword || keywordHits >= keywordTarget;
    if (!keywordOk) {
      score -= (keywordTarget - keywordHits) * 7;
      issues.push(`核心关键词“${options.focusKeyword}”出现偏少`);
    }
    checks.push({
      label: "关键词贯穿",
      ok: keywordOk,
      detail: options.focusKeyword ? `出现 ${keywordHits}/${keywordTarget} 次` : "未指定核心关键词"
    });

    if (!stageOk) {
      score -= 18;
      issues.push("开场、矛盾、转折、落点不完整");
    }
    checks.push({
      label: "叙事走向",
      ok: stageOk,
      detail: `${context.arc.label}，${stageDetail}`
    });

    const varietyOk = repeatRate <= 0.18;
    if (!varietyOk) {
      score -= Math.ceil(repeatRate * 100);
      issues.push("句式变化不够");
    }
    checks.push({
      label: "句式新鲜度",
      ok: varietyOk,
      detail: `重复率 ${Math.round(repeatRate * 100)}%`
    });

    const logicOk = connectorHits >= 5 && themeHits >= Math.max(3, Math.floor(options.safeLineCount / 5));
    if (!logicOk) {
      score -= 14;
      issues.push("前后承接还可以更顺");
    }
    checks.push({
      label: "前后承接",
      ok: logicOk,
      detail: `承接 ${connectorHits} 处，主题命中 ${themeHits} 行`
    });

    const readableOk = readableHits >= Math.max(4, Math.floor(options.safeLineCount / 4));
    if (!readableOk) {
      score -= 12;
      issues.push("可读性不够，像词语拼贴");
    }
    checks.push({
      label: "念读顺畅",
      ok: readableOk,
      detail: `顺读线索 ${readableHits} 行`
    });

    const imageOk = hasConcreteImage;
    if (!imageOk) {
      score -= 8;
      issues.push("缺少具体画面");
    }
    checks.push({
      label: "画面感",
      ok: imageOk,
      detail: imageOk ? "有具体场景或物件" : "需要补一个具体场景"
    });

    const closeOk = verseHasClose && body.length >= options.safeLineCount;
    if (!closeOk) {
      score -= 8;
      issues.push("段落收束不完整");
    }
    checks.push({
      label: "收束",
      ok: closeOk,
      detail: closeOk ? "有 Outro 收住" : "需要补结尾"
    });

    const boundedScore = Math.max(45, Math.min(99, Math.round(score)));
    return {
      score: boundedScore,
      label: boundedScore >= 88 ? "逻辑顺" : boundedScore >= 76 ? "基本顺" : "已自动修补",
      arc: context.arc.label,
      promise: context.arc.promise,
      checks,
      issues
    };
  }

  function repairDraft(draft, review, options, themes) {
    const lines = [...draft.lines];
    const verseIndex = lines.indexOf("[Verse]");
    const insertAt = verseIndex >= 0 ? verseIndex + 2 : lines.length - 2;
    const theme = options.focusKeyword || draft.context.theme || pickTheme(themes);

    if (options.focusKeyword && review.checks.find((check) => check.label === "关键词贯穿" && !check.ok)) {
      lines.splice(insertAt, 0, `所以我把${options.focusKeyword}拉回主线，不让它只当一句口号`);
    }
    if (review.checks.find((check) => check.label === "叙事走向" && !check.ok)) {
      lines.splice(insertAt + 1, 0, `先说压力，再说选择，最后让${theme}有一个能落地的结果`);
    }
    if (review.checks.find((check) => check.label === "前后承接" && !check.ok)) {
      lines.splice(Math.max(insertAt + 2, Math.floor(lines.length / 2)), 0, `后来我才懂，${theme}不是突然出现，是前面每一步推到这里`);
    }
    if (review.checks.find((check) => check.label === "念读顺畅" && !check.ok)) {
      lines.splice(Math.max(insertAt + 3, Math.floor(lines.length / 2)), 0, `我把前因后果捋了一遍，才敢继续往前走`);
    }
    if (review.checks.find((check) => check.label === "画面感" && !check.ok)) {
      lines.splice(insertAt + 1, 0, `${sample(COMMON.scene)}的灯还亮着，${theme}贴在玻璃上发烫`);
    }
    return { ...draft, lines, repaired: true };
  }

  function buildCandidate(profile, mood, themes, options, safeLineCount) {
    const draft = buildDraft(profile, mood, themes, options, safeLineCount);
    let review = reviewDraft(draft.lines, draft.context, options, themes);
    let finalDraft = draft;
    if (review.score < 84 || review.issues.length) {
      finalDraft = repairDraft(draft, review, options, themes);
      review = reviewDraft(finalDraft.lines, finalDraft.context, options, themes);
    }
    const fingerprint = fingerprintDraft(finalDraft.lines, finalDraft.context);
    const noveltyPenalty = generationMemory.fingerprints.has(fingerprint) ? 18 : 0;
    return {
      ...finalDraft,
      fingerprint,
      review,
      selectionScore: review.score - noveltyPenalty + Math.random() * 4
    };
  }

  function generateLyrics(config = {}) {
    const {
      profiles = cloneProfiles(),
      rapperKey = "asen",
      albumKey = "general",
      styleKey = "auto",
      moodKey = "confident",
      themeText = "小镇、野心、家人",
      keywordText = "",
      lineCount = 16,
      explicit = 2,
      hookRepeats = 2,
      mix = "medium"
    } = config;
    const profile = mergedProfile({ profiles, styleKey, rapperKey, albumKey });
    const mood = MOOD_BANK[moodKey] || MOOD_BANK.confident;
    const keywords = [...new Set([...normalizeKeywords(keywordText), ...(profile.keywords || [])])].slice(0, 5);
    const focusKeyword = keywords.length ? keywords[0] : "";
    const themes = [...new Set([...(focusKeyword ? [focusKeyword] : []), ...normalizeThemes(themeText)])];
    const safeLineCount = Number.isFinite(Number(lineCount)) ? Math.min(32, Math.max(8, Number(lineCount))) : 16;
    const options = {
      explicit: Number(explicit) || 0,
      hookRepeats: Number(hookRepeats) || 0,
      mix,
      focusKeyword,
      safeLineCount,
      themes,
      profile
    };

    const candidates = Array.from({ length: 8 }, () => buildCandidate(profile, mood, themes, options, safeLineCount));
    const winner = candidates.sort((a, b) => b.selectionScore - a.selectionScore)[0];
    rememberFingerprint(winner.fingerprint);

    return {
      text: winner.lines.join("\n"),
      title: `${profile.rapperLabel} / ${profile.albumLabel} / ${mood.label}`,
      cadence: profile.cadence,
      energy: profile.energy,
      tone: profile.tone,
      profile,
      selfReview: {
        ...winner.review,
        candidateCount: candidates.length,
        repaired: Boolean(winner.repaired)
      }
    };
  }

  function normalizeSlang(raw) {
    return String(raw || "")
      .replace(/\b(jr|j2|lil3)\b/gi, "鸡儿")
      .replace(/\*{2,}/g, "傻逼");
  }

  function parseTrainingText(raw) {
    const normalizedRaw = normalizeSlang(raw);
    const cleanLines = normalizedRaw
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .map((line) => line.trim().replace(/^[•·-]\s*/, ""))
      .filter(Boolean)
      .filter((line) => !/^verse\s*\d+\s*[:：]?$/i.test(line))
      .filter((line) => !/^[（(].*[）)]$/.test(line));

    const fragments = cleanLines.filter((line) => line.length >= 4 && line.length <= 42);
    const hooks = [];
    const counts = new Map();
    for (const line of fragments) counts.set(line, (counts.get(line) || 0) + 1);
    for (const [line, count] of counts) {
      if (count > 1 || /hook|wake|money|love|boss|小镇|兄弟|妈妈/i.test(line)) hooks.push(line);
    }

    const tokenSource = cleanLines.join("\n");
    const cnTokens = tokenSource.match(/[\u4e00-\u9fff]{2,8}/g) || [];
    const enTokens = tokenSource.match(/[A-Za-z][A-Za-z'’*-]{2,}/g) || [];
    const stopWords = new Set(["verse", "translation", "should", "ignored", "hook", "intro", "outro"]);
    const learnedNouns = [...cnTokens, ...fragments, ...enTokens];
    const nouns = [...new Set(learnedNouns.filter((token) => {
      const normalized = token.toLowerCase();
      return token.length <= 18 && !stopWords.has(normalized);
    }))].slice(0, 120);
    const verbCandidates = cleanLines
      .join("\n")
      .match(/[\u4e00-\u9fff]*(走出|走起|走|来|去|爱|恨|赢|输|飞|唱|写|醒|穿过|落在|点燃|证明|扛住|熬过)[\u4e00-\u9fff]*/g) || [];
    const verbs = [...new Set(verbCandidates)]
      .filter((token) => token.length >= 2 && token.length <= 12)
      .slice(0, 80);
    const images = fragments.filter((line) => /像|如|好像|窗|雨|灯|夜|山|街|房|车|sky|light|dream/i.test(line)).slice(0, 40);

    return {
      nouns,
      verbs: verbs.length ? verbs : nouns.slice(0, 50),
      hooks: hooks.slice(0, 28),
      images,
      keywords: [],
      fragments
    };
  }

  function createRapperProfile(rawName) {
    const name = String(rawName || "").trim();
    return {
      label: name,
      description: "用户新增 rapper，本地训练后会形成独立素材库。",
      aliases: [name, "新风格"],
      nouns: ["舞台", "街区", "故事", "态度", "野心", "节奏"],
      verbs: ["表达", "推进", "证明", "回应", "靠近", "点燃"],
      hooks: [`这是 ${name} 的新段落，先把风格点亮`],
      images: ["新的声音落进鼓点，像刚打开的房间"],
      albumStyles: {
        general: {
          label: "综合风格",
          aliases: [],
          nouns: [],
          verbs: [],
          hooks: [],
          images: [],
          keywords: [],
          learned: emptyBank()
        }
      },
      learned: emptyBank()
    };
  }

  function randomPreset() {
    const themeSets = [
      "小镇、野心、家人",
      "爱情、晚霞、城市",
      "兄弟、背叛、录音棚",
      "焦虑、金钱、失眠",
      "舞台、冠军、对手",
      "妈妈、童年、亏欠"
    ];
    return {
      moodKey: sample(Object.keys(MOOD_BANK)),
      themeText: sample(themeSets),
      lineCount: sample([12, 14, 16, 20, 24]),
      mix: sample(["low", "medium", "high"]),
      explicit: sample([0, 1, 2, 3, 4]),
      hookRepeats: sample([1, 2, 3])
    };
  }

  function listStyles() {
    return Object.entries(STYLE_PROFILES).map(([key, item]) => ({ key, label: item.label }));
  }

  function listMoods() {
    return Object.entries(MOOD_BANK).map(([key, item]) => ({ key, label: item.label }));
  }

  function listRappers(profiles) {
    return Object.entries(profiles || cloneProfiles()).map(([key, item]) => ({ key, label: item.label }));
  }

  function listAlbums(profiles, rapperKey) {
    const allProfiles = profiles || cloneProfiles();
    const rapper = allProfiles[rapperKey] || allProfiles.asen;
    return Object.entries(ensureAlbumStyles(rapper)).map(([key, item]) => ({
      key,
      label: item.label,
      cover: item.cover || "",
      themeHint: item.themeHint || "",
      keywords: item.keywords || []
    }));
  }

  function isBuiltInRapper(key) {
    return Boolean(RAPPER_PROFILES[key]);
  }

  function isBuiltInAlbum(rapperKey, albumKey) {
    return Boolean(RAPPER_PROFILES[rapperKey]?.albumStyles?.[albumKey]);
  }

  return {
    STYLE_PROFILES,
    DEFAULT_RAPPER_PROFILES: RAPPER_PROFILES,
    MOOD_BANK,
    COMMON,
    STORAGE_KEY,
    emptyBank,
    cloneProfiles,
    mergeSavedProfiles,
    ensureAlbumStyles,
    normalizeThemes,
    normalizeKeywords,
    generateRhymes,
    parseTrainingText,
    normalizeSlang,
    generateLyrics,
    createRapperProfile,
    randomPreset,
    listStyles,
    listMoods,
    listRappers,
    listAlbums,
    isBuiltInRapper,
    isBuiltInAlbum
  };
});
