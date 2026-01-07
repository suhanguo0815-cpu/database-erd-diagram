# user_subscriptions 表字段说明文档

## 一、状态字段的区别

### 1.1 subscriptionStatus（订阅状态）vs serviceStatus（服务状态）

**核心区别**：
- **subscriptionStatus**：关注**支付/合同层面**的状态
- **serviceStatus**：关注**实际服务提供层面**的状态

**为什么需要两个状态？**

这两个状态可能**不同步**，例如：
- 用户支付了但服务还没开始（订阅=active，服务=trial/observation）
- 用户暂停了订阅但服务还在观察期（订阅=paused，服务=active）
- 订阅已过期但服务还在延续期（订阅=expired，服务=active）

#### subscriptionStatus（订阅状态）

| 值 | 含义 | 说明 |
|---|---|---|
| `trial` | 试用期 | 免费试用阶段 |
| `active` | 活跃 | 正常付费订阅中 |
| `paused` | 暂停 | 用户主动暂停（保留订阅但不计费） |
| `canceled` | 已取消 | 用户主动取消订阅 |
| `expired` | 已过期 | 订阅到期未续费 |

#### serviceStatus（服务状态）

| 值 | 含义 | 说明 |
|---|---|---|
| `trial` | 试用期 | 服务试用阶段 |
| `active` | 服务中 | 正在提供服务 |
| `paused` | 暂停 | 服务暂停（用户或管理员暂停） |
| `suspended` | 暂停中 | 被系统暂停（违规等） |
| `ended` | 已结束 | 服务已结束 |

**场景示例**：

```
场景1：用户支付了30天服务，但服务从3天后开始
- subscriptionStatus: "active" （已付费）
- serviceStatus: "trial" （服务还没开始）

场景2：用户暂停了订阅，但服务还在观察期
- subscriptionStatus: "paused" （订阅暂停）
- serviceStatus: "active" （服务继续）

场景3：订阅过期，但服务还在延续期
- subscriptionStatus: "expired" （已过期）
- serviceStatus: "active" （服务还在继续）
```

---

## 二、时间字段的区别

### 2.1 服务时间 vs 计费期时间

**核心区别**：
- **服务时间**：整个服务的**生命周期**（可能跨多个计费期）
- **计费期时间**：当前这一个**计费周期**的时间范围

### 2.2 各时间字段详解

#### serviceStartAtUtc（服务开始时间）
- **含义**：整个服务的开始时间
- **特点**：服务生命周期内不变
- **示例**：用户购买了90天服务，2024-01-01开始，这个时间就是服务开始时间

#### serviceEndAtUtc（服务结束时间）
- **含义**：整个服务的结束/到期时间
- **特点**：可以是null（未结束），或者具体的结束时间
- **示例**：90天服务在2024-04-01结束

#### currentPeriodStartUtc（当前计费期开始）
- **含义**：**当前这一期**的计费周期开始时间
- **特点**：每期更新（比如每30天一期）
- **示例**：
  - 第1期：2024-01-01 到 2024-01-31
  - 第2期：2024-02-01 到 2024-02-29（currentPeriodStartUtc=2024-02-01）
  - 第3期：2024-03-01 到 2024-03-31（currentPeriodStartUtc=2024-03-01）

#### currentPeriodEndUtc（当前计费期结束）
- **含义**：**当前这一期**的计费周期结束时间
- **特点**：每期更新
- **示例**：当前是第2期，则currentPeriodEndUtc=2024-02-29

#### nextBillingAtUtc（下次计费时间）
- **含义**：下一次扣费/续费的时间点
- **特点**：自动续费时使用
- **示例**：如果currentPeriodEndUtc是2024-02-29，nextBillingAtUtc也是2024-02-29（或者提前1天）

---

## 三、时间字段关系图

```
服务生命周期（90天，分3期，每期30天）
│
├─ serviceStartAtUtc: 2024-01-01 (服务开始)
│
├─ 第1期（计费期）
│  ├─ currentPeriodStartUtc: 2024-01-01
│  ├─ currentPeriodEndUtc: 2024-01-31
│  └─ nextBillingAtUtc: 2024-01-31 (第1期结束时扣第2期费用)
│
├─ 第2期（计费期）
│  ├─ currentPeriodStartUtc: 2024-02-01 (更新)
│  ├─ currentPeriodEndUtc: 2024-02-29 (更新)
│  └─ nextBillingAtUtc: 2024-02-29 (第2期结束时扣第3期费用)
│
├─ 第3期（计费期）
│  ├─ currentPeriodStartUtc: 2024-03-01 (更新)
│  ├─ currentPeriodEndUtc: 2024-03-31 (更新)
│  └─ nextBillingAtUtc: null (最后一期，不续费)
│
└─ serviceEndAtUtc: 2024-04-01 (服务结束)
```

