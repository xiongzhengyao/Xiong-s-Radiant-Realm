---
title: Linux 系统编程基础指南
date: 2024-09-12
author: 熊正耀
category: linux
tags: [Linux, 系统编程, 进程, IPC]
keywords: [linux, 进程, 线程, ipc, 系统编程]
excerpt: Linux 进程管理、进程间通信、信号处理与多线程编程的核心概念与实践要点。
---

# Linux 系统编程基础指南

Linux 系统编程是连接应用与内核的接口层：进程生命周期、IPC、线程同步、文件与网络 IO。对做 Camera/传感器用户态服务或调试工具的工程师来说，这些能力决定了服务是否稳、问题能否快速复现。下文按模块给出概念、接口与实践要点。

## 进程管理

### 进程创建与控制

- **fork() 系统调用**
  - 父子进程关系：子进程继承打开的 fd、内存映射（写时复制）
  - 写时复制机制：降低创建成本，但大工作集下仍可能触发大量缺页
  - 进程创建实例：注意 `fork` 后只应在一端执行清理/关闭逻辑

```c
pid_t pid = fork();
if (pid < 0) {
    perror("fork");
} else if (pid == 0) {
    /* child */
    execlp("ls", "ls", "-l", (char *)NULL);
    _exit(127);
} else {
    int status;
    if (waitpid(pid, &status, 0) < 0)
        perror("waitpid");
}
```

- **exec 函数族**
  - `execve()` 是系统调用入口
  - `execl` / `execlp` / `execle`：参数列表形式
  - `execv` / `execvp` / `execvpe`：参数数组形式
  - 成功不返回；失败要检查 `errno` 并避免在多线程里随意 `fork+exec` 而不清理

- **wait 函数族**
  - `wait()` / `waitpid()` 回收子进程，防止僵尸进程
  - 用 `WIFEXITED` / `WIFSIGNALED` 解析退出原因
  - 长期服务建议 `SIGCHLD` + 非阻塞 `waitpid(-1, ..., WNOHANG)` 循环回收

### 进程间通信 (IPC)

1. **管道通信**
   - 匿名管道 `pipe`：亲缘进程
   - 命名管道 FIFO：可用路径名连接
   - 注意：管道是字节流；写端关闭后读端读到 EOF

2. **消息队列**
   - System V 消息队列：`msgget` / `msgsnd` / `msgrcv`
   - POSIX 消息队列：`mq_open` 等，接口更现代
   - 适合控制面小消息；大数据更常见共享内存 + 通知

3. **共享内存**
   - `mmap` 匿名/文件映射
   - System V `shmget` / POSIX `shm_open`
   - **必须**配合同步（互斥、信号量、原子序列号），否则必现数据竞争

选型简表：

| IPC | 优点 | 注意点 |
| --- | --- | --- |
| pipe/FIFO | 简单可靠 | 容量有限，无随机访问 |
| 消息队列 | 有边界消息 | 大小与深度受限 |
| 共享内存 | 吞吐高 | 同步复杂 |
| Unix domain socket | 灵活、可传 fd | 编码与协议要自建 |

## 信号

信号常被忽略，却是服务稳健性的关键：

- 可重入：信号处理函数里只做 async-signal-safe 操作，或只设置 `volatile sig_atomic_t` 标志
- `sigaction` 优于 `signal`（行为更明确）
- 常用：`SIGINT`/`SIGTERM` 优雅退出，`SIGPIPE` 忽略或检查写错误

```c
static volatile sig_atomic_t stop = 0;
static void on_term(int signo) { (void)signo; stop = 1; }

struct sigaction sa = {0};
sa.sa_handler = on_term;
sigemptyset(&sa.sa_mask);
sigaction(SIGTERM, &sa, NULL);
```

## 线程编程

### 线程基础

- pthread 库：`pthread_create` / `pthread_join` / `pthread_detach`
- 线程创建与终止：避免在持锁时取消；优先协作式退出标志
- 线程同步机制：互斥、条件变量、读写锁、屏障

### 同步原语

