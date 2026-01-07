# nutritionDetails字段写入格式规范

## 一、概述

本文档定义 `meals.nutritionDetails` 字段的API写入格式、数据验证规则和错误处理规范。

---

## 二、API接口格式

### 2.1 创建/更新餐食记录接口

**接口路径**：`POST /api/meals` 或 `PUT /api/meals/{mealId}`

**请求格式**：

```json
{
  "userId": "uuid-string",
  "mealTimeUtc": "2024-01-15T12:00:00Z",
  "timeZone": "Asia/Shanghai",
  "mealType": "lunch",
  "mealDescription": "白米饭200g，清蒸鱼150g，炒青菜100g",
  "caloriesKcal": 485,
  "ingredients": [
    {
      "name": "白米饭",
      "portionGram": 200,
      "unit": "g",
      "note": "粳米"
    },
    {
      "name": "清蒸鱼",
      "portionGram": 150,
      "unit": "g",
      "note": "鲈鱼"
    },
    {
      "name": "炒青菜",
      "portionGram": 100,
      "unit": "g"
    }
  ],
  "nutrition": {
    "proteinG": 25.5,
    "fatG": 15.2,
    "carbG": 45.8,
    "fiberG": 8.5,
    "sugarG": 12.3,
    "sodiumMg": 580
  },
  "nutritionDetails": {
    "macro": {
      "proteinG": 25.5,
      "fatG": 15.2,
      "carbG": 45.8,
      "fiberG": 8.5,
      "sugarG": 12.3,
      "starchG": 33.5
    },
    "minerals": {
      "sodiumMg": 580,
      "calciumMg": 280,
      "ironMg": 8.5,
      "potassiumMg": 420,
      "magnesiumMg": 85,
      "phosphorusMg": 320,
      "zincMg": 5.2
    },
    "vitamins": {
      "vitaminAMg": 0.8,
      "vitaminCMg": 65,
      "vitaminDMg": 0.015,
      "vitaminEMg": 8.5,
      "vitaminB1Mg": 0.8,
      "vitaminB2Mg": 0.9,
      "vitaminB3Mg": 12,
      "vitaminB6Mg": 1.2,
      "vitaminB9Mg": 0.2,
      "vitaminB12Mg": 0.0025
    },
    "fattyAcids": {
      "saturatedFatG": 5.2,
      "monounsaturatedFatG": 6.8,
      "polyunsaturatedFatG": 3.2,
      "transFatG": 0.1,
      "omega3G": 1.2,
      "omega6G": 2.0
    },
    "aminoAcids": {
      "tryptophanG": 0.25,
      "threonineG": 0.85,
      "leucineG": 1.65,
      "lysineG": 1.35
    },
    "other": {
      "cholesterolMg": 85,
      "caffeineMg": 0,
      "alcoholG": 0,
      "waterG": 180
    }
  },
  "ratio": {
    "vegPct": 40,
    "proteinPct": 30,
    "carbPct": 30
  },
  "rawText": "午餐：白米饭、清蒸鱼、炒青菜",
  "rawImages": [
    {
      "url": "https://example.com/image1.jpg"
    }
  ]
}
```

### 2.2 响应格式

**成功响应（201 Created / 200 OK）**：

```json
{
  "success": true,
  "data": {
    "mealId": "uuid-string",
    "userId": "uuid-string",
    "mealTimeUtc": "2024-01-15T12:00:00Z",
    "caloriesKcal": 485,
    "nutritionDetails": {
      // 同请求格式，返回完整数据
    },
    "create_time": "2024-01-15T12:05:00Z",
    "update_time": "2024-01-15T12:05:00Z"
  }
}
```

