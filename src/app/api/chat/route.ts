import { NextRequest, NextResponse } from "next/server";

// قاعدة معرفة مبسطة لعناوين حقيقية شائعة (محاكاة بحث)
const SERIES_DB: Record<
  string,
  { titles: string[]; note?: string }
> = {
  "bratty sis": {
    titles: [
      "My Stepbrother's Secret - S1 E1 (with Athena Faris)",
      "Helping My Stepsister - S2 E4",
      "Bratty Sis Gets Caught - S3 E2",
      "Family Vacation Secrets - S4 E7",
      "Stepsister Sleepover - S5 E3",
      "The Forbidden Game - S6 E1",
      "Bratty Sis Needs Discipline - S7 E5",
      "Holiday Family Fun - S8 E2",
    ],
    note: "سلسلة شهيرة من Studio Nubiles / Bratty Sis",
  },
  "moms teach sex": {
    titles: [
      "Moms Teach Sex - Teaching Her a Lesson (with India Summer)",
      "Moms Teach Sex - The Right Way to Fuck",
      "Moms Teach Sex - Sharing is Caring",
      "Moms Teach Sex - First Time Lessons",
      "Moms Teach Sex - Step Mom Guidance",
      "Moms Teach Sex - Private Tutoring",
      "Moms Teach Sex - Family Bonding",
      "Moms Teach Sex - Advanced Techniques",
    ],
    note: "سلسلة Nubiles Porn الكلاسيكية",
  },
  "family strokes": {
    titles: [
      "Family Strokes - Step Sister Seduction",
      "Family Strokes - Mom's Special Lesson",
      "Family Strokes - Forbidden Family Fun",
      "Family Strokes - The Swap",
      "Family Strokes - Holiday Special",
      "Family Strokes - Sleepover Secrets",
      "Family Strokes - Step Dad's Surprise",
      "Family Strokes - Family Bonding Night",
    ],
  },
  "daughter swap": {
    titles: [
      "Daughter Swap - Trading Daughters",
      "Daughter Swap - The Exchange",
      "Daughter Swap - Family Deal",
      "Daughter Swap - Night of Swapping",
      "Daughter Swap - Forbidden Trade",
      "Daughter Swap - Parents' Agreement",
      "Daughter Swap - Special Arrangement",
      "Daughter Swap - Ultimate Swap",
    ],
  },
  "my family pies": {
    titles: [
      "My Family Pies - Pie Contest",
      "My Family Pies - Baking Lessons",
      "My Family Pies - Family Recipe",
      "My Family Pies - Sweet Revenge",
      "My Family Pies - Kitchen Secrets",
      "My Family Pies - Holiday Baking",
      "My Family Pies - Step Sister's Pie",
      "My Family Pies - The Special Ingredient",
    ],
  },
  "sislovesme": {
    titles: [
      "SisLovesMe - Step Sister Blackmail",
      "SisLovesMe - Caught Masturbating",
      "SisLovesMe - Family Bonding",
      "SisLovesMe - The Deal",
      "SisLovesMe - Sleeping Beauty",
      "SisLovesMe - Step Bro Helps Out",
      "SisLovesMe - Forbidden Desires",
      "SisLovesMe - Morning Wood",
    ],
  },
  "spyfam": {
    titles: [
      "SpyFam - Step Sister Caught Spying",
      "SpyFam - Hidden Camera Fun",
      "SpyFam - Family Secrets Exposed",
      "SpyFam - The Voyeur",
      "SpyFam - Caught in the Act",
      "SpyFam - Spying on Step Mom",
      "SpyFam - Secret Footage",
      "SpyFam - Undercover Family",
    ],
  },
};