1. **互斥锁**
   - `pthread_mutex_t`；关键路径保持临界区短
   - 死锁预防：固定加锁顺序、避免锁中回调未知代码
   - 性能：高争用时考虑分片或无锁结构（需正确内存序）

2. **条件变量**
   - `pthread_cond_t` + 互斥锁
   - 生产者消费者模型：`while (!ready) pthread_cond_wait(...)`（防虚假唤醒）
   - 线程协作：广播 vs 信号要按语义选择

3. **读写锁**
   - 读多写少场景提升并发
   - 写饥饿问题要评估
   - 应用场景：配置只读缓存、状态快照

## 文件系统

### 文件操作

- 文件描述符：一切皆 fd（文件、socket、timerfd、eventfd…）
- 权限与 umask：服务进程尤其要注意创建文件权限
- 目录操作：`opendir` / `readdir`；注意并发删除导致的竞态

### IO 模型

1. **阻塞 IO** — 简单；不适合高并发连接
2. **非阻塞 IO** — 配合状态机；注意 `EAGAIN`
3. **IO 多路复用**
   - `select`：可移植，fd 数量受限
   - `poll`：无 fd_set 位图限制
   - `epoll`：Linux 高并发首选（水平/边缘触发语义要吃透）

```c
int ep = epoll_create1(EPOLL_CLOEXEC);
struct epoll_event ev = {.events = EPOLLIN, .data.fd = listen_fd};
epoll_ctl(ep, EPOLL_CTL_ADD, listen_fd, &ev);
```

## 网络编程

### Socket 编程

- **TCP**
  - 服务器：`socket → bind → listen → accept`
  - 客户端：`socket → connect`
  - 并发服务器：多进程、多线程、或单线程 epoll + 非阻塞
- **UDP**
  - 数据报套接字；注意丢包与乱序
  - 广播与多播：权限与网卡选择
  - 适合遥测/发现；可靠控制面仍常用 TCP 或 QUIC 类方案

### 高级特性

1. **异步 IO**
   - POSIX AIO、或 `io_uring`（新项目可评估）
   - 信号驱动 IO：场景有限，信号处理要谨慎
2. **零拷贝技术**
   - `sendfile()`、`splice()`、`mmap` + write
   - 适用于静态文件分发或管道搬运；注意对齐与部分文件系统限制

## 系统监控与性能

### 资源管理

- 内存：RSS/PSS、`/proc/self/smaps`、泄漏检测
- CPU：负载、绑核、上下文切换次数
- 磁盘 IO：iowait、队列深度、fsync 频率

### 性能优化

1. **分析工具**
   - `strace`：系统调用与错误码
   - `perf`：热点与缓存命中
   - `gprof` / 火焰图：用户态 CPU 分布
2. **调优技巧**
   - 减少不必要的系统调用与拷贝
   - 注意伪共享与内存局部性
   - 批量 IO、合理缓冲，避免过频 `fsync`

## 开发建议

1. **代码规范**
   - 错误处理：每个可能失败的调用都检查
   - 资源管理：fd/锁/堆内存成对获取释放；优先 RAII 或 goto cleanup
   - 命名约定：与项目一致，系统调用包装层要清晰
2. **调试技巧**
   - GDB：断点、core、线程切换
   - 内存泄漏：ASan/Valgrind（嵌入式目标注意开销）
   - 性能剖析：先证明瓶颈再优化
3. **最佳实践**
   - 安全性：检查长度、避免 TOCTOU、最小权限
   - 可移植性：`_POSIX_C_SOURCE`、谨慎依赖 Linux 扩展
   - 代码复用：把「等待可读 + 读完整消息」做成可靠原语

## 总结

进程、IPC、线程、文件与网络 IO 构成 Linux 系统编程的主干。先把生命周期与错误路径写对，再用 epoll/共享内存等手段换性能；调试时 `strace`/`perf`/日志时间戳往往比直觉更可靠。掌握这些接口后，无论是写传感器守护进程还是联调 Camera 用户态工具，都会从容很多。
