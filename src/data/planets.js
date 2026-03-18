export const planetsData = [
  {
    id: 'mercury',
    name: '水星',
    nameEn: 'Mercury',
    diameter: 4879,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    rotationPeriod: 59,
    color: '#8C7853',
    description: '水星是太阳系中最小的行星，也是离太阳最近的行星。它的表面布满了陨石坑，类似于月球。水星没有大气层，温差极大，白天可达430°C，夜晚降至-180°C。',
    funFact: '水星的一天（从日出到日出）相当于地球的176天！',
    texture: 'textures/mercury.jpg'
  },
  {
    id: 'venus',
    name: '金星',
    nameEn: 'Venus',
    diameter: 12104,
    distanceFromSun: 108.2,
    orbitalPeriod: 225,
    rotationPeriod: 243,
    color: '#FFC649',
    description: '金星是太阳系中最热的行星，表面温度高达465°C。它有浓厚的二氧化碳大气层，导致强烈的温室效应。金星是唯一反向自转的行星。',
    funFact: '金星自转方向与其他行星相反，所以那里太阳从西边升起！',
    texture: 'textures/venus.jpg'
  },
  {
    id: 'earth',
    name: '地球',
    nameEn: 'Earth',
    diameter: 12742,
    distanceFromSun: 149.6,
    orbitalPeriod: 365,
    rotationPeriod: 1,
    color: '#6B93D6',
    description: '地球是我们的家园，是目前已知唯一存在生命的行星。71%的表面被海洋覆盖，拥有适宜的大气层和磁场保护。',
    funFact: '地球不是正球形，而是一个略微扁平的椭球体！',
    texture: 'textures/earth.jpg',
    hasMoon: true
  },
  {
    id: 'mars',
    name: '火星',
    nameEn: 'Mars',
    diameter: 6779,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    rotationPeriod: 1.03,
    color: '#E27B58',
    description: '火星被称为"红色星球"，因为它的表面覆盖着氧化铁（铁锈）。火星有太阳系最高的山峰奥林帕斯山和最大的峡谷水手号峡谷。',
    funFact: '火星上的奥林帕斯山高约21公里，是珠穆朗玛峰的三倍！',
    texture: 'textures/mars.jpg'
  },
  {
    id: 'jupiter',
    name: '木星',
    nameEn: 'Jupiter',
    diameter: 139820,
    distanceFromSun: 778.5,
    orbitalPeriod: 4333,
    rotationPeriod: 0.41,
    color: '#C88B3A',
    description: '木星是太阳系中最大的行星，质量是其他所有行星总和的2.5倍。它有一个著名的大红斑，这是一个持续了数百年的巨大风暴。',
    funFact: '木星有至少95颗卫星，其中四颗被称为"伽利略卫星"！',
    texture: 'textures/jupiter.jpg'
  },
  {
    id: 'saturn',
    name: '土星',
    nameEn: 'Saturn',
    diameter: 116460,
    distanceFromSun: 1434,
    orbitalPeriod: 10759,
    rotationPeriod: 0.45,
    color: '#EAD6B8',
    description: '土星以其壮观的环系统闻名，环由冰块和岩石组成。土星是太阳系中密度最小的行星，如果有一个足够大的浴缸，土星会浮在水面上。',
    funFact: '土星环宽度达28万公里，但最厚处只有1公里！',
    texture: 'textures/saturn.jpg',
    hasRings: true
  },
  {
    id: 'uranus',
    name: '天王星',
    nameEn: 'Uranus',
    diameter: 50724,
    distanceFromSun: 2871,
    orbitalPeriod: 30685,
    rotationPeriod: 0.72,
    color: '#D1E7E7',
    description: '天王星是一颗冰巨星，大气中含有甲烷，使它呈现淡蓝色。它的自转轴倾斜角达98度，几乎是"躺着"公转的。',
    funFact: '天王星的四季变化很极端，每个极点有42年的白天或黑夜！',
    texture: 'textures/uranus.jpg'
  },
  {
    id: 'neptune',
    name: '海王星',
    nameEn: 'Neptune',
    diameter: 49244,
    distanceFromSun: 4495,
    orbitalPeriod: 60190,
    rotationPeriod: 0.67,
    color: '#5B5DDF',
    description: '海王星是太阳系最远的行星，风速可达每小时2100公里。它有14颗卫星，最大的是海卫一，上面有活跃的冰火山。',
    funFact: '海王星上的一年相当于地球的165年！',
    texture: 'textures/neptune.jpg'
  }
];

export const sunData = {
  id: 'sun',
  name: '太阳',
  nameEn: 'Sun',
  diameter: 1392700,
  distanceFromSun: 0,
  orbitalPeriod: 0,
  rotationPeriod: 25,
  description: '太阳是一颗黄矮星，占据了太阳系总质量的99.86%。它的核心温度高达1500万摄氏度，通过核聚变产生能量，为地球提供光和热。',
  funFact: '太阳每秒钟消耗约400万吨氢，转化为能量！',
  color: '#FFD700',
  texture: 'textures/sun.jpg'
};

export const moonData = {
  id: 'moon',
  name: '月球',
  nameEn: 'Moon',
  diameter: 3474,
  distanceFromParent: 3, // 距离地球的单位距离
  orbitalPeriod: 27.3, // 公转周期（天）
  rotationPeriod: 27.3, // 自转周期（天，与公转同步）
  color: '#C0C0C0',
  description: '月球是地球唯一的天然卫星，也是太阳系第五大卫星。它的引力影响地球的潮汐，使地球自转逐渐减慢。',
  funFact: '月球每年远离地球约3.8厘米！',
  texture: 'textures/moon.jpg'
};
