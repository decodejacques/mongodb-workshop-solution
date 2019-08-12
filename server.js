let express = require('express')
let app = express()
let MongoClient = require('mongodb').MongoClient;
let ObjectID = require('mongodb').ObjectID
let reloadMagic = require('./reload-magic.js')
let multer = require('multer')
let upload = multer({ dest: __dirname + '/uploads/' })
let sha1 = require('sha1')
reloadMagic(app)
app.use('/', express.static('build'));
app.use('/uploads', express.static('uploads'));
let dbo = undefined
let url = "mongodb+srv://bob2:bob123@mediaboard-uqm0t.mongodb.net/test?retryWrites=true&w=majority"
MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
    console.log(err)
    dbo = db.db("media-board")
})

app.post('/signup', (req, res) => {
    let username = req.body.username
    let password = req.body.password
    dbo.collection("users").insertOne({ username, password: sha1(password) })



})

app.get("/all-posts", (req, res) => {
    console.log("request to /all-posts")
    dbo.collection('posts').find({}).toArray((err, ps) => {
        if (err) {
            console.log("error", err)
            res.send("fail")
            return
        }
        console.log("posts", ps)
        res.send(JSON.stringify(ps))
    })
})
app.post('/login', upload.none(), (req, res) => {
    console.log("login", req.body)
    res.send(JSON.stringify({ success: true }))

})
app.post('/new-post',
    upload.fields([{ name: 'img', maxCount: 1 }, { name: 'snd', maxCount: 1 }]),
    (req, res) => {
        console.log("request to /new-post. body: ", req.body)
        let description = req.body.description
        let files = req.files
        let imgFile = files.img[0]
        let sndFile = files.snd[0]
        console.log(files)
        let frontendImgPath = '/uploads/' + imgFile.filename
        let frontendSndPath = '/uploads/' + sndFile.filename

        dbo.collection('posts').insertOne({
            description: description,
            frontendImgPath: frontendImgPath,
            frontendSndPath: frontendSndPath
        })
        res.send(JSON.stringify({ success: true }))
    })
app.post('/update', upload.none(), (req, res) => {
    console.log("request to /update")
    let id = req.body.id.toString()
    let desc = req.body.description
    console.log("sent from client", desc, id)
    dbo.collection('posts').updateOne(
        { "_id": ObjectID(id) },
        { $set: { description: desc } })
    res.send("success")
})
app.all('/*', (req, res, next) => {
    res.sendFile(__dirname + '/build/index.html');
})
app.listen(4000, '0.0.0.0', () => { console.log("Server running on port 4000") }) 