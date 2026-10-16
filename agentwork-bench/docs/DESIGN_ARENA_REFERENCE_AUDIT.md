# Design Arena 对照研究与 AgentWork v5 改造记录

日期：2026-10-16。状态：公开产品机制研究 + 已实现的本地原型改造。**不是“已经与 Design Arena 一样”的声明。**

## 1. 本次实际查看了什么

查阅了 Design Arena 的首页、Website/Slides 类别入口、分类排行榜、About 方法论、Agentic Harness、Fullstack 方法论、Mobile App 方法论，以及官方排行榜 API 文档。[1]–[8]

浏览器直连这些网站时，运行环境返回 `ERR_BLOCKED_BY_ADMINISTRATOR`。因此本次依据的是 Web 工具读取的公开页面内容及官方文档，**没有完成真实登录、生成作品、提交投票，也没有取得 Design Arena 当前完整页面的浏览器截图**。不能据此声称像素级复刻、验证了手机端所有细节或真实 generation/loading/error 动效。

AgentWork 的截图来自自己代码的本地内存渲染，与参考站截图严格区分。没有复制对方标志、品牌、插画、源代码、用户作品、私有接口或模型成绩。

## 2. 之前理解得过于粗糙的三个地方

**它不只是一种“两张卡片”的比赛。** About 页面描述四模型采样、匿名成对选择和多轮排序。Agentic Harness 与 Fullstack 文档则说明同一任务下的两个 Agent 构建及作品盲比。不同轨道不能被我们归并成一个未经区分的协议。[2][3][4]

**多类别不是一个下拉列表。** 首页让用户从创作意图进入不同类别；官方接口又区分 models、builders、agents 及其类别。入口、工具环境、产物和成绩都对应具体类别，而不是一套流程换名称。[1][6]

**结果不是一段看起来不错的总结。** Fullstack 的核心展示是可实际操作的应用，Mobile 的说明也强调可体验的产物。我们的对应实现应当首先展示写出的文件，允许展开、阅读和下载，再按需看过程；不能只展示一个大金额和“推荐成功”。[4][5]

## 3. 逐项对照：观察、采用和边界

“官网确认”仅指有公开文档依据，不代表本轮实际操作完成了该能力。

| 对照项 | Design Arena 的公开依据 | AgentWork v5 的采用方式 | 当前边界 |
| --- | --- | --- | --- |
| 首页核心 | 通用创作意图输入 [1] | 改为通用工作入口，不固定住房字段 | 自由文本只存草稿，尚不调用模型 |
| 类别入口 | Website、Slides、Image、Game 等并列 [1] | 六类工作快捷入口；点击能选任务/筛选 | 三类 runnable，三类 in design |
| 类别链接 | `?category=website`、`?category=slides` [1] | 支持 `?task=...` 和有效任务参数 | 分享的是公共任务配置，不是私密结果 |
| 领域/轨道 | models / builders / agents 独立组织 [6] | 任务领域与 Verified / Preference / Efficiency 分离 | 不借用对方类别或模型成绩 |
| 普通模型比赛 | 四模型、多个成对比较 [2] | 作为未来协议设计参考 | 不把两个脚本改名四次假装锦标赛 |
| Agent 比赛 | 同一 Prompt，两个 Agent 构建 [3][4] | 同任务、同参数、独立 world copies | 当前为两套确定性本地策略 |
| 能力公平性 | 核心工具一致，按类别增加工具 [3] | 沿用 TaskSpec 的工具、输入和独立重置 | 未有远端容器或真实模型 adapter |
| 匿名性 | 评价前不显示模型身份 [2][5] | A/B 顺序随机；投票前不显示策略名称和 checks | 仅 UI 层，公开 JS 可查看真实策略 |
| 结果主视图 | 可交互的部署作品 [4][5] | 直接显示生成的 CSV 或渲染后的 Markdown | 不是可编辑 XLSX，也未有网站/app runner |
| 同类型比较 | 两边同任务产物供用户检查 [4] | Table / Report 同步切换 | 同步控件是我们的设计，不声称对方相同 |
| 展开检查 | 官方强调可以体验产物 [4][5] | 展开文件、预览/源文切换、宽/窄布局、下载 | 窄布局不是设备仿真；未复制对方控件 |
| 执行轨迹 | 工具调用可以记录与重放 [3] | Process tab + 原始本地工具输入输出 | 不是私有历史 Gmail 或隐藏思维链 |
| 人类偏好 | 匿名对比产生偏好信号 [2][5] | A / B / Tie / Neither，本地记录且阻止重复投票 | 不进入全球榜；按钮集合为本项目选择 |
| 客观验收 | Fullstack 有额外 schema 检查 [4] | 投票后独立展示逐条功能验收 | 不称偏好票等于任务正确率 |
| 排行榜 | 分类榜、胜率/评级及资源比较 [6][7] | 分类过滤；Verified/Preference/Efficiency 分开 | 实际模型数据缺失时显示空态，不虚构分数 |
| 模型详情 | 详情页含不同类别表现与评价样本 [8] | 列为后续真实配置页面需求 | 本轮没有编造模型目录 |
| 手机对比 | Mobile 文档强调可在目标设备体验 [5] | 我们允许 Both / A / B 聚焦阅读，避免极窄双栏 | 自有响应式方案，不是对方手机界面复刻 |
| 错误与加载 | 本轮没有操作生成流程验证 | 本地执行失败显示明确错误，无假流式打字 | 不声称已对齐参考站 error/loading 行为 |

## 4. 为什么不把四模型锦标赛直接装进网站

