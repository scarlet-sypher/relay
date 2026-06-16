import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*
|--------------------------------------------------------------------------
| Deterministic pseudo-random number generator
|--------------------------------------------------------------------------
| Using a seeded LCG so every run produces identical data.
| This makes demos reproducible and segments predictable.
*/

class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) & 0xffffffff;
    return (this.seed >>> 0) / 0xffffffff;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  pick<T>(arr: T[]): T {
    return arr[this.nextInt(0, arr.length - 1)] as T;
  }

  pickWeighted<T>(items: T[], weights: number[]): T {
    const total = weights.reduce((a, b) => a + b, 0);
    let threshold = this.next() * total;
    for (let i = 0; i < items.length; i++) {
      threshold -= weights[i] as number;
      if (threshold <= 0) return items[i] as T;
    }
    return items[items.length - 1] as T;
  }

  shuffle<T>(arr: T[]): T[] {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [result[i], result[j]] = [result[j] as T, result[i] as T];
    }
    return result;
  }
}

const rng = new SeededRandom(42);

/*
|--------------------------------------------------------------------------
| Reference Data
|--------------------------------------------------------------------------
*/

const FIRST_NAMES = [
  "Aarav",
  "Aditya",
  "Akash",
  "Amit",
  "Ananya",
  "Anita",
  "Anjali",
  "Ankita",
  "Anuj",
  "Arjun",
  "Aryan",
  "Asha",
  "Ashish",
  "Ayesha",
  "Deepak",
  "Deepika",
  "Devika",
  "Dhruv",
  "Divya",
  "Gaurav",
  "Geeta",
  "Harish",
  "Harshita",
  "Himanshu",
  "Ishaan",
  "Isha",
  "Jaya",
  "Kabir",
  "Karan",
  "Kavita",
  "Kavya",
  "Kiara",
  "Kunal",
  "Lakshmi",
  "Laxmi",
  "Madhav",
  "Madhuri",
  "Mahesh",
  "Manish",
  "Manjari",
  "Meera",
  "Mihir",
  "Mohit",
  "Monika",
  "Nandini",
  "Neha",
  "Nikhil",
  "Nikita",
  "Nisha",
  "Nishant",
  "Pallavi",
  "Pooja",
  "Prachi",
  "Prakash",
  "Pranav",
  "Prateek",
  "Preethi",
  "Priya",
  "Priyanshi",
  "Rahul",
  "Raj",
  "Rajesh",
  "Rajan",
  "Rakesh",
  "Ramesh",
  "Rashmi",
  "Ravi",
  "Riddhi",
  "Ritika",
  "Rohan",
  "Rohit",
  "Ruchi",
  "Sachin",
  "Sahil",
  "Sakshi",
  "Saloni",
  "Sandeep",
  "Sanjay",
  "Sanjana",
  "Sara",
  "Sarika",
  "Shikha",
  "Shraddha",
  "Shreya",
  "Shubham",
  "Siddharth",
  "Simran",
  "Sneha",
  "Sonam",
  "Sourabh",
  "Suresh",
  "Swati",
  "Tanvi",
  "Tarun",
  "Uday",
  "Usha",
  "Vaibhav",
  "Varsha",
  "Vikram",
  "Virat",
  "Vishal",
  "Vivek",
  "Yash",
  "Zara",
];

const LAST_NAMES = [
  "Agarwal",
  "Ahuja",
  "Arora",
  "Bajaj",
  "Bansal",
  "Batra",
  "Bedi",
  "Bhatt",
  "Chauhan",
  "Chawla",
  "Chopra",
  "Choudary",
  "Desai",
  "Deshpande",
  "Dua",
  "Dubey",
  "Gandhi",
  "Garg",
  "Ghosh",
  "Goyal",
  "Gupta",
  "Iyer",
  "Jain",
  "Joshi",
  "Kapoor",
  "Kaur",
  "Khanna",
  "Kohli",
  "Kumar",
  "Lal",
  "Malhotra",
  "Mehta",
  "Menon",
  "Mishra",
  "Mittal",
  "Nair",
  "Nanda",
  "Pandey",
  "Patel",
  "Patil",
  "Pillai",
  "Prasad",
  "Rao",
  "Reddy",
  "Sahni",
  "Saxena",
  "Seth",
  "Shah",
  "Sharma",
  "Shukla",
  "Singh",
  "Sinha",
  "Sood",
  "Srivastava",
  "Tiwari",
  "Trivedi",
  "Varma",
  "Verma",
  "Yadav",
];

const CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Surat",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Bhopal",
  "Visakhapatnam",
  "Pimpri",
  "Patna",
  "Vadodara",
  "Ghaziabad",
  "Ludhiana",
  "Agra",
  "Nashik",
  "Faridabad",
  "Meerut",
  "Rajkot",
  "Varanasi",
  "Srinagar",
  "Aurangabad",
  "Amritsar",
  "Navi Mumbai",
  "Allahabad",
  "Ranchi",
  "Howrah",
  "Coimbatore",
  "Jabalpur",
  "Gwalior",
  "Vijayawada",
  "Jodhpur",
  "Madurai",
  "Raipur",
  "Kota",
  "Guwahati",
  "Chandigarh",
  "Solapur",
  "Hubli",
  "Bareilly",
  "Mysore",
  "Moradabad",
  "Gurgaon",
  "Noida",
];

const CITY_WEIGHTS = [
  12, 11, 10, 7, 7, 6, 6, 5, 4, 4, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];

const PRODUCT_CATEGORIES = [
  "Moisturiser",
  "Sunscreen",
  "Face Serum",
  "Face Wash",
  "Toner",
  "Eye Cream",
  "Night Cream",
  "Lip Balm",
  "Body Lotion",
  "Hair Oil",
  "Shampoo",
  "Conditioner",
  "Face Mask",
  "Exfoliator",
  "Vitamin C Serum",
];

const CATEGORY_WEIGHTS = [14, 12, 11, 10, 8, 6, 6, 5, 6, 5, 4, 4, 4, 3, 2];

const ORDER_CHANNELS = ["online", "app", "instagram", "website"];

/*
|--------------------------------------------------------------------------
| Cohort Definitions
|--------------------------------------------------------------------------
| Each cohort has a profile that drives how many orders they place,
| how much they spend, and when their last order was.
| This makes segmentation demos meaningful.
*/

type Cohort =
  | "loyal"
  | "high_value"
  | "at_risk"
  | "churned"
  | "new"
  | "occasional";

interface CohortProfile {
  name: Cohort;
  count: number;
  minOrders: number;
  maxOrders: number;
  minSpendPerOrder: number;
  maxSpendPerOrder: number;
  daysSinceLastOrder: [number, number];
  accountAgeDays: [number, number];
  tags: string[];
  preferredChannelWeights: number[];
}

const COHORT_PROFILES: CohortProfile[] = [
  {
    name: "loyal",
    count: 75,
    minOrders: 8,
    maxOrders: 18,
    minSpendPerOrder: 600,
    maxSpendPerOrder: 1800,
    daysSinceLastOrder: [1, 20],
    accountAgeDays: [180, 730],
    tags: ["loyal"],
    preferredChannelWeights: [30, 30, 40],
  },
  {
    name: "high_value",
    count: 50,
    minOrders: 5,
    maxOrders: 12,
    minSpendPerOrder: 1500,
    maxSpendPerOrder: 5000,
    daysSinceLastOrder: [5, 35],
    accountAgeDays: [120, 500],
    tags: ["high-value"],
    preferredChannelWeights: [40, 20, 40],
  },
  {
    name: "at_risk",
    count: 100,
    minOrders: 3,
    maxOrders: 7,
    minSpendPerOrder: 400,
    maxSpendPerOrder: 1200,
    daysSinceLastOrder: [31, 55],
    accountAgeDays: [90, 400],
    tags: ["at-risk"],
    preferredChannelWeights: [35, 35, 30],
  },
  {
    name: "churned",
    count: 100,
    minOrders: 2,
    maxOrders: 5,
    minSpendPerOrder: 300,
    maxSpendPerOrder: 900,
    daysSinceLastOrder: [60, 180],
    accountAgeDays: [120, 600],
    tags: ["churned"],
    preferredChannelWeights: [50, 30, 20],
  },
  {
    name: "new",
    count: 100,
    minOrders: 1,
    maxOrders: 2,
    minSpendPerOrder: 350,
    maxSpendPerOrder: 1000,
    daysSinceLastOrder: [1, 14],
    accountAgeDays: [1, 30],
    tags: ["new"],
    preferredChannelWeights: [20, 30, 50],
  },
  {
    name: "occasional",
    count: 75,
    minOrders: 2,
    maxOrders: 5,
    minSpendPerOrder: 300,
    maxSpendPerOrder: 800,
    daysSinceLastOrder: [20, 60],
    accountAgeDays: [60, 365],
    tags: [],
    preferredChannelWeights: [40, 30, 30],
  },
];
/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const daysAgo = (days: number): Date => {
  const d = new Date("2026-06-15T00:00:00Z");
  d.setDate(d.getDate() - days);
  return d;
};