**错误响应（400 Bad Request）**：

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "数据验证失败",
    "details": [
      {
        "field": "nutritionDetails.macro.proteinG",
        "message": "蛋白质值不能为负数",
        "value": -5.0
      },
      {
        "field": "nutritionDetails.macro",
        "message": "宏量营养素至少需要提供proteinG、fatG、carbG中的一个",
        "value": {}
      }
    ]
  }
}
```

---

## 三、数据写入格式规范

### 3.1 基本格式要求

1. **JSON结构**：`nutritionDetails` 必须是有效的JSON对象
2. **分类结构**：必须包含6个分类对象（可空）：
   - `macro`（宏量营养素）
   - `minerals`（常量元素）
   - `vitamins`（维生素）
   - `fattyAcids`（脂肪酸）
   - `aminoAcids`（氨基酸）
   - `other`（其他成分）

3. **数据类型**：
   - 所有数值字段必须是 `number` 类型（不允许字符串）
   - 小数精度建议保留2位小数
   - 允许 `null` 值（表示未检测）

### 3.2 分类格式要求

#### 3.2.1 macro（宏量营养素）

```json
{
  "macro": {
    "proteinG": 25.5,      // 必填：>= 0
    "fatG": 15.2,          // 必填：>= 0
    "carbG": 45.8,         // 必填：>= 0
    "fiberG": 8.5,         // 可选：>= 0
    "sugarG": 12.3,        // 可选：>= 0
    "starchG": 33.5        // 可选：>= 0
  }
}
```

**规则**：
- `proteinG`、`fatG`、`carbG` 至少有一个不为null
- 所有值必须 >= 0
- `fiberG + sugarG + starchG` 应该 <= `carbG`（允许误差5%）

#### 3.2.2 minerals（常量元素）

```json
{
  "minerals": {
    "sodiumMg": 580,       // 可选：>= 0
    "calciumMg": 280,      // 可选：>= 0
    "ironMg": 8.5,         // 可选：>= 0
    "potassiumMg": 420,    // 可选：>= 0
    "magnesiumMg": 85,     // 可选：>= 0
    "phosphorusMg": 320,   // 可选：>= 0
    "zincMg": 5.2,         // 可选：>= 0
    "seleniumMg": 0.055,   // 可选：>= 0
    "copperMg": 0.9,        // 可选：>= 0
    "manganeseMg": 1.8,    // 可选：>= 0
    "chromiumMg": 0.025    // 可选：>= 0
  }
}
```

**规则**：
- 所有字段可选，但至少提供一个
- 所有值必须 >= 0
- 单位统一为毫克（Mg）

#### 3.2.3 vitamins（维生素）

```json
{
  "vitamins": {
    "vitaminAMg": 0.8,      // 可选：>= 0（视黄醇当量，毫克）
    "vitaminCMg": 65,       // 可选：>= 0（毫克）
    "vitaminDMg": 0.015,    // 可选：>= 0（微克）
    "vitaminEMg": 8.5,      // 可选：>= 0（毫克）
    "vitaminK1Mg": 0.08,    // 可选：>= 0（微克）
    "vitaminB1Mg": 0.8,     // 可选：>= 0（毫克）
    "vitaminB2Mg": 0.9,     // 可选：>= 0（毫克）
    "vitaminB3Mg": 12,      // 可选：>= 0（毫克）
    "vitaminB5Mg": 3.5,     // 可选：>= 0（毫克）
    "vitaminB6Mg": 1.2,     // 可选：>= 0（毫克）
    "vitaminB9Mg": 0.2,     // 可选：>= 0（微克）
    "vitaminB12Mg": 0.0025, // 可选：>= 0（微克）
    "biotinMg": 0.03,       // 可选：>= 0（微克）
    "cholineMg": 250        // 可选：>= 0（毫克）
  }
}
```

**规则**：
- 所有字段可选
- 所有值必须 >= 0
- 注意单位：维生素D、K1、B9、B12、生物素为微克，其他为毫克

#### 3.2.4 fattyAcids（脂肪酸）

```json
{
  "fattyAcids": {
    "saturatedFatG": 5.2,           // 可选：>= 0（克）
    "monounsaturatedFatG": 6.8,     // 可选：>= 0（克）
    "polyunsaturatedFatG": 3.2,      // 可选：>= 0（克）
    "transFatG": 0.1,                // 可选：>= 0（克）
    "omega3G": 1.2,                  // 可选：>= 0（克）
    "omega6G": 2.0,                  // 可选：>= 0（克）
    "omega9G": 6.0                   // 可选：>= 0（克）
  }
}
```

**规则**：
- 所有字段可选
- 所有值必须 >= 0
- 一致性检查：`saturatedFatG + monounsaturatedFatG + polyunsaturatedFatG` 应该约等于 `fatG`（允许误差10%）

#### 3.2.5 aminoAcids（氨基酸）

```json
{
  "aminoAcids": {
    "tryptophanG": 0.25,
    "threonineG": 0.85,
    "isoleucineG": 0.95,
    "leucineG": 1.65,
    "lysineG": 1.35,
    "methionineG": 0.45,
    "cystineG": 0.35,
    "phenylalanineG": 1.05,
    "tyrosineG": 0.75,
    "valineG": 1.15,
    "arginineG": 1.25,
    "histidineG": 0.55,
    "alanineG": 1.05,
    "asparticAcidG": 1.85,
    "glutamicAcidG": 3.15,
    "glycineG": 0.85,
    "prolineG": 0.95,
    "serineG": 0.85
  }
}
```

**规则**：
- 所有字段可选
- 所有值必须 >= 0
- 氨基酸总和应该约等于 `proteinG`（允许误差20%，因为蛋白质分子量不同）

#### 3.2.6 other（其他成分）

```json
{
  "other": {
    "cholesterolMg": 85,      // 可选：>= 0（毫克）
    "caffeineMg": 0,          // 可选：>= 0（毫克）
    "alcoholG": 0,            // 可选：>= 0（克）
    "waterG": 180,            // 可选：>= 0（克）
    "ashG": 2.5,               // 可选：>= 0（克）
    "carotenoidsMg": 2.5,      // 可选：>= 0（毫克）
    "lycopeneMg": 0.8,         // 可选：>= 0（毫克）
    "luteinMg": 1.2,           // 可选：>= 0（毫克）
    "phytosterolsMg": 85       // 可选：>= 0（毫克）
  }
}
```

**规则**：
- 所有字段可选
- 所有值必须 >= 0

---

## 四、数据验证规则

### 4.1 必填验证

| 验证项 | 规则 | 错误码 |
|--------|------|--------|
| nutritionDetails类型 | 必须是对象 | `INVALID_TYPE` |
| macro对象 | 如果提供nutritionDetails，macro必须存在 | `MISSING_MACRO` |
| macro.proteinG/fatG/carbG | 至少有一个不为null | `MISSING_MACRO_NUTRIENT` |

### 4.2 数值验证

| 验证项 | 规则 | 错误码 |
|--------|------|--------|
| 数值类型 | 必须是number类型，不允许字符串 | `INVALID_NUMBER_TYPE` |
| 非负值 | 所有数值必须 >= 0 | `NEGATIVE_VALUE` |
| 精度 | 建议保留2位小数，超过4位自动四舍五入 | `PRECISION_WARNING` |

### 4.3 一致性验证

| 验证项 | 规则 | 允许误差 | 错误码 |
|--------|------|----------|--------|
| 脂肪总和 | `fatG` ≈ `saturatedFatG + monounsaturatedFatG + polyunsaturatedFatG` | 10% | `FAT_SUM_MISMATCH` |
| 碳水分解 | `fiberG + sugarG + starchG` ≤ `carbG` | 5% | `CARB_DECOMPOSE_MISMATCH` |
| 蛋白质分解 | 氨基酸总和 ≈ `proteinG` | 20% | `PROTEIN_SUM_MISMATCH` |

### 4.4 合理性验证

| 验证项 | 规则 | 错误码 |
|--------|------|--------|
| 热量计算 | `caloriesKcal` ≈ `proteinG*4 + carbG*4 + fatG*9` | 5% | `CALORIE_CALCULATION_MISMATCH` |
| 数值范围 | 单餐营养素值不应超过合理范围（如proteinG > 200g） | `VALUE_OUT_OF_RANGE` |

---

## 五、错误处理

### 5.1 错误码定义

| 错误码 | HTTP状态码 | 说明 |
|--------|-----------|------|
| `INVALID_TYPE` | 400 | nutritionDetails类型错误 |
| `MISSING_MACRO` | 400 | 缺少macro对象 |
| `MISSING_MACRO_NUTRIENT` | 400 | macro中缺少必需的营养素 |
| `INVALID_NUMBER_TYPE` | 400 | 数值类型错误 |
| `NEGATIVE_VALUE` | 400 | 数值为负数 |
| `PRECISION_WARNING` | 200 | 精度警告（不影响写入） |
| `FAT_SUM_MISMATCH` | 400 | 脂肪总和不一致 |
| `CARB_DECOMPOSE_MISMATCH` | 400 | 碳水化合物分解不一致 |
| `PROTEIN_SUM_MISMATCH` | 400 | 蛋白质分解不一致 |
| `CALORIE_CALCULATION_MISMATCH` | 400 | 热量计算不一致 |
| `VALUE_OUT_OF_RANGE` | 400 | 数值超出合理范围 |

### 5.2 错误响应格式

```json
{
  "success": false,
  "error": {
    "code": "FAT_SUM_MISMATCH",
    "message": "脂肪总和与分解值不一致",
    "details": [
      {
        "field": "nutritionDetails.macro.fatG",
        "message": "总脂肪为15.2g，但分解值总和为16.5g，超出允许误差10%",
        "value": 15.2,
        "expected": {
          "sum": 16.5,
          "tolerance": 0.1
        }
      }
    ]
  }
}
```

---

## 六、处理流程

### 6.1 写入流程

```
1. 接收请求
   ↓
