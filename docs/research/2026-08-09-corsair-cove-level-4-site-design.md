# Corsair Cove 关卡 4 网站设计

## 1. 目标

按照关卡 4 教程要求，基于关卡 2、3 已核验的关键词、页面矩阵和事实素材，准备一个可在本地运行的 Corsair Cove 英文攻略站。首版必须包含首页、Guide Hub 和第一批四篇攻略，具备清晰导航、基础 SEO、桌面与移动端适配，并可在后续推送到 GitHub、部署到 Vercel。

本设计只定义实施范围和技术方案，不在当前阶段创建网站工程或编写页面代码。

## 2. 已确认决策

- 参考站采用 [VV Ultimatum](https://vvultimatum.net/) 的“任务路径型 Wiki”信息结构。
- 只借鉴页面结构、导航、信息层级和布局逻辑，不复制参考站的文字、图片、游戏数据或品牌元素。
- 技术方案采用 Next.js App Router、TypeScript、Tailwind CSS 和本地 MDX。
- 首版只发布英文；保留语言字典和内容边界，但不生成没有核验内容的其他语言页面。
- 公开 URL 不增加 `/en/` 前缀，继续使用关卡 2 已规划的 URL。
- 新网站放在独立目录 `corsair-cove-site/`，避免把研究证据、临时数据库和教程资料混入网站仓库。

## 3. 首版范围

首版固定为六个页面：

| 页面 | URL | 职责 |
|---|---|---|
| 首页 | `/` | 展示站点定位、稳定统计、四条入门路径、游戏介绍和 CTA |
| Guide Hub | `/guides/` | 聚合首批四篇攻略，不制造新事实 |
| Beginner Tips | `/tips/` | 提供经过核验的新手建议和避坑信息 |
| Get More Drifters | `/how-to-get-more-drifters/` | 回答人口增长条件和相关限制 |
| Build Your First Ship | `/how-to-build-ship/` | 说明已核验的建船流程与前置条件 |
| Connect High Buildings | `/connect-high-buildings/` | 说明垂直建造和高层连接方法 |

这四篇攻略均为关卡 3 资料源总表中的绿灯页面，并且与首页 `Start Here` 四张卡片完全对应。

首版明确不包含：

- `/mods/` 和 `/golden-city-maze/` 等红灯页面。
- `/platforms/`、`/tobacco/`、`/rope/` 等存在限制或冲突的黄灯页面。
- 数据库、CMS、登录、搜索、评论、广告或动态 API。
- 德语、法语和巴西葡萄牙语正文。
- 价格、折扣、评价数量和评价比例等动态数字。
- 未经核验的 Demo 行为、OSRS 同名地点、作弊器、破解和盗版内容。

## 4. 工程边界与目录

建议工程结构：

```text
corsair-cove-site/
├─ src/
│  ├─ app/                     # 六个公开路由和全局布局
│  ├─ components/site/         # 站点共享组件
│  ├─ content/
│  │  ├─ homepage-content.json # 首页配置的开发副本
│  │  ├─ guides.ts             # 已发布攻略清单
│  │  └─ guides/*.mdx          # 四篇攻略正文
│  ├─ i18n/
│  │  └─ en.json               # 英文界面字典
│  └─ lib/                     # 内容校验和元数据辅助函数
├─ public/                     # favicon 和经过批准的站点图片
├─ mdx-components.tsx
└─ package.json
```

`corsair-cove/` 保持为研究与审计资料目录。实施时只把网站真正需要的已批准内容复制到 `corsair-cove-site/src/content/`，不让网站在运行时依赖父目录文件。

## 5. 架构与数据流

数据流固定为：

```text
已核验的本地 JSON / MDX
          ↓
Next.js Server Components
          ↓
构建阶段生成静态 HTML 和 Metadata
          ↓
本地浏览器，后续部署到 Vercel
```

- 首页读取 `homepage-content.json`，不在组件中重复硬编码文案。
- Guide Hub 读取 `guides.ts` 中的已发布页面清单。
- 四篇攻略各自使用独立 MDX，方便维护表格、步骤、提示框和相关文章。
- 页面默认使用 Server Components；只有移动导航和主题切换等交互需要 Client Component。
- 不使用运行时内容 API，因此首版没有远程数据请求失败问题。

## 6. 共享组件

共享组件保持职责单一：

- `SiteHeader`：Logo、主导航、移动端折叠菜单和主题入口。
- `Hero`：首页定位、描述、主要 CTA 和次要 CTA。
- `StatsStrip`：展示四项稳定事实，不接收动态价格或评价。
- `GuideCard`：统一攻略卡片，接收标题、描述、分类和 URL。
- `Breadcrumbs`：Guide Hub 和文章页的路径导航。
- `ArticleLayout`：文章标题、描述、核验日期、目录、正文和相关文章。
- `Callout`：警告、常见错误和证据限制。
- `SiteFooter`：官方入口、法律路径、版权和非官方网站声明。

页面组件只组织这些共享单元，不复制组件内部实现。

## 7. 页面设计

### 7.1 视觉系统

- 主色使用海水蓝绿色，呼应现有 `homepage-content.json` 的 HSL 建议。
- 内容背景使用浅羊皮纸色，保证长文阅读对比度。
- 金色只用于主要 CTA 和少量重点；海盗红只用于警告或风险提示。
- 暂无批准的主视觉图片时，使用 CSS 渐变、轻量纹理和现有 favicon，不显示破图占位。
- 不宣称这些颜色是官方品牌规范。

### 7.2 首页

信息顺序固定为：

1. Header。
2. Hero：独立粉丝站定位、游戏名、简短说明和攻略入口。
3. 四项稳定统计：发售日期、50+ Goods、4 Principle Paths、62 Steam Achievements。
4. Start Here：四张攻略卡片。
5. What is Corsair Cove：游戏介绍和已核验基础数据。
6. Final CTA。
7. Footer。

### 7.3 Guide Hub

- 顶部使用面包屑、单一 H1 和简短说明。
- 四篇攻略分为 `Start Here`、`Population`、`Ships`、`Construction` 等清晰任务类别。
- 只展示已经发布的页面；未来页面可以在文字中说明，但不得生成可点击死链。

### 7.4 攻略文章

信息顺序固定为：

1. 面包屑。
2. H1、直接答案、最后核验日期和适用版本。
3. 页面目录。
4. 按 H2/H3 组织的步骤或说明。
5. 常见错误、证据限制或版本风险提示。
6. Next Steps 和 Related Guides。
7. 来源说明与 Footer。

文章开头直接回答搜索问题，不使用冗长铺垫。

## 8. 内容与事实边界

实施时允许读取和整理：

- `corsair-cove/homepage-content.json`
- `corsair-cove/homepage-development-audit.json`
- `corsair-cove/关键词素材.md`
- `corsair-cove/关卡3-资料源总表.md`
- `corsair-cove/素材缺口.md`
- `corsair-cove/页面矩阵规划.md`

规则：

- 只写已有可靠来源支撑的事实。
- 不为了达到固定字数补写未经证实的机制、数值、地点或步骤。
- 每篇文章携带最后核验日期和适用版本。
- 页面末尾保留来源说明、相关攻略和非官方网站声明。
- 现有素材不足时缩短文章或明确限制，不进行猜测补全。
- 首页不展示发布前必须刷新的动态事实。

## 9. SEO

- 每页设置独立 `title`、`description`、canonical URL 和基础 Open Graph 元数据。
- 每页有且仅有一个 H1。
- H2/H3 连续使用，不跳级。
- 目标关键词出现在 title、description、H1 和开头直接答案中，但不机械堆砌。
- 内部链接只指向六个已发布页面或已批准的外部官方链接。
- 生成 `sitemap.xml` 和 `robots.txt`；关卡 4 不提交搜索引擎。
- 站点首版为英文，页面 `<html lang="en">`。

## 10. 异常处理

- 未知路径显示自定义 404 页面。
- 首页 JSON 缺少必需字段或结构无效时，构建失败并指出字段路径。
- MDX 缺少标题、描述、核验日期或正文时，构建失败。
- `guides.ts` 中的 URL 与实际路由不一致时，测试失败。
- 图片缺失时使用明确的主题背景，不输出破损的 `img`。
- 表格和长 URL 在窄屏中换行或横向滚动，不让整个页面横向溢出。
- 外部链接只使用关卡 3 已记录的 Steam、Microsoft Store、官方 Wiki、Discord、YouTube 和开发商网站。

## 11. 验证方案

### 11.1 自动验证

- `npm run lint`：检查代码和基础可访问性问题。
- `npm test`：校验首页 JSON、四篇 MDX 必填字段、攻略清单和内部链接。
- `npm run build`：确认六个公开页面能完成生产构建。
- 检查每页 title、description、canonical、单一 H1 和 H2/H3 层级。
- 扫描内部链接，禁止 404、红灯页面和未发布页面入口。
- 扫描首页输出，禁止冲突数字、动态价格和红灯页面内容。

### 11.2 浏览器验证

- 桌面端使用约 `1440 × 900` 视口检查六个页面。
- 移动端使用约 `390 × 844` 视口检查导航、卡片、正文、表格和长链接。
- 确认没有白屏、横向页面溢出、破图或浏览器控制台错误。
- 保存首页、Guide Hub 和 `/tips/` 截图，作为关卡作业材料。
- 使用 DOM 检查 SEO，再由用户按教程使用 AITDK 的 Overview 复核。

## 12. 过关标准

- 本地开发服务器可以正常启动。
- 六个页面全部可访问且相互链接。
- 首页包含导航栏、Hero、稳定统计、Start Here、内容区和 Footer。
- Guide Hub 可以进入四篇攻略。
- 每篇攻略只使用已核验素材，并显示核验日期和适用版本。
- 桌面端和移动端均无明显布局错误。
- title、description、H1/H2/H3 满足教程基础 SEO 要求。
- 完成代码和本地页面截图。
- 实际实施完成后，由用户提供或创建空 GitHub 仓库，再推送代码并截取仓库结构。

## 13. 当前准备状态

已经具备：

- 首页纯净配置和审计配置。
- 四篇首批攻略对应的绿灯素材。
- 页面矩阵、关键词清单、资料源总表和素材缺口记录。
- favicon 多尺寸文件包。
- 本机 Node.js、npm 和 Git。

实施前仍需完成：

- 创建 `corsair-cove-site/` 网站工程。
- 从批准的关卡 3 素材整理四篇 MDX 正文。
- 实现并验证六个页面。
- 用户在 GitHub 创建空仓库，或在实施完成后授权创建和推送。

当前工作区不是 Git 仓库，因此本设计文档无法在此阶段提交到版本控制；不得把“文件已写入”和“已提交 Git”混为一谈。
