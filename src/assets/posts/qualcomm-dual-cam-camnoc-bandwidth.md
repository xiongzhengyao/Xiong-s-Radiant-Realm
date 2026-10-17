---
title: 高通双摄同开与 Camera NOC 带宽：从 Sensor 到 DDR 的反压与 Overflow
date: 2026-10-17
author: 熊正耀
category: camera
tags: [Camera, 带宽, Qualcomm, NOC, Overflow]
keywords: [camera, bandwidth, qualcomm, camnoc, overflow, ddr]
excerpt: 双摄同开时 Camera NOC 写 DDR 背压如何传到 FE/VFE/IFE/TFE 与 CSID；用 128/256bit 理论带宽与 30fps 双路算例说明平均通常够、峰值与投票才是坑。
---

# 高通双摄同开与 Camera NOC 带宽：从 Sensor 到 DDR 的反压与 Overflow

双摄（Wide + Tele）同时开流时，像素路径上的写带宽会突然叠上去。我在高通平台上踩过的典型现象是：DDR 写侧堆积 → Camera NOC 反压 → 前端 FE / VFE / IFE / TFE 总线或 CSID 报 overflow。本文按工程笔记把路径、带宽公式、30fps 算例和排查顺序记下来，不涉及具体芯片 SKU，也不写未公开寄存器。

## 现象：双摄同开，流量暴涨

双摄同开后，常见会同时走两路 RAW（例如 14bit + 10bit 双输出）甚至再叠加 YUV / UBWC。摄像头侧 NOC（常称 camnoc）时钟量级大约在 **480 MHz** 一带——具体以平台时钟树为准，这里只作数量级讨论。

一旦 DDR 写口跟不上、或系统侧 MNOC/DDR 被别的主设备抢占：

1. Camera NOC → DDR 的写请求积压（write backlog）
2. 反压沿 NOC / Bus WM 往回传
3. 前端侧 FIFO 堆满，最终表现为 **FE / VFE / IFE / TFE bus overflow** 或 **CSID overflow**

平均帧率看起来还在 30fps，不代表瞬时写带宽安全——行突发、多路对齐、以及 IPE/BPS 同挂 camnoc 时，峰值很容易顶穿。

## 数据路径（从 Sensor 到 DDR）

按层次从上游到下游（列表即可，不必画图）：

1. **Sensor** — 出 MIPI CSI-2 包流
2. **CSIPHY** — 物理层收包、时钟/数据 lane
3. **CSID** — 解包、路由到 pixel / RDI 等口；溢出时常最先在这里或紧邻前端看到
4. **IFE / TFE** — 像素路径处理 + **RDI** 直通落盘；名称因平台代际不同（IFE / TFE / FE / VFE 同属前端家族，日志关键字各异）
5. **Bus WM（Write Master）** — 带 FIFO；可选 **UBWC** 压缩后再写
6. **Camera NOC（camnoc）** — 摄像头子系统内部互连
7. **MNOC / System NOC** — 汇入片上系统互连
8. **DDR** — 最终写内存

**反压路径（反向）**大致是：

```
DDR 拥塞 / 写积压
  ← MNOC / System NOC
  ← Camera NOC
  ← Bus WM FIFO 满
  ← IFE/TFE / RDI 侧写不动
  ← CSID 或前端总线 overflow
```

NOC 之前、值得单独盯的模块：**CSIPHY、CSID、IFE/TFE、Bus WM、以及 QoS / urgency（投票与紧急度）**。后面排查会反复回到这几块。

## 带宽公式与 camnoc 理论顶

互连理论吞吐可以粗算为：

```text
BW ≈ f_clk × bytes/beat
```

在 **~480 MHz** 量级下：

| 数据位宽 | bytes/beat | 理论峰值 |
|---------|------------|----------|
| 128 bit | 16 B | 480 MHz × 16 ≈ **7.68 GB/s** |
| 256 bit | 32 B | 480 MHz × 32 ≈ **15.36 GB/s** |

实际有效吞吐通常只有理论值的 **约 70%–80%**（仲裁、气泡、地址对齐、读改写、QoS 降权等都会吃掉余量）。所以看规格时要用「有效带宽」心里打七折，而不是拿理论峰值去对平均帧带宽。

