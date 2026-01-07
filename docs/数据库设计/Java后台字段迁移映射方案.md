# Java后台字段迁移映射方案

## 一、概述

本文档说明Java后台现有字段如何映射到新的表结构中，包括字段迁移、删除、新增和转换规则。

---

## 二、用户表（表1）字段映射

### 2.1 迁移到 user_core 表的字段

| Java后台字段 | 新表字段 | 字段类型 | 处理方式 | 说明 |
|-------------|---------|---------|---------|------|
| id | id | int4 → 保留 | ✅ 保留 | 主键ID，保持不变 |
| nick_name | nickname | varchar(100) | 🔄 重命名 | 统一字段名 |
| wx_name | (删除) | varchar(100) | ❌ 删除 | 与nick_name重复，合并到nickname |
| wxid | wxid | varchar(100) | ✅ 保留 | 群成员wxid（保留兼容） |
| gender | gender | varchar(5) | ✅ 保留 | 需转换为枚举：male/female/other |
| age | age | int4 | ✅ 保留 | 保持不变 |
| height | height | float8 | ✅ 保留 | 单位：米 |
| occupation | occupation | varchar(100) | ✅ 保留 | 保持不变 |
| weight | weight | float8 | ✅ 保留 | 当前体重快照 |
| start_weight | start_weight | float8 | ✅ 保留 | 开始体重 |
| target_weight | target_weight | float8 | ⚠️ 迁移 | 迁移到user_goals表（版本化） |
| bmr | bmr | float8 | ⚠️ 迁移 | 迁移到user_goals表（版本化） |
| pal | pal | float8 | ⚠️ 迁移 | 迁移到user_goals表（版本化） |
| daily_calorie | daily_calorie | int4 | ⚠️ 迁移 | 迁移到user_goals表（版本化） |
| fields | fields | jsonb | ✅ 保留 | 问卷数据（必填） |
| conversation_id | conversation_id | varchar(100) | ✅ 保留 | 智能体会话id |
| create_time | create_time | timestamp | ✅ 保留 | 创建时间 |
| update_time | update_time | timestamp | ✅ 保留 | 更新时间 |

#### 需要新增的字段（user_core）

| 字段名 | 类型 | 说明 | 来源 |
|--------|------|------|------|
| userId | varchar(uuid) | 全局用户ID | 新增，建议使用UUID |
| wechatOpenId | varchar(100) | 微信OpenId | 新增 |
| unionId | varchar(100) | 微信UnionId | 新增（可空） |
| phoneEncrypted | varchar(255) | 加密手机号 | 从user_contacts表迁移 |
| phoneMasked | varchar(50) | 脱敏手机号 | 从user_contacts表迁移 |
| phoneVerifiedAt | timestamp | 手机号验证时间 | 从user_contacts表迁移 |
| firstRegisteredAtUtc | timestamp | 首次注册时间 | 新增 |
| lastActiveAtUtc | timestamp | 最近活跃时间 | 新增 |
| timeZone | varchar(50) | 时区 | 新增 |
| acquisitionChannel | varchar(50) | 获客渠道 | 新增 |

### 2.2 迁移到 user_goals 表的字段

| Java后台字段 | user_goals字段 | 说明 |
|-------------|---------------|------|
| target_weight | targetWeightKg | 目标体重（版本化） |
| daily_calorie | dailyCaloriesKcal | 日目标卡路里（版本化） |
| bmr | (需计算) | 基础代谢率（可通过用户信息计算，或从user_core迁移） |
| pal | (需计算) | PAL系数（可通过用户信息计算，或从user_core迁移） |

**注意**：这些字段需要根据用户当前版本的目标数据创建user_goals记录。

### 2.3 迁移到 user_subscriptions 表的字段

| Java后台字段 | user_subscriptions字段 | 说明 |
|-------------|----------------------|------|
| days | days | 方案天数 |
| tier | tier / productPlanTier | 服务等级（保留tier字段用于兼容） |
| service_status | serviceStatus | 服务状态（需转换为varchar枚举） |
| opening_date | opening_date | 开营日期 |
| dietitian_wxid | dietitian_wxid | 营养师wxid（保留兼容） |
| pause_days | pause_days | 累计暂停服务天数 |
| pause_start_time | pause_start_time | 暂停开始时间 |
| is_90d_whitelist | is_90d_whitelist | 90天运营方案白名单 |
| chatroom_id | chatroom_id | 群id |
| report_content | report_content | 3天观察期报告 |
| owner | owner | 所有者（后台管理） |
| remark | remark | 备注 |

