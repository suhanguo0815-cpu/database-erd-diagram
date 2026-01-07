# meals表nutritionDetails字段详细设计

## 一、字段说明

**字段名**：`nutritionDetails`  
**类型**：JSON  
**是否必填**：否（可空）  
**用途**：存储餐食的完整营养素成分分布数据

## 二、JSON结构设计

### 2.1 完整结构示例

```json
{
  "macro": {
    "proteinG": 25.5,      // 蛋白质（克）
    "fatG": 15.2,          // 脂肪（克）
    "carbG": 45.8,         // 碳水化合物（克）
    "fiberG": 8.5,         // 膳食纤维（克）
    "sugarG": 12.3,        // 糖（克）
    "starchG": 33.5        // 淀粉（克）
  },
  "minerals": {
    "sodiumMg": 580,       // 钠（毫克）
    "calciumMg": 280,      // 钙（毫克）
    "ironMg": 8.5,         // 铁（毫克）
    "potassiumMg": 420,    // 钾（毫克）
    "magnesiumMg": 85,     // 镁（毫克）
    "phosphorusMg": 320,   // 磷（毫克）
    "zincMg": 5.2,         // 锌（毫克）
    "seleniumMg": 0.055,   // 硒（毫克）
    "copperMg": 0.9,       // 铜（毫克）
    "manganeseMg": 1.8,    // 锰（毫克）
    "chromiumMg": 0.025    // 铬（毫克）
  },
  "vitamins": {
    "vitaminAMg": 0.8,     // 维生素A（视黄醇当量，毫克）
    "vitaminCMg": 65,      // 维生素C（毫克）
    "vitaminDMg": 0.015,   // 维生素D（微克）
    "vitaminEMg": 8.5,     // 维生素E（毫克）
    "vitaminK1Mg": 0.08,   // 维生素K1（微克）
    "vitaminB1Mg": 0.8,    // 维生素B1（硫胺素，毫克）
    "vitaminB2Mg": 0.9,    // 维生素B2（核黄素，毫克）
    "vitaminB3Mg": 12,     // 维生素B3（烟酸，毫克）
    "vitaminB5Mg": 3.5,    // 维生素B5（泛酸，毫克）
    "vitaminB6Mg": 1.2,    // 维生素B6（毫克）
    "vitaminB9Mg": 0.2,    // 维生素B9（叶酸，微克）
    "vitaminB12Mg": 0.0025,// 维生素B12（微克）
    "biotinMg": 0.03,      // 生物素（微克）
    "cholineMg": 250       // 胆碱（毫克）
  },
  "fattyAcids": {
    "saturatedFatG": 5.2,   // 饱和脂肪（克）
    "monounsaturatedFatG": 6.8,  // 单不饱和脂肪（克）
    "polyunsaturatedFatG": 3.2,   // 多不饱和脂肪（克）
    "transFatG": 0.1,      // 反式脂肪（克）
    "omega3G": 1.2,         // Omega-3（克）
    "omega6G": 2.0,         // Omega-6（克）
    "omega9G": 6.0          // Omega-9（克）
  },
  "aminoAcids": {
    "tryptophanG": 0.25,   // 色氨酸（克）
    "threonineG": 0.85,    // 苏氨酸（克）
    "isoleucineG": 0.95,   // 异亮氨酸（克）
    "leucineG": 1.65,      // 亮氨酸（克）
    "lysineG": 1.35,       // 赖氨酸（克）
    "methionineG": 0.45,   // 蛋氨酸（克）
    "cystineG": 0.35,      // 胱氨酸（克）
    "phenylalanineG": 1.05,// 苯丙氨酸（克）
    "tyrosineG": 0.75,     // 酪氨酸（克）
    "valineG": 1.15,       // 缬氨酸（克）
    "arginineG": 1.25,     // 精氨酸（克）
    "histidineG": 0.55,    // 组氨酸（克）
    "alanineG": 1.05,      // 丙氨酸（克）
    "asparticAcidG": 1.85, // 天冬氨酸（克）
    "glutamicAcidG": 3.15, // 谷氨酸（克）
    "glycineG": 0.85,      // 甘氨酸（克）
    "prolineG": 0.95,      // 脯氨酸（克）
    "serineG": 0.85        // 丝氨酸（克）
  },
  "other": {
    "cholesterolMg": 85,    // 胆固醇（毫克）
    "caffeineMg": 0,        // 咖啡因（毫克）
    "alcoholG": 0,          // 酒精（克）
    "waterG": 180,          // 水分（克）
    "ashG": 2.5,            // 灰分（克）
    "carotenoidsMg": 2.5,   // 类胡萝卜素（毫克）
    "lycopeneMg": 0.8,      // 番茄红素（毫克）
    "luteinMg": 1.2,        // 叶黄素（毫克）
    "phytosterolsMg": 85   // 植物固醇（毫克）
  }
}
```

