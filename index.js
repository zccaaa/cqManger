const express = require('express')
const dbHelper = require('./lib/dbHelper')

// 导入文件上传中间件
const multer = require('multer')
// 设置保存的地址
const upload = multer({
    dest: 'views/imgs/'
})
// 导入path模块
const path = require('path')
// 实例化服务器对象
const app = express()

// 托管静态资源
app.use(express.static('views'))

// 路由1
app.get('/herolist', (res, req) => {
    // 接收数据
    const query = res.query.query
    // 页码
    const pagenum = parseInt(res.query.pagenum)
    // 页容量
    const pagesize = parseInt(res.query.pagesize)
    // 获取所有数据
    dbHelper.find('cqlist', {}, result => {
        const temArr = result.filter(v => {
            if (v.heroName.indexOf(query) != -1 || v.skillName.indexOf(query) != -1) {
                return true
            }
        })
        // 返回数据
        let list = [];
        // 初始页码序号
        const startIndex = (pagenum - 1) * pagesize
        // 结束页码序号
        const endIndex = startIndex + pagesize
        // 添加每一页的数据
        for (let i = startIndex; i < endIndex; i++) {
            list.push(temArr[i])
        }
        // 计算总页码数
        const totalPage = Math.ceil(temArr.length / pagesize)
        //返回数据
        res.send(
            totalPage,
            list
        )
    })

})
// 路由2 查询英雄
app.get('/herodetail', (req, res) => {
    // 接收id
    const id = req.query.id
    // 查询
    dbHelper.find('cqlist', {
        _id: dbHelper.ObjectId(id)
    }, result => {
        res.send(
            result[0]
        )
    })

})
// 路由3 英雄新增 文件上传
app.post('/heroadd', upload.single('heroIcon'), (req, res) => {
    // 打印数据
    const heroName = req.body.heroName
    const skillName = req.body.skillName
    // 图片地址
    const heroIcon = path.join('imgs', req.file.filename)

    // 保存到数据
    dbHelper.insertOne(
        'cqlist', {
            heroName,
            skillName,
            heroIcon
        }, result => {
            res.send({
                    code: 200,
                    msg: '添加成功'
                }

            )
        }
    )
})
// 路由4 英雄修改 有文件上传,要用的到upload.single('heroIcon')
app.post('/heroupdate', upload.single('heroIcon'), (req, res) => {
    // 获取数据
    const heroName = req.body.heroName
    const skillName = req.body.skillName
    // 图片地址
    const heroIcon = path.join('imgs', req.file.filename)
    // 获取id
    const id = req.body.id
    dbHelper.updateOne('cqlist', {
            _id: dbHelper.ObjectId(id)
        }, {
            heroName,
            skillName,
            heroIcon
        },
        result => {
            res.send({
                msg: '修改成功',
                code: '200'
            })
        }
    )
})
// 路由5 删除 
app.get('/delete',(req,res)=>{
    const id=req.query.id
    // 调用方法删除
    dbHelper.deleteOne('cqlist',{_id:dbHelper.ObjectId(id)},result=>{
        res.send({
            msg:'删除成功',
            code:200
        })
    })
})
// 开启监听
app.listen(4399)