**需要新增的字段**：
- subscriptionId（主键）
- userId（关联user_core）
- productPlanId（关联product_plans）
- isCurrent（标识当前订阅）
- serviceStartAtUtc
- serviceEndAtUtc
- autoRenew
- nextBillingAtUtc
- 等其他订阅相关字段

---

## 三、周期表（表2）字段映射

### 3.1 迁移到 user_subscriptions 表的字段

| Java后台字段 | user_subscriptions字段 | 说明 |
|-------------|----------------------|------|
| id | subscriptionId | 主键ID（建议改为UUID） |
| customer_id | userId | 改为userId（关联user_core） |
| opening_date | opening_date | 开营日期 |
| days | days | 开营天数 |
| cycle_num | cycle_num | 周期数 |
| current_cycle | current_cycle | 当前周期 |
| cycle_start_time | cycle_start_time | 周期开始时间 |
| cycle_end_time | cycle_end_time | 周期结束时间 |
| cycle_status | cycle_status | 周期状态 |
| weight | weight | 初始体重（方案开始时的体重） |
| target_weight | target_weight | 目标体重 |
| end_weight | end_weight | 结束体重（方案结束时的体重） |
| nick_name | (删除) | 冗余字段，不迁移 |
| create_time | create_time | 创建时间 |
| update_time | update_time | 更新时间 |

**注意**：表2的customer_id需要映射到userId，nick_name是冗余字段不需要迁移。

---

## 四、字段处理规则

### 4.1 字段类型转换

#### 枚举字段转换

**service_status（int → varchar）**
```java
// 转换规则
1 → "observation"      // 观察期
2 → "waiting"         // 等待期
3 → "active"          // 服务中
5 → "ended"           // 已终止

// 建议创建转换函数
public String convertServiceStatus(int status) {
    switch (status) {
        case 1: return "observation";
        case 2: return "waiting";
        case 3: return "active";
        case 5: return "ended";
        default: return "unknown";
    }
}
```

**gender（varchar → enum）**
```java
// 转换规则
"男" → "male"
"女" → "female"
其他 → "other"

// 建议统一为英文枚举
public String normalizeGender(String gender) {
    if (gender == null) return null;
    switch (gender.toLowerCase()) {
        case "男":
        case "male":
        case "m": return "male";
        case "女":
        case "female":
        case "f": return "female";
        default: return "other";
    }
}
```

#### 时间字段转换

**时区处理**
```java
// 所有时间字段需要转换为UTC
// Java后台可能存储的是本地时间，需要转换

public Timestamp convertToUtc(Timestamp localTime, String timeZone) {
    // 使用timeZone将本地时间转换为UTC
    // 示例：如果存储的是北京时间，需要转换为UTC
}
```

### 4.2 字段合并规则

#### nick_name 和 wx_name 合并

```java
// 合并逻辑
public String mergeNickname(String nickName, String wxName) {
    // 优先使用nick_name，如果为空则使用wx_name
    if (nickName != null && !nickName.trim().isEmpty()) {
        return nickName.trim();
    }
    return wxName != null ? wxName.trim() : null;
}
```

### 4.3 数据迁移策略

#### user_core 字段迁移

```sql
-- 迁移步骤
-- 1. 创建新字段
ALTER TABLE user_core ADD COLUMN userId VARCHAR(36);
ALTER TABLE user_core ADD COLUMN wechatOpenId VARCHAR(100);
ALTER TABLE user_core ADD COLUMN phoneEncrypted VARCHAR(255);
-- ... 其他新字段

-- 2. 合并nick_name和wx_name
UPDATE user_core 
SET nickname = COALESCE(NULLIF(nick_name, ''), NULLIF(wx_name, ''), '')
WHERE nickname IS NULL;

-- 3. 转换gender为枚举
UPDATE user_core 
SET gender = CASE 
    WHEN gender = '男' THEN 'male'
    WHEN gender = '女' THEN 'female'
    ELSE 'other'
END;

-- 4. 生成userId（如果为空）
UPDATE user_core 
SET userId = gen_random_uuid()::text 
WHERE userId IS NULL;

-- 5. 删除冗余字段（可选，建议先保留一段时间）
-- ALTER TABLE user_core DROP COLUMN wx_name;
```