2. 验证JSON格式
   ↓
3. 验证必填字段（macro对象、至少一个宏量营养素）
   ↓
4. 验证数值类型和范围（非负数、合理范围）
   ↓
5. 验证一致性（脂肪总和、碳水分解等）
   ↓
6. 自动同步更新nutrition字段（从nutritionDetails.macro提取）
   ↓
7. 写入数据库
   ↓
8. 返回成功响应
```

### 6.2 数据同步规则

**写入nutritionDetails时，自动同步到nutrition字段**：

```javascript
// 伪代码示例
if (nutritionDetails && nutritionDetails.macro) {
  nutrition = {
    proteinG: nutritionDetails.macro.proteinG,
    fatG: nutritionDetails.macro.fatG,
    carbG: nutritionDetails.macro.carbG,
    fiberG: nutritionDetails.macro.fiberG,
    sugarG: nutritionDetails.macro.sugarG,
    sodiumMg: nutritionDetails.minerals?.sodiumMg
  };
}
```

---

## 七、示例代码

### 7.1 完整写入示例（JavaScript）

```javascript
// 创建餐食记录，包含完整nutritionDetails
const mealData = {
  userId: "user-uuid",
  mealTimeUtc: "2024-01-15T12:00:00Z",
  timeZone: "Asia/Shanghai",
  mealType: "lunch",
  mealDescription: "白米饭200g，清蒸鱼150g，炒青菜100g",
  caloriesKcal: 485,
  nutritionDetails: {
    macro: {
      proteinG: 25.5,
      fatG: 15.2,
      carbG: 45.8,
      fiberG: 8.5,
      sugarG: 12.3,
      starchG: 33.5
    },
    minerals: {
      sodiumMg: 580,
      calciumMg: 280,
      ironMg: 8.5,
      potassiumMg: 420
    },
    vitamins: {
      vitaminAMg: 0.8,
      vitaminCMg: 65,
      vitaminB1Mg: 0.8,
      vitaminB2Mg: 0.9
    },
    fattyAcids: {
      saturatedFatG: 5.2,
      monounsaturatedFatG: 6.8,
      polyunsaturatedFatG: 3.2,
      transFatG: 0.1
    },
    other: {
      cholesterolMg: 85,
      waterG: 180
    }
  }
};