const randomDateBetween = (start: Date, end: Date): Date => {
  const startMs = start.getTime();
  const endMs = end.getTime();
  return new Date(startMs + rng.next() * (endMs - startMs));
};

const generateEmail = (
  firstName: string,
  lastName: string,
  index: number,
): string => {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${index}@gmail.com`;
};

const generatePhone = (): string => {
  const prefixes = [
    "98",
    "97",
    "96",
    "95",
    "94",
    "93",
    "91",
    "90",
    "89",
    "88",
    "87",
    "86",
    "85",
    "84",
    "83",
    "82",
    "81",
    "80",
    "79",
    "78",
    "77",
    "76",
    "75",
    "74",
    "73",
    "72",
    "71",
    "70",
  ];
  const prefix = rng.pick(prefixes);
  const rest = String(rng.nextInt(10000000, 99999999));
  return `+91${prefix}${rest}`;
};

const CHANNELS = ["EMAIL", "SMS", "WHATSAPP"] as const;
type ChannelType = (typeof CHANNELS)[number];

/*
|--------------------------------------------------------------------------
| Historical Campaign Data
|--------------------------------------------------------------------------
| Pre-built campaigns with realistic analytics so the analytics
| page shows meaningful charts from the moment the seed runs.
*/

interface HistoricalCampaign {
  name: string;
  channel: ChannelType;
  messageBody: string;
  subjectLine?: string;
  segmentName: string;
  daysAgoSent: number;
  targetCohorts: Cohort[];
  maxRecipients: number;
}

const HISTORICAL_CAMPAIGNS: HistoricalCampaign[] = [
  {
    name: "Monsoon Skincare Sale",
    channel: "WHATSAPP",
    messageBody:
      "Hey [First Name]! 🌧️ Monsoon is here and your skin needs extra care. Get 20% off on our bestselling Moisturiser and Sunscreen this week. Shop now before stocks run out!",
    segmentName: "All Active Customers",
    daysAgoSent: 45,
    targetCohorts: ["loyal", "high_value", "occasional"],
    maxRecipients: 200,
  },
  {
    name: "Win-Back: 30-Day Inactive",
    channel: "SMS",
    messageBody:
      "Hi [First Name], we miss you! It's been a while since your last order. Come back and enjoy ₹200 off your next purchase. Use code COMEBACK200.",
    segmentName: "At-Risk Customers",
    daysAgoSent: 30,
    targetCohorts: ["at_risk"],
    maxRecipients: 180,
  },
  {
    name: "VIP Early Access — Vitamin C Launch",
    channel: "EMAIL",
    messageBody:
      "Dear [First Name], as one of our most valued customers, you get exclusive early access to our new Vitamin C Serum before it goes live. Click below to shop now.",
    subjectLine: "Your exclusive early access is here ✨",
    segmentName: "High-Value Customers",
    daysAgoSent: 20,
    targetCohorts: ["high_value", "loyal"],
    maxRecipients: 150,
  },
  {
    name: "Welcome Series — New Customers",
    channel: "WHATSAPP",
    messageBody:
      "Welcome to Aura Beauty, [First Name]! 🌸 Thank you for your first order. Here's a little gift — use WELCOME15 for 15% off your next purchase. We can't wait to see you glow!",
    segmentName: "New Customers",
    daysAgoSent: 14,
    targetCohorts: ["new"],
    maxRecipients: 160,
  },
  {
    name: "Re-engagement: Churned Customers",
    channel: "EMAIL",
    messageBody:
      "Hi [First Name], it's been a few months and we've been thinking about you. A lot has changed at Aura — new products, new formulas. Come back and see what you've been missing.",
    subjectLine: "We've missed you, [First Name] 💛",
    segmentName: "Churned Customers",
    daysAgoSent: 10,
    targetCohorts: ["churned"],
    maxRecipients: 120,
  },
  {
    name: "Loyalty Rewards Announcement",
    channel: "WHATSAPP",
    messageBody:
      "Hey [First Name]! 🏆 You've been amazing. As a loyal Aura customer, you've earned 500 reward points this month. Redeem them on your next order for a surprise discount!",
    segmentName: "Loyal Customers",
    daysAgoSent: 7,
    targetCohorts: ["loyal"],
    maxRecipients: 130,
  },
];

/*
|--------------------------------------------------------------------------
| Delivery simulation for historical campaigns
|--------------------------------------------------------------------------
| Simulates realistic callback outcomes so analytics
| show meaningful numbers.
*/

interface DeliveryProbabilities {
  delivered: number;
  opened: number;
  read: number;
  clicked: number;
}

const CHANNEL_PROBS: Record<ChannelType, DeliveryProbabilities> = {
  WHATSAPP: { delivered: 0.96, opened: 0.45, read: 0.9, clicked: 0.15 },
  SMS: { delivered: 0.92, opened: 0.0, read: 0.0, clicked: 0.18 },
  EMAIL: { delivered: 0.85, opened: 0.28, read: 0.8, clicked: 0.12 },
};

type CommStatus =
  | "QUEUED"
  | "SENT"
  | "DELIVERED"
  | "OPENED"
  | "READ"
  | "CLICKED"
  | "FAILED";

const simulateStatus = (channel: ChannelType): CommStatus => {
  const p = CHANNEL_PROBS[channel];
  if (rng.next() > p.delivered) return "FAILED";
  if (channel === "SMS") {
    return rng.next() < p.clicked ? "CLICKED" : "DELIVERED";
  }
  if (rng.next() > p.opened) return "DELIVERED";
  if (rng.next() > p.read) return "OPENED";
  if (rng.next() > p.clicked) return "READ";
  return "CLICKED";
};

const resolveTimestamps = (
  status: CommStatus,
  baseTime: Date,
): Partial<{
  sentAt: Date;
  deliveredAt: Date;
  openedAt: Date;
  readAt: Date;
  clickedAt: Date;
  failedAt: Date;
  failureReason: string;
}> => {
  const addSeconds = (date: Date, seconds: number): Date =>
    new Date(date.getTime() + seconds * 1000);

  const sentAt = addSeconds(baseTime, rng.nextInt(1, 5));

  if (status === "FAILED") {
    const reasons = [
      "Invalid phone number",
      "Number not reachable",
      "Mailbox full",
      "Domain not found",
      "WhatsApp not installed",
      "Message blocked by carrier",
    ];
    return {
      sentAt,
      failedAt: addSeconds(sentAt, rng.nextInt(2, 10)),
      failureReason: rng.pick(reasons),
    };
  }

  const deliveredAt = addSeconds(sentAt, rng.nextInt(2, 8));
  if (status === "DELIVERED") return { sentAt, deliveredAt };

  if (status === "CLICKED" && status === "CLICKED") {
    const clickedAt = addSeconds(deliveredAt, rng.nextInt(30, 300));
    return { sentAt, deliveredAt, clickedAt };
  }

  const openedAt = addSeconds(deliveredAt, rng.nextInt(60, 600));
  if (status === "OPENED") return { sentAt, deliveredAt, openedAt };

  const readAt = addSeconds(openedAt, rng.nextInt(10, 120));
  if (status === "READ") return { sentAt, deliveredAt, openedAt, readAt };

  const clickedAt = addSeconds(readAt, rng.nextInt(5, 60));
  return { sentAt, deliveredAt, openedAt, readAt, clickedAt };
};

/*
|--------------------------------------------------------------------------
| Main Seed Function
|--------------------------------------------------------------------------
*/

const seed = async (): Promise<void> => {
  console.log("🌱 Starting Relay CRM seed...\n");

  /*
  |------------------------------------------------------------------------
  | Step 1 — Wipe all tables in dependency order
  |------------------------------------------------------------------------
  */

  console.log("🗑️  Clearing existing data...");
  await prisma.campaignAnalytics.deleteMany();
  await prisma.communication.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.segment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  console.log("   ✅ All tables cleared\n");

  /*
  |------------------------------------------------------------------------
  | Step 2 — Generate 1000 customers across cohorts
  |------------------------------------------------------------------------
  */

  console.log("👥 Creating 1000 customers across cohorts...");

  type CustomerRow = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    preferredChannel: ChannelType;
    lastOrderAt: Date | null;
    totalOrders: number;
    totalSpend: number;
    aiSegmentTags: string[];
    createdAt: Date;
    updatedAt: Date;
    cohort: Cohort;
    accountCreatedAt: Date;
    lastOrderDate: Date;
  };

  const customerRows: CustomerRow[] = [];
  let customerIndex = 0;

  for (const profile of COHORT_PROFILES) {
    console.log(`   → Building ${profile.count} ${profile.name} customers`);

    for (let i = 0; i < profile.count; i++) {
      const firstName = rng.pick(FIRST_NAMES);
      const lastName = rng.pick(LAST_NAMES);
      const city = rng.pickWeighted(CITIES, CITY_WEIGHTS);
      const preferredChannel = rng.pickWeighted(
        CHANNELS as unknown as ChannelType[],
        profile.preferredChannelWeights,
      );

      const accountAgeDays = rng.nextInt(
        profile.accountAgeDays[0],
        profile.accountAgeDays[1],
      );
      const accountCreatedAt = daysAgo(accountAgeDays);

      const lastOrderDaysAgo = rng.nextInt(
        profile.daysSinceLastOrder[0],
        profile.daysSinceLastOrder[1],
      );
      const lastOrderDate = daysAgo(lastOrderDaysAgo);

      const orderCount = rng.nextInt(profile.minOrders, profile.maxOrders);
      const avgOrderValue = rng.nextFloat(
        profile.minSpendPerOrder,
        profile.maxSpendPerOrder,
      );
      const totalSpend = Math.round(orderCount * avgOrderValue);

      customerRows.push({
        id: crypto.randomUUID(),
        firstName,
        lastName,
        email: generateEmail(firstName, lastName, customerIndex),
        phone: generatePhone(),
        city,
        preferredChannel,
        lastOrderAt: lastOrderDate,
        totalOrders: orderCount,
        totalSpend,
        aiSegmentTags: profile.tags,
        createdAt: accountCreatedAt,
        updatedAt: new Date("2026-06-15T00:00:00Z"),
        cohort: profile.name,
        accountCreatedAt,
        lastOrderDate,
      });

      customerIndex++;
    }
  }

  await prisma.customer.createMany({
    data: customerRows.map((c) => ({
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      phone: c.phone,
      city: c.city,
      preferredChannel: c.preferredChannel,
      lastOrderAt: c.lastOrderAt,
      totalOrders: c.totalOrders,
      totalSpend: c.totalSpend,
      aiSegmentTags: c.aiSegmentTags,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    })),
  });

  console.log(`   ✅ ${customerRows.length} customers created\n`);

  /*
  |------------------------------------------------------------------------
  | Step 3 — Generate 5000–8000 orders
  |------------------------------------------------------------------------
  */

  console.log("🛒 Creating orders...");

  const allOrders: {
    id: string;
    customerId: string;
    orderNumber: string;
    amount: number;
    productCategory: string;
    channel: string;
    createdAt: Date;
  }[] = [];

  let orderCounter = 1;

  for (const customer of customerRows) {
    const profile = COHORT_PROFILES.find((p) => p.name === customer.cohort)!;
    const orderCount = customer.totalOrders;

    const accountStart = customer.accountCreatedAt;
    const lastOrder = customer.lastOrderDate;

    for (let o = 0; o < orderCount; o++) {
      let orderDate: Date;

      if (o === orderCount - 1) {
        orderDate = lastOrder;
      } else {
        const fraction = (o + rng.nextFloat(0, 1)) / orderCount;
        orderDate = randomDateBetween(
          accountStart,
          new Date(lastOrder.getTime() - 1000 * 60 * 60 * 24),
        );
        void fraction;
      }

      const category = rng.pickWeighted(PRODUCT_CATEGORIES, CATEGORY_WEIGHTS);
      const baseAmount = rng.nextFloat(
        profile.minSpendPerOrder,
        profile.maxSpendPerOrder,
      );

      const categoryMultipliers: Record<string, number> = {
        "Vitamin C Serum": 1.4,
        "Face Serum": 1.3,
        "Eye Cream": 1.2,
        "Night Cream": 1.15,
        Moisturiser: 1.0,
        Sunscreen: 1.0,
        Toner: 0.9,
        "Face Wash": 0.85,
        Exfoliator: 0.85,
        "Face Mask": 0.8,
        "Body Lotion": 0.8,
        "Hair Oil": 0.75,
        Shampoo: 0.75,
        Conditioner: 0.7,
        "Lip Balm": 0.6,
      };

      const multiplier = categoryMultipliers[category] ?? 1.0;
      const amount = Math.round(baseAmount * multiplier);

      allOrders.push({
        id: crypto.randomUUID(),
        customerId: customer.id,
        orderNumber: `ORD-${String(orderCounter).padStart(6, "0")}`,
        amount,
        productCategory: category,
        channel: rng.pick(ORDER_CHANNELS),
        createdAt: orderDate,
      });

      orderCounter++;
    }
  }

  const BATCH_SIZE = 500;
  for (let i = 0; i < allOrders.length; i += BATCH_SIZE) {
    await prisma.order.createMany({
      data: allOrders.slice(i, i + BATCH_SIZE),
    });
  }

  console.log(`   ✅ ${allOrders.length} orders created\n`);

  /*
  |------------------------------------------------------------------------
  | Step 4 — Create meaningful segments
  |------------------------------------------------------------------------
  */

  console.log("🎯 Creating segments...");

  const segments = await Promise.all([
    prisma.segment.create({
      data: {
        name: "Loyal Customers",
        description: "Customers with 8+ orders who ordered in the last 20 days",
        filterRules: {
          operator: "AND",
          conditions: [
            { field: "totalOrders", op: "gte", value: 8 },
            { field: "lastOrderAt", op: "days_ago_lte", value: 20 },
          ],
        },
        nlQuery: "customers with more than 8 orders who bought recently",
        customerCount: customerRows.filter((c) => c.cohort === "loyal").length,
        isAiDiscovered: false,
        createdAt: daysAgo(60),
        updatedAt: daysAgo(60),
      },
    }),

    prisma.segment.create({
      data: {
        name: "High-Value Customers",
        description: "Customers with total spend above ₹10,000",
        filterRules: {
          operator: "AND",
          conditions: [{ field: "totalSpend", op: "gte", value: 10000 }],
        },
        nlQuery: "customers who have spent more than 10000 rupees",
        customerCount: customerRows.filter((c) => c.cohort === "high_value")
          .length,
        isAiDiscovered: false,
        createdAt: daysAgo(55),
        updatedAt: daysAgo(55),
      },
    }),

    prisma.segment.create({
      data: {
        name: "At-Risk Customers",
        description: "Customers who haven't ordered in 31–55 days",
        filterRules: {
          operator: "AND",
          conditions: [
            { field: "lastOrderAt", op: "days_ago_gte", value: 31 },
            { field: "lastOrderAt", op: "days_ago_lte", value: 55 },
          ],
        },
        nlQuery: "customers who haven't ordered in the last 30 to 55 days",
        customerCount: customerRows.filter((c) => c.cohort === "at_risk")
          .length,
        isAiDiscovered: true,
        createdAt: daysAgo(50),
        updatedAt: daysAgo(50),
      },
    }),

    prisma.segment.create({
      data: {
        name: "Churned Customers",
        description: "Customers with no orders in the last 60 days",
        filterRules: {
          operator: "AND",
          conditions: [{ field: "lastOrderAt", op: "days_ago_gte", value: 60 }],
        },
        nlQuery: "customers who have not ordered in over 60 days",
        customerCount: customerRows.filter((c) => c.cohort === "churned")
          .length,
        isAiDiscovered: true,
        createdAt: daysAgo(45),
        updatedAt: daysAgo(45),
      },
    }),

    prisma.segment.create({
      data: {
        name: "New Customers",
        description:
          "Customers who placed their first order in the last 30 days",
        filterRules: {
          operator: "AND",
          conditions: [
            { field: "totalOrders", op: "lte", value: 2 },
            { field: "lastOrderAt", op: "days_ago_lte", value: 14 },
          ],
        },
        nlQuery: "new customers who joined in the last 30 days",
        customerCount: customerRows.filter((c) => c.cohort === "new").length,
        isAiDiscovered: false,
        createdAt: daysAgo(30),
        updatedAt: daysAgo(30),
      },
    }),

    prisma.segment.create({
      data: {
        name: "Win-Back: High Spend Inactive",
        description:
          "Customers who spent over ₹5000 but haven't ordered in 30+ days",
        filterRules: {
          operator: "AND",
          conditions: [
            { field: "totalSpend", op: "gte", value: 5000 },
            { field: "lastOrderAt", op: "days_ago_gte", value: 30 },
          ],
        },
        nlQuery:
          "high spending customers who haven't ordered in the last 30 days",
        customerCount: customerRows.filter(
          (c) =>
            c.totalSpend >= 5000 &&
            (c.cohort === "at_risk" || c.cohort === "churned"),
        ).length,
        isAiDiscovered: true,
        createdAt: daysAgo(25),
        updatedAt: daysAgo(25),
      },
    }),

    prisma.segment.create({
      data: {
        name: "WhatsApp Preferred Customers",
        description:
          "Customers who prefer WhatsApp as their communication channel",
        filterRules: {
          operator: "AND",
          conditions: [
            { field: "preferredChannel", op: "eq", value: "WHATSAPP" },
          ],
        },
        nlQuery: "customers who prefer whatsapp",
        customerCount: customerRows.filter(
          (c) => c.preferredChannel === "WHATSAPP",
        ).length,
        isAiDiscovered: false,
        createdAt: daysAgo(20),
        updatedAt: daysAgo(20),
      },
    }),
  ]);

  console.log(`   ✅ ${segments.length} segments created\n`);

  /*
  |------------------------------------------------------------------------
  | Step 5 — Create historical campaigns with communications and analytics
  |------------------------------------------------------------------------
  */

  console.log("📣 Creating historical campaigns with analytics...");

  for (const campaignDef of HISTORICAL_CAMPAIGNS) {
    const segment =
      segments.find((s) =>
        s.name
          .toLowerCase()
          .includes(
            campaignDef.segmentName
              .toLowerCase()
              .split(" ")[0]
              ?.toLowerCase() ?? "",
          ),
      ) ?? segments[0]!;

    const eligibleCustomers = customerRows
      .filter((c) => campaignDef.targetCohorts.includes(c.cohort))
      .slice(0, campaignDef.maxRecipients);

    const sentAt = daysAgo(campaignDef.daysAgoSent);
    const completedAt = new Date(sentAt.getTime() + 1000 * 60 * 60 * 2);

    const campaign = await prisma.campaign.create({
      data: {
        name: campaignDef.name,
        segmentId: segment.id,
        channel: campaignDef.channel,
        messageBody: campaignDef.messageBody,
        subjectLine: campaignDef.subjectLine ?? null,
        status: "COMPLETED",
        sentAt,
        completedAt,
        aiInsight: generateAiInsight(
          campaignDef.name,
          campaignDef.channel,
          eligibleCustomers.length,
        ),
        createdAt: daysAgo(campaignDef.daysAgoSent + 1),
        updatedAt: completedAt,
      },
    });

    const communicationData: {
      id: string;
      campaignId: string;
      customerId: string;
      channel: ChannelType;
      recipientAddress: string;
      messageBody: string;
      status: CommStatus;
      queuedAt: Date;
      sentAt: Date | null;
      deliveredAt: Date | null;
      openedAt: Date | null;
      readAt: Date | null;
      clickedAt: Date | null;
      failedAt: Date | null;
      failureReason: string | null;
    }[] = [];

    let totalSent = 0;
    let totalDelivered = 0;
    let totalFailed = 0;
    let totalOpened = 0;
    let totalRead = 0;
    let totalClicked = 0;

    for (const customer of eligibleCustomers) {
      const status = simulateStatus(campaignDef.channel);
      const timestamps = resolveTimestamps(status, sentAt);

      const recipientAddress =
        campaignDef.channel === "EMAIL"
          ? customer.email
          : (customer.phone ?? customer.email);

      const personalizedMessage = campaignDef.messageBody.replace(
        /\[First Name\]/g,
        customer.firstName,
      );

      communicationData.push({
        id: crypto.randomUUID(),
        campaignId: campaign.id,
        customerId: customer.id,
        channel: campaignDef.channel,
        recipientAddress,
        messageBody: personalizedMessage,
        status,
        queuedAt: sentAt,
        sentAt: timestamps.sentAt ?? null,
        deliveredAt: timestamps.deliveredAt ?? null,
        openedAt: timestamps.openedAt ?? null,
        readAt: timestamps.readAt ?? null,
        clickedAt: timestamps.clickedAt ?? null,
        failedAt: timestamps.failedAt ?? null,
        failureReason: timestamps.failureReason ?? null,
      });

      totalSent++;
      if (status === "FAILED") totalFailed++;
      if (["DELIVERED", "OPENED", "READ", "CLICKED"].includes(status))
        totalDelivered++;
      if (["OPENED", "READ", "CLICKED"].includes(status)) totalOpened++;
      if (["READ", "CLICKED"].includes(status)) totalRead++;
      if (status === "CLICKED") totalClicked++;
    }

    for (let i = 0; i < communicationData.length; i += BATCH_SIZE) {
      await prisma.communication.createMany({
        data: communicationData.slice(i, i + BATCH_SIZE),
      });
    }

    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;
    const openRate =
      totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0;
    const clickRate = totalRead > 0 ? (totalClicked / totalRead) * 100 : 0;

    await prisma.campaignAnalytics.create({
      data: {
        campaignId: campaign.id,
        totalSent,
        totalDelivered,
        totalFailed,
        totalOpened,
        totalRead,
        totalClicked,
        deliveryRate,
        openRate,
        clickRate,
        lastUpdatedAt: completedAt,
      },
    });

    console.log(
      `   ✅ ${campaignDef.name} — ${totalSent} sent, ${totalDelivered} delivered, ${totalClicked} clicked`,
    );
  }

  /*
  |------------------------------------------------------------------------
  | Step 6 — Print summary
  |------------------------------------------------------------------------
  */

  const finalCustomers = await prisma.customer.count();
  const finalOrders = await prisma.order.count();
  const finalSegments = await prisma.segment.count();
  const finalCampaigns = await prisma.campaign.count();
  const finalComms = await prisma.communication.count();
  const finalAnalytics = await prisma.campaignAnalytics.count();

  console.log("\n🎉 Seed complete!\n");
  console.log("📊 Database Summary:");
  console.log(`   Customers:      ${finalCustomers}`);
  console.log(`   Orders:         ${finalOrders}`);
  console.log(`   Segments:       ${finalSegments}`);
  console.log(`   Campaigns:      ${finalCampaigns}`);
  console.log(`   Communications: ${finalComms}`);
  console.log(`   Analytics rows: ${finalAnalytics}`);
  console.log("\n✅ Your Relay CRM demo is ready.\n");
};

/*
|--------------------------------------------------------------------------
| AI Insight Generator (deterministic, no API call)
|--------------------------------------------------------------------------
*/

const generateAiInsight = (
  campaignName: string,
  channel: ChannelType,
  recipientCount: number,
): string => {
  const probs = CHANNEL_PROBS[channel];
  const delivered = Math.round(recipientCount * probs.delivered);
  const deliveryRate = (probs.delivered * 100).toFixed(0);

  const insights: Record<ChannelType, string> = {
    WHATSAPP: `Your "${campaignName}" campaign reached ${recipientCount} customers on WhatsApp. ${delivered} messages were delivered (${deliveryRate}%), which is above the average for this channel. Engagement was strong — customers who had ordered within the last 30 days responded at nearly 3x the rate of those inactive for longer. Consider narrowing your next campaign to the most recently active segment for even better ROI.\n\nRecommended Action: Create a follow-up campaign targeting customers who opened but did not click, with a more direct offer and a limited-time discount code.`,
    SMS: `Your "${campaignName}" SMS campaign delivered to ${delivered} of ${recipientCount} recipients (${deliveryRate}% delivery rate). SMS click rates outperformed Email for the same audience this week. Customers in Tier 1 cities showed a notably higher response rate. Messages sent between 11am and 1pm had the highest engagement.\n\nRecommended Action: Schedule the next SMS campaign during the 11am–1pm window and A/B test a shorter message with just the offer code.`,
    EMAIL: `Your "${campaignName}" Email campaign reached ${recipientCount} customers. ${delivered} were delivered successfully (${deliveryRate}%). Open rates were in line with industry benchmarks for skincare brands. Customers who had previously engaged with WhatsApp campaigns were less likely to open Email, suggesting channel fatigue. Subject line personalisation improved open rates compared to previous campaigns.\n\nRecommended Action: Segment the non-openers and retry with a different subject line in 5 days.`,
  };

  return insights[channel];
};

/*
|--------------------------------------------------------------------------
| Run
|--------------------------------------------------------------------------
*/

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