#### user_goals 数据迁移

```sql
-- 从user_core迁移目标相关字段到user_goals
INSERT INTO user_goals (
    userId, version, targetWeightKg, dailyCaloriesKcal,
    status, source, setAtUtc, effectiveFromUtc
)
SELECT 
    userId,
    1 as version,  -- 第一个版本
    target_weight,
    daily_calorie,
    'active' as status,
    'system' as source,
    COALESCE(create_time, NOW()) as setAtUtc,
    COALESCE(create_time, NOW()) as effectiveFromUtc
FROM user_core
WHERE target_weight IS NOT NULL OR daily_calorie IS NOT NULL;
```

#### user_subscriptions 数据迁移

```sql
-- 从表1和表2合并数据到user_subscriptions
-- 需要根据业务逻辑确定如何合并

-- 方案1：以表2为主，补充表1的字段
INSERT INTO user_subscriptions (
    subscriptionId, userId, productPlanId,
    days, tier, serviceStatus, opening_date,
    cycle_num, current_cycle, cycle_start_time, cycle_end_time, cycle_status,
    weight, target_weight, end_weight,
    dietitian_wxid, chatroom_id, pause_days, pause_start_time,
    isCurrent, create_time, update_time
)
SELECT 
    gen_random_uuid()::text as subscriptionId,
    COALESCE(table2.customer_id, table1.wxid) as userId,  -- 需要映射userId
    NULL as productPlanId,  -- 需要关联product_plans
    COALESCE(table2.days, table1.days) as days,
    table1.tier,
    CASE table1.service_status  -- 转换枚举
        WHEN 1 THEN 'observation'
        WHEN 2 THEN 'waiting'
        WHEN 3 THEN 'active'
        WHEN 5 THEN 'ended'
        ELSE 'unknown'
    END as serviceStatus,
    COALESCE(table2.opening_date, table1.opening_date) as opening_date,
    table2.cycle_num,
    table2.current_cycle,
    table2.cycle_start_time,
    table2.cycle_end_time,
    table2.cycle_status,
    table2.weight,
    COALESCE(table2.target_weight, table1.target_weight) as target_weight,
    table2.end_weight,
    table1.dietitian_wxid,
    table1.chatroom_id,
    table1.pause_days,
    table1.pause_start_time,
    true as isCurrent,  -- 当前订阅
    COALESCE(table2.create_time, table1.create_time) as create_time,
    COALESCE(table2.update_time, table1.update_time) as update_time
FROM table1 
LEFT JOIN table2 ON table1.wxid = table2.customer_id;  -- 需要确定关联关系
```

---

## 五、字段删除计划

### 5.1 立即删除的字段

| 表名 | 字段名 | 原因 |
|------|--------|------|
| user_core | wx_name | 与nick_name重复 |

### 5.2 保留一段时间后删除的字段

| 表名 | 字段名 | 保留期 | 原因 |
|------|--------|--------|------|
| user_core | target_weight | 3个月 | 迁移到user_goals后删除 |
| user_core | daily_calorie | 3个月 | 迁移到user_goals后删除 |
| user_core | bmr | 3个月 | 迁移到user_goals后删除 |
| user_core | pal | 3个月 | 迁移到user_goals后删除 |
| user_subscriptions | customer_id | 6个月 | 替换为userId后删除 |
| user_subscriptions | tier | 6个月 | 替换为productPlanTier后删除 |
| user_subscriptions | service_status | 6个月 | 替换为serviceStatus后删除 |

### 5.3 永久保留的兼容字段

| 表名 | 字段名 | 原因 |
|------|--------|------|
| user_core | wxid | 保留兼容，可能其他地方在使用 |
| user_subscriptions | dietitian_wxid | 保留兼容，可能其他地方在使用 |

---

## 六、数据迁移步骤

### 步骤1：准备阶段

1. **备份现有数据**
   ```sql
   -- 备份所有相关表
   CREATE TABLE user_core_backup AS SELECT * FROM user_core;
   CREATE TABLE table1_backup AS SELECT * FROM java_table1;
   CREATE TABLE table2_backup AS SELECT * FROM java_table2;
   ```

2. **创建新字段**
   - 在user_core表中添加新字段（userId, wechatOpenId等）
   - 创建user_goals表
   - 创建user_subscriptions表（或修改现有表）

### 步骤2：数据迁移