// قاعدة معرفة للعناوين المزيفة → الأصل (reverse lookup)
const REVERSE_LOOKUP: Record<string, string> = {
  "its_wrong_youre_my_stepson": `**الموقع المنتج:** BangBros – Big Tit Creampie (bangbros.com)

**العنوان الحقيقي:** August Taylor Creampied by Her Step-Son (صدر في 13 ديسمبر 2018)

**أسماء الممثلين:** August Taylor + Juan El Caballo Loco

**الفئات (Categories):**  
Hardcore, Couples - Boy/Girl, Hair: Brunettes, Theme: Family Roleplay, Cumshot: Creampie

**ملخص داخل الموقع (Official Summary):**  
August Taylor is one horny milf. She loves to fuck, doesn’t matter where or with who. This week, it was her step son’s turn. She pulled his cock out in the kitchen and began choking on it, not caring that her husband was just in the other room. They then fucked in the kitchen as the rest of the family was having breakfast at the dinner table. Eventually, they snuck upstairs to continue fucking properly. August’s pussy got penetrated by her step son’s cock in several different positions until she instructed him to cum inside her pussy.

**بيانات إضافية:**  
المدة: 26:24  
تاريخ الإصدار: 13 ديسمبر 2018  
الرابط الرسمي: https://www.bangbrosnetwork.com/videos/8908421/august-taylor-creampied-by-her-step-son`,
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findSeries(message: string): string | null {
  const norm = normalize(message);
  for (const key of Object.keys(SERIES_DB)) {
    if (norm.includes(key) || key.split(" ").every((w) => norm.includes(w))) {
      return key;
    }
  }
  if (norm.includes("bratty") || norm.includes("براتي")) return "bratty sis";
  if (norm.includes("moms teach") || norm.includes("ماما تعلم")) return "moms teach sex";
  if (norm.includes("family strokes") || norm.includes("فاميلي ستروكس")) return "family strokes";
  if (norm.includes("daughter swap") || norm.includes("داوتر سواب")) return "daughter swap";
  if (norm.includes("family pies") || norm.includes("ماي فاميلي")) return "my family pies";
  if (norm.includes("sis loves") || norm.includes("سيز لوفز")) return "sislovesme";
  if (norm.includes("spy fam") || norm.includes("سباي فام")) return "spyfam";
  return null;
}

function detectPirateLink(message: string): string | null {
  const lower = message.toLowerCase();
  if (
    lower.includes("hqporner.com") ||
    lower.includes("eporner.com") ||
    lower.includes("xvideos.com") ||
    lower.includes("xnxx.com") ||
    lower.includes("pornhd") ||
    lower.includes("spankbang")
  ) {
    const match = message.match(/(?:hdporn\/|video-|\/)([a-z0-9_\-]+?)(?:\.html|$|\/|\?)/i);
    if (match && match[1]) {
      return match[1].toLowerCase().replace(/-/g, "_");
    }
    return "unknown_pirate";
  }
  return null;
}

function generateReply(message: string): string {
  // أولاً: لو فيه لينك قرصنة → reverse lookup
  const pirateKey = detectPirateLink(message);
  if (pirateKey) {
    if (REVERSE_LOOKUP[pirateKey]) {
      return `لقيت الأصل! 🔍\n\n${REVERSE_LOOKUP[pirateKey]}\n\nعايز أبحث عن لينك تاني؟ ابعت اللينك.`;
    }
    return `فهمت إنك بعت لينك من موقع قرصنة.\n\nهحاول أحدد العنوان الحقيقي والاستوديو الأصلي.\n\nحالياً عندي قاعدة معرفة محدودة للعناوين الشائعة. ابعت العنوان المزيف أو اسم الممثلة + سنة تقريبية عشان أدور أدق.\n\nأو جرب لينك تاني معروف.`;
  }

  const seriesKey = findSeries(message);
  const lower = message.toLowerCase();

  if (lower.includes("أحدث") || lower.includes("جديد") || lower.includes("latest") || lower.includes("new")) {
    if (seriesKey && SERIES_DB[seriesKey]) {
      const titles = SERIES_DB[seriesKey].titles.slice(-4).reverse();
      return `فهمت، عايز أحدث الحلقات من ${seriesKey.toUpperCase()}.\n\nإليك أحدث 4 عناوين متاحة في قاعدة البيانات:\n\n${titles.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\n${SERIES_DB[seriesKey].note || ""}\n\nعايز تفاصيل عن عنوان معين ولا اقتراحات أكتر؟`;
    }
  }

  if (lower.includes("عنوان") || lower.includes("scene") || lower.includes("حلقة") || lower.includes("ep")) {
    if (seriesKey && SERIES_DB[seriesKey]) {
      const titles = SERIES_DB[seriesKey].titles;
      return `تمام، لقيت معلومات عن السلسلة دي.\n\nأمثلة لعناوين موجودة:\n\n${titles.slice(0, 5).map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\nلو عندك اسم عنوان محدد اكتبه وأدور عليه أكتر.\n\nعايز أكمل القائمة؟`;
    }
  }

  if (seriesKey && SERIES_DB[seriesKey]) {
    const data = SERIES_DB[seriesKey];
    const titles = data.titles;
    return `فاهم طلبك، سلسلة ${seriesKey.toUpperCase()}.\n\nإليك 6-8 عناوين حقيقية/شائعة من السلسلة:\n\n${titles.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\n${data.note ? `ملاحظة: ${data.note}` : ""}\n\nعايز:\n- تفاصيل عن عنوان معين؟\n- أحدث الحلقات؟\n- اقتراحات حسب ممثلة أو سيناريو (prank / sleepover / holiday)؟\n- أو ابعت لينك من hqporner/eporner عشان أدور على الأصل\nقولي.`;
  }

  if (lower.includes("اقتراح") || lower.includes("suggest") || lower.includes("قائمة")) {
    return `حالياً عندي بيانات جيدة عن السلاسل دي:\n\n• Bratty Sis\n• Moms Teach Sex\n• Family Strokes\n• Daughter Swap\n• My Family Pies\n• SisLovesMe\n• SpyFam\n\nاكتب اسم واحدة منهم + نوع الطلب (اقتراحات / أحدث / عنوان معين)\n\nأو ابعت لينك من موقع قرصنة (hqporner وغيرها) وأدور لك على العنوان الأصلي والاستوديو.`;
  }

  return `فاهم إنك بتدور على محتوى من السلاسل الإباحية.\n\nقولي اسم السلسلة بوضوح (مثلاً: Bratty Sis أو Moms Teach Sex) وإيه اللي محتاجه بالظبط:\n1. اقتراحات عناوين\n2. أحدث الحلقات\n3. عنوان معين\n4. حسب ممثلة أو سيناريو\n5. **ابعت لينك من hqporner / eporner عشان أدور على الأصل الحقيقي**\n\nهرد عليك بنفس الأسلوب المباشر.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = (body.message || "").toString().trim();

    if (!message) {
      return NextResponse.json({ reply: "اكتب رسالة عشان أقدر أساعدك." });
    }

    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));

    const reply = generateReply(message);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { reply: "حصل خطأ داخلي. جرب تاني." },
      { status: 500 }
    );
  }
}
