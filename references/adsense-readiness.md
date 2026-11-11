# AdSense 申请前的硬性检查

## 先纠正一个常见误会

AdSense 官方公布的资格要求是：**年满 18 岁、有原创内容、遵守合作规范**。里面**没有流量门槛**。

如果听到"连续 7 天日均 100 IP 才能申请"，先问清楚是谁定的——大概率是服务商或中介自己加的条件。这不改变"要先把站做好"的顺序，但改变了"要不要为这个数字硬冲"的判断。

**绝对不要买流量凑数。** 无效流量是账号级封禁，一次就废，申诉基本不回来。

## 申请前必须过的六项

### 1. 内容

- [ ] 每个页面都能独立回答一个问题（不是凑字数的文章）
- [ ] 没有整站 AI 味（同一句式、同一结构、没有具体数据和案例）
- [ ] 没有空页面（只有标题、只有导航、只有一张图）
- [ ] 有"关于"和"联系方式"，且联系邮箱能通
- [ ] 有隐私政策，且明确写了广告和 Cookie

### 2. 结构

- [ ] 导航能三层内到达任何页面
- [ ] 没有孤儿页
- [ ] 有 sitemap 且已提交
- [ ] 404 页面正确返回 404（不是 200 的软 404）

### 3. 技术 —— 最容易漏的一项：CSP 会拦死广告

如果站用 Content-Security-Policy，AdSense 的脚本、iframe、像素、内联样式全需要放行：

```
script-src  ... https://pagead2.googlesyndication.com
                https://googleads.g.doubleclick.net
                https://tpc.googlesyndication.com
                https://adservice.google.com
frame-src   https://googleads.g.doubleclick.net
                https://tpc.googlesyndication.com
                https://ep2.adtrafficquality.google
img-src     ... https://pagead2.googlesyndication.com
                https://googleads.g.doubleclick.net
                https://*.g.doubleclick.net
connect-src ... https://pagead2.googlesyndication.com
                https://googleads.g.doubleclick.net
                https://ep1.adtrafficquality.google
style-src   'self' 'unsafe-inline'      ← 这条不加，广告位出来是空白
```

改之前先在测试路径放一个广告单元验证。

### 4. ads.txt

放在根目录：

```
google.com, pub-你的发布商ID, DIRECT, f08c47fec0942fa0
```

缺了不影响审核，但后台会一直提示，且部分买家不投。

### 5. 同意管理（CMP）

面向 EEA / 英国的用户，AdSense 要求使用 Google 认证的 CMP。

顺带：GA4 如果是无条件加载（用户没同意就先跑），那是 GDPR 问题。流量小可以先欠着，但要知道欠着。

### 6. 内容政策红线

- [ ] 没有盗版 / 破解 / 版权内容
- [ ] 没有成人、赌博、药品
- [ ] 没有"点击广告"的诱导文案
- [ ] 没有自动播放带声音的视频
- [ ] 不用弹窗挡住内容

## 申请时机

**先有稳定的自然流量和足够多的已收录页面，再申请。**

用一个 40 天、11 个可见页面、每天 0 点击的站去申请，被拒理由大概率是「低价值内容」，拒一次会留记录，第二次更难。

## 期望值

100 IP/天 的 AdSense 收入大约每天几美元。这个阶段真正值钱的是产品本身的转化和联盟收入，广告是补一点。

把 AdSense 当终点会导致动作变形（为凑流量买量、为过审堆内容），反而拖慢真正该做的事。
