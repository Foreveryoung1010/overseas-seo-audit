#!/usr/bin/env node
// 用 GSC「网页」CSV 导出估算每个页面的需求量级。
// 用法: node gsc-demand-rank.mjs Pages.csv
// 无依赖，Node 18+。

import fs from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("用法: node gsc-demand-rank.mjs <GSC导出的Pages.csv>");
  process.exit(1);
}

const raw = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
const lines = raw.split(/\r?\n/).filter((l) => l.trim());

// 解析 CSV（支持引号包裹）
function parse(line) {
  const out = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (q && line[i + 1] === '"') { cur += '"'; i++; }
      else q = !q;
    } else if (c === "," && !q) { out.push(cur); cur = ""; }
    else cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

const header = parse(lines[0]);
const findCol = (re) => header.findIndex((h) => re.test(h));

const iUrl = 0;
const iImp = findCol(/impression|展示/i);
const iPos = findCol(/position|排名/i);
const iClick = findCol(/click|点击/i);

if (iImp === -1 || iPos === -1) {
  console.error("找不到「展示/排名」列。表头是:", header);
  process.exit(1);
}

const num = (s) => {
  if (!s) return 0;
  const v = parseFloat(String(s).replace(/[%,\s]/g, ""));
  return Number.isFinite(v) ? v : 0;
};

const factor = (pos) => {
  if (pos <= 3) return 1.0;
  if (pos <= 10) return 0.6;
  if (pos <= 20) return 0.3;
  if (pos <= 50) return 0.1;
  return 0.03;
};

const rows = [];
for (const line of lines.slice(1)) {
  const c = parse(line);
  if (!c[iUrl]) continue;
  // 跳过 www/http 变体和重复路径
  const url = c[iUrl];
  if (/^http:\/\//i.test(url) || /^https?:\/\/www\./i.test(url)) continue;
  const imp = num(c[iImp]);
  const pos = num(c[iPos]);
  const clicks = iClick > -1 ? num(c[iClick]) : 0;
  if (!imp) continue;
  const path = url.replace(/^https?:\/\/[^/]+/, "").replace(/\s+将网址.*$/, "") || "/";
  rows.push({ path, imp, pos, clicks, demand: Math.round(imp / factor(pos)) });
}

rows.sort((a, b) => b.demand - a.demand);

const guide = (r) => {
  if (r.demand >= 100 && r.pos > 20) return "★优先修（需求大、排名差）";
  if (r.demand >= 100) return "保持，优化标题提点击率";
  if (r.pos <= 20 && r.demand < 50) return "选题小：停更，别删";
  return "放弃，不用管";
};

const pad = (s, n) => String(s).padEnd(n);
const lpad = (s, n) => String(s).padStart(n);

console.log("\n需求单位  曝光  排名   点击  页面");
console.log("-".repeat(96));
for (const r of rows) {
  console.log(
    lpad(r.demand, 8) + lpad(r.imp, 6) + lpad(r.pos.toFixed(1), 7) + lpad(r.clicks, 6) + "  " + r.path,
  );
}
console.log("-".repeat(96));
console.log("\n动作建议：");
for (const r of rows.filter((x) => x.demand >= 50)) {
  console.log(`  ${pad(r.demand, 6)} ${pad(r.path, 44)} ${guide(r)}`);
}
console.log(
  "\n注：需求单位是「曝光 ÷ 排名系数」的粗估，只能用于同站横向比较，不能当作月搜索量对外说。\n",
);
