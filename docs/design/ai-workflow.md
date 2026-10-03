# AIを用いた開発について記載する。

## 誰に対して記載しているか

- 実装者

## ここで記載したいことを箇条書きで記載する。

- 全体のワークフロー

①Agents.md
毎回、自動で読まれるもの。
ここに記載するのは
そもそもAI駆動開発で使用するものがわからないかな。
skills
arch.md
実装のmd
review.md

## それぞれのファイルについて

- AGENTS.md

instrusction_arch.mdみたいなものを想定している。

## 実行手順

1. AGENTS.mdが毎回読み込まれる
2. arch.mdが読まれてarchの全体像が理解される。
3. bloc.mdみたいなものが呼ばれて実装される。
4. test.mdでテスト実装される
5. E2Eテスト

```mermaid
flowchart TD
  A[AGENTS.md] --> B[arch確認はできているか？]
  B --> C[実装完了]
```

## 新規開発手順

```mermaid
flowchart TD
subgraph 繰り返し
B[test.skills.mdが読まれる] --> C{テスト実装完了？}
C -- いいえ --> B
end

subgraph 繰り返し
D[arch] --> E{確認}
D -- いいえ --> C
end
A[AGENTS.md] --> B
C -- はい --> D[確認]
D -- はい --> E[完了]
```

①AGENTS.mdが毎回読まれる。
②testSkillsが読まれる。