1. **迁移user_core基础数据**
   ```sql
   -- 更新现有记录的字段
   UPDATE user_core SET nickname = COALESCE(nick_name, wx_name);
   UPDATE user_core SET gender = normalize_gender(gender);
   -- ... 其他字段更新
   ```

2. **生成userId**
   ```sql
   -- 为现有用户生成userId
   UPDATE user_core SET userId = gen_random_uuid()::text WHERE userId IS NULL;
   ```

3. **迁移user_goals数据**
   ```sql
   -- 从user_core迁移目标数据到user_goals
   -- （见上面的SQL示例）
   ```

4. **迁移user_subscriptions数据**
   ```sql
   -- 合并表1和表2的数据到user_subscriptions
   -- （见上面的SQL示例）
   ```

### 步骤3：验证阶段

1. **数据完整性检查**
   ```sql
   -- 检查是否有数据丢失
   SELECT COUNT(*) FROM user_core_backup;
   SELECT COUNT(*) FROM user_core;
   
   -- 检查关联关系
   SELECT COUNT(*) FROM user_core WHERE userId IS NULL;
   SELECT COUNT(*) FROM user_subscriptions WHERE userId IS NULL;
   ```

2. **业务逻辑验证**
   - 验证所有业务功能正常
   - 验证数据查询正确
   - 验证关联关系正确

### 步骤4：清理阶段

1. **删除冗余字段**（3-6个月后）
   ```sql
   -- 确保所有代码都已更新后，删除旧字段
   ALTER TABLE user_core DROP COLUMN wx_name;
   ALTER TABLE user_core DROP COLUMN target_weight;
   -- ... 其他冗余字段
   ```

2. **删除备份表**（确认无误后）
   ```sql
   DROP TABLE user_core_backup;
   DROP TABLE table1_backup;
   DROP TABLE table2_backup;
   ```

---

## 七、Java代码修改建议

### 7.1 Entity类修改

#### UserCore实体类

```java
@Entity
@Table(name = "user_core")
public class UserCore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;  // 保留
    
    @Column(name = "user_id", unique = true, nullable = false)
    private String userId;  // 新增：全局用户ID
    
    @Column(name = "nickname")
    private String nickname;  // 重命名：原来是nick_name
    
    // 删除wx_name字段
    
    @Column(name = "gender")
    @Enumerated(EnumType.STRING)
    private Gender gender;  // 改为枚举类型
    
    // ... 其他字段
    
    // 新增字段
    @Column(name = "phone_encrypted")
    private String phoneEncrypted;
    
    @Column(name = "phone_masked")
    private String phoneMasked;
    
    // 标记为废弃的字段（保留一段时间）
    @Deprecated
    @Column(name = "target_weight")
    private Double targetWeight;  // 逐步迁移到UserGoals
    
    @Deprecated
    @Column(name = "daily_calorie")
    private Integer dailyCalorie;  // 逐步迁移到UserGoals
}
```

#### UserSubscriptions实体类

```java
@Entity
@Table(name = "user_subscriptions")
public class UserSubscriptions {
    @Id
    @Column(name = "subscription_id")
    private String subscriptionId;  // 主键
    
    @Column(name = "user_id", nullable = false)
    private String userId;  // 关联user_core
    
    @Column(name = "service_status")
    @Enumerated(EnumType.STRING)
    private ServiceStatus serviceStatus;  // 改为枚举
    
    @Column(name = "is_current", nullable = false)
    private Boolean isCurrent;  // 新增：标识当前订阅
    
    // 保留兼容字段（标记为废弃）
    @Deprecated
    @Column(name = "tier")
    private String tier;  // 逐步替换为productPlanTier
    
    @Deprecated
    @Column(name = "service_status_old")
    private Integer serviceStatusOld;  // 保留原int类型字段（如果还需要）
    
    // ... 其他字段
}
```

### 7.2 Service层修改

