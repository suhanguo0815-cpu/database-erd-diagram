# JSON字段格式优化方案

## 一、问题分析

在CSV文件中，JSON字段示例包含复杂的嵌套结构和特殊字符（如逗号、引号、大括号），导致：
1. **CSV解析错列**：Excel或其他工具打开时，JSON内容中的逗号会被误认为是列分隔符
2. **字符串转义复杂**：多层引号转义（`""`）导致格式混乱
3. **可读性差**：完整的JSON示例在单个单元格中难以阅读

## 二、解决方案

### 方案1：简化JSON示例（推荐）

**原则**：使用简化或占位符格式，重点展示结构而非完整数据

#### 1.1 数组类型JSON
- **优化前**：`["海鲜","花生","牛奶"]`
- **优化后**：`["item1","item2"]` 或 `[...]`

#### 1.2 对象类型JSON
- **优化前**：`{"enabled":{"breakfast":true,"lunch":true,...},"schedule":{...}}`
- **优化后**：`{key1:value1,key2:value2}` 或 `{...}`

### 方案2：使用描述性示例

将完整JSON替换为结构描述，例如：
- `{enabled:{breakfast:bool,...},schedule:{...}}` → `{enabled:{...},schedule:{...}}`
- `[{name,portionGram,unit?}]` → `[{name,portionGram,...}]`

### 方案3：使用单行紧凑格式

去除不必要的空格和换行，但保留基本结构：
- 避免多行JSON
- 使用简化的键名
- 减少嵌套层级

---

## 三、优化后的JSON字段示例规范

### 数组类型

| 字段 | 优化后示例 |
|------|-----------|
| `allergies` | `["item1","item2"]` |
| `chronicDiseases` | `["disease1","disease2"]` |
| `familyHistory` | `["history1","history2"]` |
| `dietaryRestrictions` | `["restriction1","restriction2"]` |

### 对象类型（简单结构）

| 字段 | 优化后示例 |
|------|-----------|
| `healthConstraints` | `{diagnosed:[],pcos:[],hypot:[]}` |
| `ratio` | `{vegPct:40,proteinPct:30,carbPct:30}` |
| `externalIds` | `{wechatMsgId:"id1",cozeMsgId:"id2"}` |

### 对象类型（复杂结构）

| 字段 | 优化后示例 |
|------|-----------|
| `reminders` | `{enabled:{breakfast:true,lunch:true},schedule:{...}}` |
| `ingredients` | `[{name:"item1",portionGram:200}]` |
| `nutrition` | `{proteinG:25.5,fatG:15.2,carbG:45.8}` |
| `medications` | `[{name:"drug1",dosage:"daily"}]` |

### URL类型（特殊处理）

| 字段 | 优化后示例 |
|------|-----------|
| `factorAnalysisJson` | `{url:"https://example.com/..."}` |
| `radarChartJson` | `{url:"https://example.com/..."}` |

---

## 四、实施建议

### 优先级
1. **数组类型**：统一使用 `["item1","item2"]` 格式
2. **简单对象**：使用紧凑格式，去除多余空格
3. **复杂嵌套**：使用 `{key1:{...},key2:{...}}` 简化格式
4. **URL类型**：使用 `{url:"..."}` 格式

### 优化原则
- ✅ 保持可读性
- ✅ 避免特殊字符导致CSV错列
- ✅ 展示数据结构而非完整数据
- ✅ 使用占位符表示省略内容

---

## 五、优化示例对比

### 示例1：reminders字段

**优化前**（容易错列）：
```
{"enabled":{"breakfast":true,"lunch":true,"dinner":true,"exercise":false,"water":true},"schedule":{"breakfast":"08:00","lunch":"12:00","dinner":"18:00"},"intervalMinutes":120}
```

**优化后**（推荐）：
```
{enabled:{breakfast:true,lunch:true,dinner:true,exercise:false,water:true},schedule:{breakfast:"08:00",lunch:"12:00",dinner:"18:00"},intervalMinutes:120}
```

或更简化：
```
{enabled:{...},schedule:{...},intervalMinutes:120}
```

### 示例2：ingredients字段

**优化前**：
```
[{"name":"青菜","portionGram":200,"unit":"g","note":"清炒"},{"name":"猪肉","portionGram":150,"unit":"g"}]
```

**优化后**：
```
[{name:"青菜",portionGram:200,unit:"g"},{name:"猪肉",portionGram:150}]
```

### 示例3：复杂嵌套JSON

**优化前**：
```
{"macro":{"proteinG":25.5,"fatG":15.2,"carbG":45.8,"fiberG":8.5,"sugarG":12.3},"minerals":{"sodiumMg":580,"calciumMg":280},"vitamins":{"vitaminCMg":65}}
```

**优化后**：
```
{macro:{proteinG:25.5,fatG:15.2,carbG:45.8},minerals:{sodiumMg:580,calciumMg:280},vitamins:{...}}
```


