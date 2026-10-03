// npm audit の結果を読み、high 以上の脆弱性があれば失敗させる。
// 理由があって見逃す脆弱性は ALLOWLIST に GHSA の ID で書く。修正版が出たら消す。
import { spawnSync } from "node:child_process";

const ALLOWLIST = {
  // braces（eslint-config-next → fast-glob → micromatch → braces）。
  // 修正版がまだない（3.0.3 が最新）。lint のときに自分で書いた設定のパターンを読むだけで、
  // 外から入力を差し込まれる経路がないので見逃す。2026-10-03 に追加。
  "GHSA-vfj7-8cjw-p6xm": "braces",
};

const BLOCKING_SEVERITIES = ["high", "critical"];

const { stdout } = spawnSync("npm", ["audit", "--json"], { encoding: "utf8" });

let report;
try {
  report = JSON.parse(stdout);
} catch {
  console.error("npm audit の結果を読めなかった。");
  console.error(stdout);
  process.exit(1);
}

// vulnerabilities の via には、脆弱性そのもの（オブジェクト）と、
// 脆弱なパッケージに依存していること（パッケージ名の文字列）が混ざる。前者だけを集める。
const advisories = new Map();
for (const vulnerability of Object.values(report.vulnerabilities ?? {})) {
  for (const via of vulnerability.via) {
    if (typeof via === "object") {
      advisories.set(via.url, via);
    }
  }
}

const idOf = (advisory) => advisory.url.split("/").pop();

const blocking = [...advisories.values()].filter(
  (advisory) =>
    BLOCKING_SEVERITIES.includes(advisory.severity) &&
    !(idOf(advisory) in ALLOWLIST),
);

const found = new Set([...advisories.values()].map(idOf));
for (const id of Object.keys(ALLOWLIST)) {
  if (!found.has(id)) {
    console.warn(`${id}（${ALLOWLIST[id]}）はもう見つからない。ALLOWLIST から消してよい。`);
  }
}

if (blocking.length > 0) {
  for (const advisory of blocking) {
    console.error(`[${advisory.severity}] ${advisory.name}: ${advisory.title}`);
    console.error(`  ${advisory.url}`);
  }
  process.exit(1);
}

console.log("high 以上の脆弱性はない（ALLOWLIST で見逃したものを除く）。");
