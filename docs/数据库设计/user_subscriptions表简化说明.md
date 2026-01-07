# user_subscriptions 表简化说明

## 一、简化后的字段列表

### 核心字段（15个字段）

| 字段名 | 类型 | 说明 | 优先级 |
|--------|------|------|--------|
| subscriptionId | str(uuid) | 订阅ID（主键） | P0 |
| userId | str(uuid) | 全局用户ID | P0 |
| productPlanId | str(50) | 产品方案ID | P0 |
| serviceStatus | str(20) | 服务状态 | P0 |
| serviceStartAtUtc | timestamp | 服务开始时间（开营时间） | P0 |
| serviceEndAtUtc | timestamp | 服务结束时间 | P0 |
| orderChannel | str(50) | 下单渠道 | P0 |
| totalPrice | num | 订单总价格 | P0 |
| days | int | 服务天数 | P0 |
| productPlanName | str(100) | 产品方案名称（冗余） | P0 |
| serviceTags | array<str> | 服务标签 | P0 |
| endReason | str(50) | 结束原因 | P0 |
| notes | text | 备注 | P0 |
| isCurrent | bool | 是否当前订阅 | P0 |
| create_time | timestamp | 创建时间 | P0 |
| update_time | timestamp | 更新时间 | P0 |

## 二、删除的字段

### 删除原因：产品单一，不需要复杂的分期计费逻辑

1. **subscriptionStatus**（订阅状态）
   - 删除原因：与服务状态合并，统一使用serviceStatus

2. **currentPeriodStartUtc**（当前计费期开始）
   - 删除原因：不需要分期计费，一次性购买固定天数

3. **currentPeriodEndUtc**（当前计费期结束）
   - 删除原因：不需要分期计费，一次性购买固定天数

4. **nextBillingAtUtc**（下次计费时间）
   - 删除原因：不需要自动续费

5. **autoRenew**（是否自动续费）
   - 删除原因：不需要自动续费功能

6. **cancelAtEndOfPeriod**（到期自动取消）
   - 删除原因：不需要自动续费功能

7. **currentPrice**（当前期价格）
   - 删除原因：不需要分期计费，改为totalPrice（总价格）

8. **productPlanTier**（产品方案层级）
   - 删除原因：只有一个产品方案，不需要层级

9. **billingCycleDays**（计费周期天数）
   - 删除原因：不需要分期计费，直接使用days（服务天数）

## 三、服务状态（serviceStatus）说明

根据业务流程图，服务状态包括：

| 状态值 | 含义 | 触发条件 | 变更发起端 |
|--------|------|----------|------------|
| `observation` | 观察期 | 购买订单完成 | - |
| `waiting` | 等待期/开营等待期 | 生成减重方案、用户填完问卷 | coze |
| `active` | 服务中/减重指导期 | 开营定时任务 | java |
| `paused` | 暂停中 | 因客户诉求，主动暂停 | - |
| `terminated` | 终止 | 服务到期完成 | - |

## 四、字段使用示例

### 示例1：新用户购买90天服务

```json
{
  "subscriptionId": "sub-001",
  "userId": "user-001",
  "productPlanId": "plan-90d",
  "serviceStatus": "observation",  // 订单完成，进入观察期
  "serviceStartAtUtc": null,       // 还没开营
  "serviceEndAtUtc": null,         // 还没结束
  "orderChannel": "wechat_mp",
  "totalPrice": 999.00,
  "days": 90,
  "productPlanName": "90天减重方案",
  "serviceTags": [],
  "endReason": null,
  "notes": null,
  "isCurrent": true,
  "create_time": "2024-01-01T10:00:00Z"
}
```

### 示例2：用户填完问卷，进入等待期

```json
{
  "subscriptionId": "sub-001",
  "serviceStatus": "waiting",  // 更新为等待期
  "update_time": "2024-01-01T15:00:00Z"
}
```

### 示例3：开营定时任务触发，进入服务中

```json
{
  "subscriptionId": "sub-001",
  "serviceStatus": "active",  // 更新为服务中
  "serviceStartAtUtc": "2024-01-02T00:00:00Z",  // 开营时间
  "serviceEndAtUtc": "2024-04-01T23:59:59Z",    // 90天后结束
  "update_time": "2024-01-02T00:00:00Z"
}
```

### 示例4：用户主动暂停

```json
{
  "subscriptionId": "sub-001",
  "serviceStatus": "paused",  // 更新为暂停中
  "endReason": "paused_by_user",
  "update_time": "2024-01-15T10:00:00Z"
}
```

### 示例5：服务到期，终止

```json
{
  "subscriptionId": "sub-001",
  "serviceStatus": "terminated",  // 更新为终止
  "endReason": "expired",
  "update_time": "2024-04-01T23:59:59Z"
}
```

## 五、简化后的优势

1. **字段减少**：从24个字段减少到16个字段（减少33%）
2. **逻辑简化**：不再需要处理分期计费、自动续费等复杂逻辑
3. **状态清晰**：只有一个状态字段，状态流转简单明确
4. **维护容易**：字段少，维护成本低

## 六、保留的冗余字段说明

- **productPlanName**：保留冗余字段，避免每次查询都需要JOIN product_plans表，提高查询性能