## 30fps 双摄算例

下面按「有效像素 × 位深 × 帧率 / 8」估 **平均写带宽**（未计 ISP 内部额外拷贝、未计元数据、未计行/帧 blanking 带来的瞬时尖峰）。单位按 10⁹ 字节为 1 GB。

### Wide：5760 × 3240，14bit + 10bit @ 30fps

| 流 | 计算 | 约等于 |
|----|------|--------|
| 14bit | 5760 × 3240 × 14 × 30 / 8 | **0.980 GB/s** |
| 10bit | 5760 × 3240 × 10 × 30 / 8 | **0.700 GB/s** |
| Wide 小计 | | **≈ 1.68 GB/s** |

### Tele：4096 × 2304，14bit + 10bit @ 30fps

| 流 | 计算 | 约等于 |
|----|------|--------|
| 14bit | 4096 × 2304 × 14 × 30 / 8 | **0.495 GB/s** |
| 10bit | 4096 × 2304 × 10 × 30 / 8 | **0.354 GB/s** |
| Tele 小计 | | **≈ 0.85 GB/s** |

### 合计

- 双摄四路（两路 14bit + 两路 10bit）平均约 **2.53 GB/s**
- 若 **14bit 按 plain 16bit（2 字节/像素）落内存**，14bit 两路分别变为约 1.120 + 0.566 GB/s，四路合计约 **2.74 GB/s**

相对 128bit camnoc 理论 7.68 GB/s（有效再打到约 5.4–6.1 GB/s），**纯平均 30fps 通常仍在预算内**——所以「平均算得通却仍 overflow」时，问题几乎总在峰值、投票或争用上。

## 结论：平均够，峰值与投票才是坑

1. **30fps 平均带宽**相对 128bit 理论顶，上面算例一般吃得下；不要只拿平均去否决「带宽不足」的怀疑。
2. 盯 **峰值**：多路行同步、双输出同时写、UBWC on/off 切换、以及 AF/snapshot 叠加。
3. 盯 **AB / IB vote**（平均带宽 / 瞬时带宽投票）是否偏低，QoS / urgency 是否被系统侧压下去。
4. 盯 **IPE / BPS 等同挂 camnoc** 的主设备——预览、后处理、缩放路径可能和 Sensor 写抢同一 NOC。
5. 盯 **DDR 争用**：显示、GPU、视频编解码、大块 DMA 同时写读时，摄像头写口最先「喘不过气」。

## 调试顺序（我实际会按这个砍）

1. **先拉满相关 vote / QoS**（在合法、可配置范围内），排除「投票过低导致被饿死」。
2. **错开双摄时序 / 行长（line length）**，减轻两路行突发叠峰；同步需求与带宽尖峰往往要折中。
3. **先砍一路负载**：关掉 14+10 里的一路，或关掉 YUV / 关掉 UBWC 相关多余写，看 overflow 是否消失，用来二分是「总带宽」还是「某条 WM 路径」。
4. **看日志里谁先溢出**：是哪个 **Bus WM**，还是 **CSID** / 前端总线——先溢的那一级，决定你往上游（PHY/CSID/IFE）还是往下游（NOC/DDR/vote）加深。

## Pre-NOC 模块速查

进 Camera NOC 之前，优先确认这些块本身健康：

| 模块 | 关注点 |
|------|--------|
| **CSIPHY** | lane 速率、错误计数、时钟是否稳 |
| **CSID** | 解包/路由、overflow 计数、与 IFE/RDI 口匹配 |
| **IFE / TFE** | pixel + RDI 配置、前端总线是否报 overflow |
| **Bus WM** | FIFO 深度占用、是否开 UBWC、哪条 WM 先满 |
| **QoS / urgency** | AB/IB vote、紧急度是否与双摄同开场景匹配 |

把「Sensor → … → DDR」正路径和「DDR → … → CSID/前端」反压路径都放在脑子里，双摄同开的 overflow 会好查很多：多数时候不是某一帧平均算错了，而是峰值、投票和系统侧争用叠在一起。