## 三、字段分类说明

### 3.1 宏量营养素（macro）

| 字段名 | 单位 | 说明 | 是否必填 |
|--------|------|------|----------|
| proteinG | 克 | 蛋白质 | 推荐 |
| fatG | 克 | 总脂肪 | 推荐 |
| carbG | 克 | 总碳水化合物 | 推荐 |
| fiberG | 克 | 膳食纤维 | 可选 |
| sugarG | 克 | 糖 | 可选 |
| starchG | 克 | 淀粉 | 可选 |

### 3.2 常量元素（minerals）

| 字段名 | 单位 | 说明 | 是否必填 |
|--------|------|------|----------|
| sodiumMg | 毫克 | 钠 | 推荐 |
| calciumMg | 毫克 | 钙 | 推荐 |
| ironMg | 毫克 | 铁 | 推荐 |
| potassiumMg | 毫克 | 钾 | 推荐 |
| magnesiumMg | 毫克 | 镁 | 可选 |
| phosphorusMg | 毫克 | 磷 | 可选 |
| zincMg | 毫克 | 锌 | 可选 |
| seleniumMg | 毫克 | 硒 | 可选 |
| copperMg | 毫克 | 铜 | 可选 |
| manganeseMg | 毫克 | 锰 | 可选 |
| chromiumMg | 毫克 | 铬 | 可选 |

### 3.3 维生素（vitamins）

| 字段名 | 单位 | 说明 | 是否必填 |
|--------|------|------|----------|
| vitaminAMg | 毫克 | 维生素A（视黄醇当量） | 推荐 |
| vitaminCMg | 毫克 | 维生素C | 推荐 |
| vitaminDMg | 微克 | 维生素D | 推荐 |
| vitaminEMg | 毫克 | 维生素E | 推荐 |
| vitaminK1Mg | 微克 | 维生素K1 | 可选 |
| vitaminB1Mg | 毫克 | 维生素B1（硫胺素） | 推荐 |
| vitaminB2Mg | 毫克 | 维生素B2（核黄素） | 推荐 |
| vitaminB3Mg | 毫克 | 维生素B3（烟酸） | 推荐 |
| vitaminB5Mg | 毫克 | 维生素B5（泛酸） | 可选 |
| vitaminB6Mg | 毫克 | 维生素B6 | 推荐 |
| vitaminB9Mg | 微克 | 维生素B9（叶酸） | 推荐 |
| vitaminB12Mg | 微克 | 维生素B12 | 推荐 |
| biotinMg | 微克 | 生物素 | 可选 |
| cholineMg | 毫克 | 胆碱 | 可选 |

### 3.4 脂肪酸（fattyAcids）

| 字段名 | 单位 | 说明 | 是否必填 |
|--------|------|------|----------|
| saturatedFatG | 克 | 饱和脂肪 | 推荐 |
| monounsaturatedFatG | 克 | 单不饱和脂肪 | 推荐 |
| polyunsaturatedFatG | 克 | 多不饱和脂肪 | 推荐 |
| transFatG | 克 | 反式脂肪 | 推荐 |
| omega3G | 克 | Omega-3 | 可选 |
| omega6G | 克 | Omega-6 | 可选 |
| omega9G | 克 | Omega-9 | 可选 |

### 3.5 氨基酸（aminoAcids）