当前我们只有 `Evidence-led` 和 `Shortcut-led` 两种参考策略。拿两个策略换名字生成四个选手，会让比赛和排名都具有误导性。v5 只运行有根据的 A/B 对比，不提供假模型切换。

未来可以注册多种比赛协议，但应在数据层标记 `protocol_id`、模型/策略配置、随机种子、对阵列表、重试规则与是否完整结束。四模型协议与 A/B 协议分别存储，不能无说明地把同一场中有依赖的投票当独立实验重复计数。

**本轮采用 Agentic A/B 的交互原则，而非声明完整实现 Design Arena 的所有轨道。**

## 5. 已经落实到 v5 的代码

- `index.html`：入口加载 v5 产品界面；原 v4 运行器及任务保持不变。
- `v5/ui.mjs`：通用首页、六类快捷入口、任务设置渐进展开、artifact-first 对战、任务配置分享、分类榜、工作区与本地记录。
- `v5/presentation.mjs`：CSV 表格、安全的 Markdown 子集渲染、匿名导出过滤、任务筛选、记录校验。
- `v5/product.css`：原创视觉系统；扩大作品区域，减少摘要卡占比；手机端支持单侧聚焦。
- `tests/presentation.test.mjs`：补充显示与安全边界测试；原 40 个运行器测试继续保留。

对战流程现在为：

```text
选工作类型 → 选任务/约束 → 两份独立合成 world
→ 真正执行本地参考脚本 → 生成两个 CSV/Markdown 交付物
→ 并排阅读 / 切换报告 / 展开 / 下载
→ 用户偏好 → 揭示策略与验收
→ 导出实际记录，或换一个任务
```

UI 没有填入 GPT、Claude 等模型名称来伪装模型接入；模型费、tokens 和模型延迟仍然缺失，不能把零 API 调用解释成免费模型运行。

## 6. 与参考站保留的必要区别

**我们测工作的可靠完成，不仅是作品的审美偏好。** 因此 Verified、Preference 与 Efficiency 分开。一份报告更漂亮，但金额错、邮件没发或越权操作，不能用偏好票抵消。

**我们有工作世界。** 采购需要有效报价，办公需要日历状态，数据交付需要数值与文件；不把这六种工作全改成网站生成，也不继续把租房变体当成多领域。

**正式 benchmark 与自由使用分开。** 自由输入是产品愿景；受控任务需要版本化 world、工具与 rubric。未接入模型前，自由输入明确保存为草稿，不显示虚假的“正在执行”。

**数据不是前端产生的权威成绩。** 浏览器可以计算公开示例检查，但正式排名需要后端可信日志、任务隔离、反作弊、费用计量和评分版本。v5 不偷偷把 localStorage 当公共数据库。

## 7. 测试记录与未覆盖项

2026-10-16 本地执行：

- `node --test tests/*.test.mjs`：51 项通过（原 40 项 + 11 项表现层测试）。
- Chromium 内存加载：36 项交互/布局断言通过；无 JavaScript page error。
- 检查宽度：1440、1024、768、390、320；无页面级横向溢出。表格内部允许横向滚动。
- 验证类别切换、动态约束、产物切换、展开、原始文本、文件下载、投票揭示、领域过滤、工作区材料及任务草稿。
- 浏览器 URL 导航被运行环境禁止，所以测试用 `set_content` 加载自身 CSS，并以 Blob modules 执行自身源码。localStorage 用内存 shim。**不等于公网端到端、真实刷新持久化或剪贴板权限验证。**
- Node 测试验证 CSV/Markdown 不执行源材料中的 HTML，以及未投票导出移除顶层 policy/checks/passed；公开源码意味着这不是安全匿名保证。
- 截图使用可用字体回退，不是对参考站字体的像素核验。没有完成全量 WCAG 对比度或辅助技术审计。

## 8. 仍要补的 P0 / P1

**P0（真实产品）**：服务端 Agent runner、真正的模型调用和流式状态、凭据隔离、全球投票存储、反滥用、基于版本和样本量的真实榜。

**P0（评测可信度）**：私有世界状态、grader 隔离、人工校准、错误恢复记录、模型费用、公开模拟与隐藏评测分轨。

**P1（体验）**：更多真实可运行任务、更多 artifact viewers、真实输出的交互式预览、完整模型/配置详情，以及获得浏览器访问后对 Design Arena 的桌面/手机实际生成和失败流程再做一次审查。

**结论：v5 更认真地采用了 Design Arena 的入口与产物比较原则；没有达到它的真实模型、托管作品和社区评价能力，不能称“做得一样”。**

## 官方参考

[1] 首页与类别入口：https://www.designarena.ai/ ；https://www.designarena.ai/?category=website ；https://www.designarena.ai/?category=slides

[2] About / Tournament / Ranking：https://www.designarena.ai/about

[3] Agentic Harness：https://www.designarena.ai/methodology/agentic-harness

[4] Fullstack Arena Methodology：https://notes.designarena.ai/fullstack-arena-methodology/

[5] Evaluating Mobile App-Building Agents：https://notes.designarena.ai/evaluating-mobile-app-building-agents/

[6] 官方 API 与 Arena/Category 划分：https://docs.designarena.ai/api-reference/overview

[7] 分类榜与资源比较入口：https://www.designarena.ai/leaderboard ；https://www.designarena.ai/leaderboard/website

[8] 模型详情页示例：https://www.designarena.ai/models/deepseek-v4-pro 。仅用于确认页面信息结构，不转载或核验该模型的成绩。
