---
title: Sensor / Camera bring-up 清单：从读不到 ID 到稳定出图
date: 2026-11-02
author: 熊正耀
category: camera
tags: [Camera, Sensor, bring-up, MIPI, 调试]
keywords: [camera, sensor, bring-up, mipi, stream-on, checklist]
excerpt: 新 Sensor 上板时，按电源、时钟、总线、ID、初始化表、链路、出流的顺序排查，比在驱动里到处加日志更快收敛。
excerptEn: When bringing up a new sensor, work power → clocks → bus → ID → init tables → link → stream before sprinkling logs everywhere.
titleEn: Sensor / camera bring-up checklist — from no ID to a stable stream
image: /images/desk.jpg
---

# Sensor / Camera bring-up 清单：从读不到 ID 到稳定出图

新模组、新 Sensor、新板子——bring-up 阶段最怕的是：现象很多，顺序没有。下面是一份我在 Camera Driver / 影像工具侧反复用的**公开级清单**，按依赖关系排列。具体寄存器以厂商手册为准。

## 0. 先确认你在测什么

- 单摄还是双摄？哪一路先亮？  
- 目标模式：预览 / 拍照 / 录像？分辨率与 fps？  
- 对比基线：旧模组在同板是否正常？  

基线不清晰时，很容易把板级问题当成驱动问题。

## 1. 电源与复位

- 各路电源上电顺序是否符合手册（AVDD / DOVDD / DVDD 等）  
- 复位脚极性、脉宽、释放后的稳定时间  
- 用万用表 / 示波器看实际波形，而不是只看软件「已经 request 了」  

电源时序不对时，后面所有「偶发读不到 ID」都会像鬼打墙。

## 2. 时钟

- MCLK 频率与幅度是否在规格内  
- Sensor 侧是否真的收到时钟（探点，不要只信 pad 配置）  
- 系统 clock framework 是否允许在该场景开钟  

没有时钟还去读 ID，结果只能是 bus error 或假数据。

## 3. 控制总线（I2C / I3C 等）

- 地址、速率、上拉  
- 用 bus 工具确认 ACK；驱动里失败要区分 NACK / timeout / 远程挂死  
- 确认没有第二个设备占用同一地址  

读不到 Chip ID，十有八九还停在这一层。

## 4. Chip ID 与初始化表

- 对照手册核对 ID 寄存器与期望值  
- 初始化表版本、场景（lane 数、连续/非连续时钟）  
- 写表过程中是否有必须的 delay；批量写失败要能定位到第几条  

把「表」当成黑盒一次性 dump，出问题会很难回滚。

## 5. 数据链路（MIPI / CSI 等）

- lane 数、连续时钟、deskew 相关配置是否与模组一致  
- SoC 侧 CSI / PHY 是否已配置到匹配模式  
- 有能力时看 LP / HS 状态与 error 计数  

控制通路通了但不出图，多半卡在这里。

## 6. Stream on 与稳帧

- 开启流之后是否持续有帧、帧间隔是否稳定  
- 区分「出了一帧就停」和「一直 overflow / 校验错」  
- 双摄场景单独验证：先单路稳，再同开  

稳帧前不要急着接复杂 3A 与多 pipe，先让 RAW / 基础 YUV 跑稳。

## 7. 记录模板（建议）

每次 bring-up 留一张最短表：

| 步骤 | 结果 | 证据（log / 示波 / 寄存器） | 下一步 |
|------|------|-----------------------------|--------|
| 电源 |  |  |  |
| 时钟 |  |  |  |
| 总线 |  |  |  |
| ID |  |  |  |
| 初始化 |  |  |  |
| 链路 |  |  |  |
| 出流 |  |  |  |

## 小结

Bring-up 不是堆日志，而是**按依赖关门**。电源与时钟没过关之前，在 ISP 里调参没有意义；ID 都读不到时，讨论带宽更没有意义。

把清单固化进产线或自测脚本，下次换模组会少掉大半「从零摸黑」的时间。
