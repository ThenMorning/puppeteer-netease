# puppeteer-netease
koa2利用[puppeteer](https://zhaoqize.github.io/puppeteer-api-zh_CN/#/?id=%E6%A6%82%E8%BF%B0)爬取网易云音乐列表，一键下载(包括无版权音乐)[侵权即删]

# `uat测试结果`
    我的列表一共320首歌，成功300首，下载失败11首，重命名失败或乱码9首
    全部过程  持续 56分24秒
    使用4g热点 使用流量6G
# Rendering

# Notice
1. 利用puppeteer爬音乐列表，你需要将其中的url改成你的url，如果是爬其他网站的音乐列表，需要更改dom查找
2. 音乐列表拿到后，我们前往音乐下载网站 逐个下载，利用mouse event，点击下载，当前代码在 我的Mac os的chrome窗口 下完美运行，但是切换到 你的环境(windows或者Mac)，需要你自己更改点击事件的坐标，用来点击下载，我在项目中是写死的
3. 当前项目只是粗糙简单的完成了  爬取 => 下载，没有做 异常处理的善后处理，比如(下载失败了，记录下来，所有的完成后再执行一遍),  没有做 前端界面，可以给个文本框，接受  url入参，可以给个 按钮  点击开始下载，没有做任务进度等统计
4. 大多数网页 基本都是  服务端渲染 插值表达式，由js再做数据插值。所以传统的爬虫（利用 http模块库（http，superagent，axios等），请求获取response，解析 cookie和 token，动态更改 ip，反 反爬等，由cherrio代理JQ 做node环境中的dom查找）获取的 response 都是插值表达式，而不是我们想要的数据，所以这里采用了 puppeteer.
5. 废话不多说了。
