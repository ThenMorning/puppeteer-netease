const router = require('koa-router')()
var superagent = require('superagent'); //这三个外部依赖不要忘记npm install


router.prefix('/users')

router.get('/', function (ctx, next) {
  superagent
        .get('http://dl.stream.qqmusic.qq.com/M800002eMvkq4g5H2D.mp3?vkey=E6B29699E7A2A1BD0C5645A446CC8A1E51D00724DD30B8D201064A333B3E45FA3E8F30D2571B59B29589F8A8C46194D26168FCF5B40AF68D&guid=5150825362&fromtag=1') 
        .end(function(req,res){
            //do something
            console.log(req,res)
        })
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