---

## 四、字段使用场景

### 场景1：新用户购买90天服务（分3期，每期30天）

```json
{
  "subscriptionId": "sub-001",
  "subscriptionStatus": "active",
  "serviceStatus": "active",
  "serviceStartAtUtc": "2024-01-01T00:00:00Z",
  "serviceEndAtUtc": "2024-04-01T00:00:00Z",
  "currentPeriodStartUtc": "2024-01-01T00:00:00Z",
  "currentPeriodEndUtc": "2024-01-31T23:59:59Z",
  "nextBillingAtUtc": "2024-01-31T23:59:59Z",
  "autoRenew": true
}
```

### 场景2：第一期结束，进入第二期

```json
{
  "subscriptionId": "sub-001",
  "subscriptionStatus": "active",
  "serviceStatus": "active",
  "serviceStartAtUtc": "2024-01-01T00:00:00Z",  // 不变
  "serviceEndAtUtc": "2024-04-01T00:00:00Z",    // 不变
  "currentPeriodStartUtc": "2024-02-01T00:00:00Z",  // 更新
  "currentPeriodEndUtc": "2024-02-29T23:59:59Z",    // 更新
  "nextBillingAtUtc": "2024-02-29T23:59:59Z",       // 更新
  "autoRenew": true
}
```

### 场景3：用户暂停订阅

```json
{
  "subscriptionId": "sub-001",
  "subscriptionStatus": "paused",  // 订阅暂停
  "serviceStatus": "active",       // 但服务还在继续
  "serviceStartAtUtc": "2024-01-01T00:00:00Z",
  "serviceEndAtUtc": null,  // 暂停后，服务结束时间延后
  "currentPeriodStartUtc": "2024-02-01T00:00:00Z",
  "currentPeriodEndUtc": "2024-02-29T23:59:59Z",
  "nextBillingAtUtc": null,  // 暂停期间不扣费
  "autoRenew": false
}
```

---

## 五、字段简化建议

根据您的业务场景，如果**目前只有一个产品方案**且**不需要分期计费**，可以考虑简化：

### 简化方案A：只保留服务时间，去掉计费期时间

**保留字段**：
- `serviceStartAtUtc`：服务开始时间
- `serviceEndAtUtc`：服务结束时间
- `nextBillingAtUtc`：下次续费时间（如果需要）

**删除字段**：
- `currentPeriodStartUtc`：如果不需要分期计费，可以删除
- `currentPeriodEndUtc`：如果不需要分期计费，可以删除

### 简化方案B：合并订阅状态和服务状态

**只保留一个状态字段**：
- `status`：统一的状态字段（如果订阅状态和服务状态总是一致的）

**或者保留更清晰的命名**：
- `paymentStatus`：支付状态（trial/active/paused/canceled/expired）
- `serviceStatus`：服务状态（trial/active/paused/suspended/ended）

---

## 六、推荐方案

根据您的业务需求（**只有一个产品方案，营养师暂不改派**），建议：

### 保留的字段（必需）

1. **状态字段**：
   - `subscriptionStatus`：订阅状态（如果需要支付功能）
   - `serviceStatus`：服务状态（如果服务状态和订阅状态可能不同步）

2. **时间字段**：
   - `serviceStartAtUtc`：服务开始时间（必需）
   - `serviceEndAtUtc`：服务结束时间（必需）
   - `nextBillingAtUtc`：下次续费时间（如果需要自动续费）

### 可选的字段（如果不需要分期计费）

- `currentPeriodStartUtc`：如果不需要分期计费，可以删除
- `currentPeriodEndUtc`：如果不需要分期计费，可以删除

### 建议

如果您的业务模式是：
- **一次性购买固定天数**（如90天、180天）
- **不需要分期扣费**
- **订阅状态和服务状态同步**

那么可以简化字段，只保留：
- `serviceStatus`（统一状态）
- `serviceStartAtUtc`
- `serviceEndAtUtc`

这样可以减少字段数量，降低复杂度。

---

## 七、总结

| 字段 | 用途 | 是否必需 | 说明 |
|------|------|----------|------|
| subscriptionStatus | 支付/合同状态 | 可选 | 如果支付状态和服务状态同步，可合并 |
| serviceStatus | 服务提供状态 | 必需 | 核心状态字段 |
| serviceStartAtUtc | 服务开始时间 | 必需 | 整个服务生命周期开始 |
| serviceEndAtUtc | 服务结束时间 | 必需 | 整个服务生命周期结束 |
| currentPeriodStartUtc | 当前计费期开始 | 可选 | 如果不需要分期计费，可删除 |
| currentPeriodEndUtc | 当前计费期结束 | 可选 | 如果不需要分期计费，可删除 |
| nextBillingAtUtc | 下次计费时间 | 可选 | 如果需要自动续费，保留 |


