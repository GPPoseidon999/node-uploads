const express = require('express')
const multer = require('multer')
const ejs = require('ejs')
const path = require('path')
const port = 4000
const app = express()
// 磁盘存储引擎
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    },
})
// 初始化upload
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    },
    limits: { fileSize: 1e6 },
}).single('myImage')

// 验证文件类型
function checkFileType(file, cb) {
    // 允许的文件扩展名格式
    const filetypes = /jpeg|jpg|png|gif/
    // 验证文件的扩展名
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    // 验证MIME
    const mimetype = filetypes.test(file.mimetype)
    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb('错误：只支持图片格式')
    }
}
// EJS
app.set('view engine', 'ejs')
// 创建public文件夹
app.use(express.static('./public'))
// 渲染index页面
app.get('/', (req, res) => res.render('index'))
// 获取上传post请求
app.post('/upload', (req, res) => {
    upload(req, res, (error) => {
        if (error) {
            res.render('index', { msg: error })
        } else {
            if (req.file === undefined) {
                res.render('index', {
                    msg: '错误： 请选择上传文件!',
                })
            } else {
                res.render('index', { msg: '文件上传成功', file: `uploads/${req.file.filename}` })
            }
        }
    })
})
app.listen(port, () => {
    console.log(`服务端运行端口为${port}......`)
})