| 字段名 | 单位 | 说明 | 是否必填 |
|--------|------|------|----------|
| tryptophanG | 克 | 色氨酸 | 可选 |
| threonineG | 克 | 苏氨酸 | 可选 |
| isoleucineG | 克 | 异亮氨酸 | 可选 |
| leucineG | 克 | 亮氨酸 | 可选 |
| lysineG | 克 | 赖氨酸 | 可选 |
| methionineG | 克 | 蛋氨酸 | 可选 |
| cystineG | 克 | 胱氨酸 | 可选 |
| phenylalanineG | 克 | 苯丙氨酸 | 可选 |
| tyrosineG | 克 | 酪氨酸 | 可选 |
| valineG | 克 | 缬氨酸 | 可选 |
| arginineG | 克 | 精氨酸 | 可选 |
| histidineG | 克 | 组氨酸 | 可选 |
| alanineG | 克 | 丙氨酸 | 可选 |
| asparticAcidG | 克 | 天冬氨酸 | 可选 |
| glutamicAcidG | 克 | 谷氨酸 | 可选 |
| glycineG | 克 | 甘氨酸 | 可选 |
| prolineG | 克 | 脯氨酸 | 可选 |
| serineG | 克 | 丝氨酸 | 可选 |

### 3.6 其他成分（other）

| 字段名 | 单位 | 说明 | 是否必填 |
|--------|------|------|----------|
| cholesterolMg | 毫克 | 胆固醇 | 推荐 |
| caffeineMg | 毫克 | 咖啡因 | 可选 |
| alcoholG | 克 | 酒精 | 可选 |
| waterG | 克 | 水分 | 可选 |
| ashG | 克 | 灰分 | 可选 |
| carotenoidsMg | 毫克 | 类胡萝卜素 | 可选 |
| lycopeneMg | 毫克 | 番茄红素 | 可选 |
| luteinMg | 毫克 | 叶黄素 | 可选 |
| phytosterolsMg | 毫克 | 植物固醇 | 可选 |

## 四、数据类型与约束

### 4.1 数值类型
- 所有数值字段使用 `float` 或 `number` 类型
- 支持小数，精度建议保留2位小数
- 允许为 `null` 或 `undefined`（表示该营养素未检测）

### 4.2 单位说明
- **G**：克（gram）
- **Mg**：毫克（milligram）
- **微克**：某些维生素单位（如维生素D、B12等）

### 4.3 数据验证规则
1. **完整性检查**：`macro` 下的 `proteinG`、`fatG`、`carbG` 至少有一个不为空
2. **一致性检查**：`fatG` 应该约等于 `saturatedFatG + monounsaturatedFatG + polyunsaturatedFatG`
3. **合理性检查**：所有数值应该 >= 0（某些字段如 `transFatG`、`cholesterolMg` 可能为0）

## 五、使用场景

### 5.1 数据来源
- AI识别：通过图片识别餐食，AI分析营养素成分
-手动录入：营养师或用户手动输入营养素数据
- 数据库查询：从营养数据库（如USDA FoodData Central）查询标准营养素数据

### 5.2 应用场景
1. **营养分析**：分析用户每日/每周营养素摄入情况
2. **营养平衡评估**：评估宏量营养素比例、维生素矿物质是否充足
3. **个性化建议**：根据营养素缺乏情况给出补充建议
4. **健康报告**：生成营养报告，展示营养素摄入趋势
5. **疾病管理**：针对特定疾病（如糖尿病、高血压）进行营养素管控

## 六、与现有字段的关系

### 6.1 nutrition字段（简化版）
- **保留原因**：兼容现有代码，提供快速查询
- **关系**：`nutrition` 字段是 `nutritionDetails.macro` 的简化版本
- **建议**：新代码优先使用 `nutritionDetails`，`nutrition` 作为兼容字段

### 6.2 数据同步
- 写入 `nutritionDetails` 时，自动同步更新 `nutrition` 字段
- 读取时优先使用 `nutritionDetails`，如果为空则使用 `nutrition`

## 七、索引建议

由于 `nutritionDetails` 是JSON字段，建议：
1. 如果有JSONB索引支持，可以对常用字段建立GIN索引
2. 如果需要按营养素查询，建议提取常用字段到独立列（如 `proteinG`、`fatG`、`carbG`）
3. 或者使用JSONB的表达式索引（如PostgreSQL支持）

## 八、迁移建议

1. **新增字段**：`nutritionDetails` 作为可选字段，不影响现有数据
2. **逐步迁移**：现有数据逐步补充 `nutritionDetails` 数据
3. **兼容处理**：应用层同时支持 `nutrition` 和 `nutritionDetails` 两个字段


