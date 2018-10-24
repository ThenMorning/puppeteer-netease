const router = require('koa-router')()
// var superagent = require('superagent'); 
// var cheerio = require('cheerio');
// const Nightmare = require('nightmare')
// const nightmare = new Nightmare({
//   show: true,
//   openDevTools: {
//     mode: 'detach'
//   }
// })
const puppeteer = require('puppeteer');
const fs = require('fs');
var jsmediatags = require("jsmediatags");

router.get('/', async (ctx, next) => {
  const browser = await puppeteer.launch({ timeout: 50000, headless: false, slowMo: 250 });
  const page = await browser.newPage();

  // 从网易云拉去音乐列表
  await page.goto('https://music.163.com/#/my/m/music/playlist?id=142222130');
  await page.waitFor(2000);

  let iframe = await page.frames().find(f => f.name() === 'contentFrame');
  // 从iframe里面查找dom，拿到我们要的 歌曲名称和作者
  const musics = await iframe.$$eval('span.icn-share', elements => {
    const patt = /data-res-([a-z]{1,})=\"([\s\S]*?)\"/g
    const ctn = elements.reduce((total, current) => {
      var returnStr = ''
      while ((result = patt.exec(current.outerHTML)) != null) {
        if (result[1] === 'name' || result[1] === 'author') {
          returnStr += ' ' + result[2]
        }
      }
      return returnStr ? total + '\n' + returnStr : total
    }, '');
    return ctn;
  });

  // 写入文件
  let writerStream = fs.createWriteStream('我的音乐列表.text');
  writerStream.write(musics, 'UTF8');
  writerStream.end();

  // 到下载网站 下载
  let _arr = musics.split('\n');
  for (var i = 0; i < _arr.length; i++) {
    console.log('参数：' + _arr[i])
    if (_arr[i]) {
      await upload(_arr[i])
    }
  }
  // 等待所有的音乐下载完毕，大概1分钟足够了，我用4g还是很快的
  await page.waitFor(60000);

  // 将下载到本地的音乐重命名
  // 使用jsmediatags 获取mp3文件的详细信息  title作为文件名

  console.log("查看 /Users/winward/Downloads/ 目录");
  const path = '/Users/winward/Downloads/'    //  这里要改成你浏览器下载的 默认目录路径
  var files = fs.readdirSync(path);
  const musicFilePaths =
    files.filter(function (file, index) {
      var stat = fs.statSync(path + file);
      let _arr = file.split('.');
      return !stat.isDirectory() && _arr[_arr.length - 1] === 'mp3'
    })
      .map((musicFile) => {
        return path + musicFile
      })
  musicFilePaths.map((musicFilePath) => {
    // 利用jsmediatags模块获取mp3文件的信息，我们只要 名称和作者就好了,重命名
    jsmediatags.read(musicFilePath, {
      onSuccess: function (tag) {
        fs.rename(musicFilePath, path + tag.tags.title + ' ' + tag.tags.artist + '.mp3', function (err) {
          if (err) {
            console.error(error);
            throw err;
          }
        })
      },
      onError: function (error) {
        console.log(':(', error.type, error.info);
      }
    });
  })



  // 单曲下载
  // 不能模拟contextmenu事件，只能通过点击video的下载按钮下载，坐标我就写死了,
  // 如果在不同电脑上位置不对，需要自己去改
  // 点击下载按钮下载  无法在下载前更改下载的文件名，所以只能最后做一次修改
  async function upload(param) {
    await page.goto('http://music.sonimei.cn/?name=' + param + '&type=qq')
    await page.waitForSelector('#j-src-btn');
    await page.waitFor(5000);

    const sel = '#j-src-btn';
    const hrefs = await page.evaluate((sel) => {
      let elements = Array.from(document.querySelectorAll(sel));
      let links = elements.map(element => {
        return element.href
      })
      return links;
    }, sel);

    try {
      await page.goto(hrefs[0])
      console.log('href: ' + hrefs[0])
      await page.waitFor(2000);
      await page.mouse.click(535, 350);
      await page.mouse.click(534, 350);
    } catch (error) {
      console.error('href: ' + hrefs[0])
    }

  }
  console.log('任务执行完毕')
  // await browser.close();
})




module.exports = router