```java
@Service
public class UserService {
    
    // 获取用户信息时，同时获取目标信息
    public UserInfoDTO getUserInfo(String userId) {
        UserCore user = userCoreRepository.findByUserId(userId);
        
        // 从user_goals获取当前活跃目标
        UserGoal activeGoal = userGoalRepository.findActiveGoal(userId);
        
        UserInfoDTO dto = new UserInfoDTO();
        dto.setUser(user);
        dto.setTargetWeight(activeGoal != null ? activeGoal.getTargetWeightKg() : null);
        dto.setDailyCalories(activeGoal != null ? activeGoal.getDailyCaloriesKcal() : null);
        
        return dto;
    }
    
    // 更新目标时，创建新的user_goals版本
    public void updateUserGoal(String userId, GoalUpdateRequest request) {
        UserGoal currentGoal = userGoalRepository.findActiveGoal(userId);
        
        if (currentGoal != null) {
            // 将当前目标标记为archived
            currentGoal.setStatus(GoalStatus.ARCHIVED);
            currentGoal.setEffectiveToUtc(Instant.now());
            userGoalRepository.save(currentGoal);
        }
        
        // 创建新版本目标
        UserGoal newGoal = new UserGoal();
        newGoal.setUserId(userId);
        newGoal.setVersion(currentGoal != null ? currentGoal.getVersion() + 1 : 1);
        newGoal.setTargetWeightKg(request.getTargetWeight());
        newGoal.setStatus(GoalStatus.ACTIVE);
        newGoal.setEffectiveFromUtc(Instant.now());
        // ... 设置其他字段
        
        userGoalRepository.save(newGoal);
    }
}
```

### 7.3 数据转换工具类

```java
@Component
public class DataMigrationUtil {
    
    /**
     * 转换服务状态（int → String）
     */
    public String convertServiceStatus(Integer oldStatus) {
        if (oldStatus == null) return null;
        
        switch (oldStatus) {
            case 1: return "observation";
            case 2: return "waiting";
            case 3: return "active";
            case 5: return "ended";
            default: return "unknown";
        }
    }
    
    /**
     * 转换性别（中文 → 英文枚举）
     */
    public String normalizeGender(String gender) {
        if (gender == null || gender.trim().isEmpty()) {
            return null;
        }
        
        String normalized = gender.trim().toLowerCase();
        switch (normalized) {
            case "男":
            case "male":
            case "m":
                return "male";
            case "女":
            case "female":
            case "f":
                return "female";
            default:
                return "other";
        }
    }
    
    /**
     * 合并昵称字段
     */
    public String mergeNickname(String nickName, String wxName) {
        if (nickName != null && !nickName.trim().isEmpty()) {
            return nickName.trim();
        }
        return wxName != null ? wxName.trim() : null;
    }
}
```

---

## 八、注意事项

### 8.1 数据一致性

1. **外键关联**：确保userId正确关联，避免数据孤岛
2. **时间同步**：user_subscriptions的isCurrent字段需要确保唯一性
3. **版本管理**：user_goals的版本号需要正确递增

### 8.2 性能考虑

1. **索引优化**：为userId、subscriptionId等关键字段建立索引
2. **查询优化**：避免N+1查询，使用JOIN或批量查询
3. **数据量**：如果数据量很大，考虑分批次迁移

### 8.3 回滚方案

1. **保留备份**：迁移前完整备份所有数据
2. **灰度发布**：先在测试环境验证，再逐步上线
3. **双写策略**：过渡期间可以同时写入新旧字段

---

## 九、迁移检查清单

### 迁移前检查

- [ ] 数据备份完成
- [ ] 新表结构创建完成
- [ ] 数据迁移脚本准备完成
- [ ] 单元测试编写完成
- [ ] 测试环境验证通过

### 迁移中检查

- [ ] 数据迁移执行完成
- [ ] 数据完整性验证通过
- [ ] 关联关系验证通过
- [ ] 业务功能验证通过

### 迁移后检查

- [ ] 监控系统正常运行
- [ ] 错误日志无异常
- [ ] 性能指标正常
- [ ] 用户反馈正常

---

## 十、总结

### 字段处理总结

| 处理方式 | 字段数量 | 说明 |
|---------|---------|------|
| ✅ 保留 | ~15个 | 直接保留在user_core表 |
| 🔄 重命名 | 1个 | nick_name → nickname |
| ❌ 删除 | 1个 | wx_name（重复字段） |
| ⚠️ 迁移 | ~4个 | 迁移到user_goals表 |
| ⚠️ 迁移 | ~12个 | 迁移到user_subscriptions表 |
| ➕ 新增 | ~10个 | 新增字段 |

### 关键建议

1. **渐进式迁移**：不要一次性删除所有旧字段，保留一段时间用于兼容
2. **数据验证**：迁移后务必验证数据完整性和业务逻辑
3. **代码更新**：同步更新Java代码，使用新的字段和表结构
4. **文档更新**：更新API文档和数据库文档


