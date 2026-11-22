export type Unit = {
  id: number;
  title: string;
  pages: [number, number];
  category: string;
};

export const units: Unit[] = [
  { id: 1, title: "be動詞（現在形）", pages: [1, 11], category: "基礎" },
  { id: 2, title: "一般動詞（現在形）", pages: [12, 21], category: "基礎" },
  { id: 3, title: "三単現のs", pages: [22, 32], category: "基礎" },
  { id: 4, title: "名詞・代名詞", pages: [33, 43], category: "基礎" },
  { id: 5, title: "疑問詞", pages: [44, 53], category: "基礎" },
  { id: 6, title: "命令文", pages: [54, 62], category: "基礎" },
  { id: 7, title: "助動詞 can", pages: [63, 72], category: "基礎" },
  { id: 8, title: "現在進行形", pages: [73, 81], category: "基礎" },
  { id: 9, title: "過去形", pages: [82, 92], category: "基礎" },
  { id: 10, title: "過去進行形", pages: [93, 100], category: "基礎" },
  { id: 11, title: "感嘆文", pages: [101, 108], category: "応用" },
  { id: 12, title: "There is / There are", pages: [109, 116], category: "応用" },
  { id: 13, title: "未来表現", pages: [117, 124], category: "応用" },
  { id: 14, title: "助動詞（応用）", pages: [125, 132], category: "応用" },
  { id: 15, title: "接続詞", pages: [133, 140], category: "応用" },
  { id: 16, title: "不定詞（3用法）", pages: [141, 148], category: "応用" },
  { id: 17, title: "動名詞（～ing）", pages: [149, 156], category: "応用" },
  { id: 18, title: "比較", pages: [157, 164], category: "応用" },
  { id: 19, title: "受動態（受け身）", pages: [165, 171], category: "応用" },
  { id: 20, title: "現在完了", pages: [172, 178], category: "発展" },
  { id: 21, title: "分詞の形容詞的用法", pages: [179, 185], category: "発展" },
  { id: 22, title: "関係代名詞", pages: [186, 192], category: "発展" },
  { id: 23, title: "間接疑問文", pages: [193, 199], category: "発展" },
  { id: 24, title: "仮定法・付加疑問文など", pages: [200, 206], category: "発展" },
]