// 调用API
const response = await fetch('/api/meals', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(mealData)
});
```

### 7.2 最小写入示例（只写宏量营养素）

```javascript
// 只提供必需的宏量营养素
const minimalMealData = {
  userId: "user-uuid",
  mealTimeUtc: "2024-01-15T12:00:00Z",
  mealType: "breakfast",
  mealDescription: "白粥200g",
  caloriesKcal: 100,
  nutritionDetails: {
    macro: {
      proteinG: 3.0,
      fatG: 0.5,
      carbG: 22.0
    }
  }
};
```

### 7.3 更新nutritionDetails示例

```javascript
// 更新现有餐食的营养素信息
const updateData = {
  nutritionDetails: {
    macro: {
      proteinG: 30.0,  // 更新蛋白质值
      fatG: 15.2,
      carbG: 45.8
    },
    // 其他分类保持不变，或也可以更新
    vitamins: {
      vitaminCMg: 70  // 新增维生素C
    }
  }
};

const response = await fetch(`/api/meals/${mealId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(updateData)
});
```

---

## 八、最佳实践

### 8.1 数据来源建议

1. **AI识别**：AI识别餐食后，自动填充nutritionDetails
2. **营养数据库**：从USDA FoodData Central等标准数据库查询
3. **手动输入**：营养师或用户手动输入时，至少填写macro分类

### 8.2 写入策略

1. **分步写入**：先写入基本信息，再补充nutritionDetails
2. **批量更新**：支持批量更新多个餐食的nutritionDetails
3. **增量更新**：支持只更新nutritionDetails的某个分类

### 8.3 性能优化

1. **字段可选**：nutritionDetails中大部分字段可选，减少写入负担
2. **异步处理**：复杂的一致性验证可以异步处理
3. **缓存策略**：常用营养数据库查询结果可以缓存

---

## 九、版本控制

- **v1.0**（当前版本）：支持完整的nutritionDetails结构
- **兼容性**：向后兼容，旧版本只写nutrition字段也可以正常工作


