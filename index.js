const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dbConfig = require('./config.js');
const Music = require('./model.js');
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const PORT = 8000;

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(dbConfig.mongoURI, {
          useNewUrlParser: true,
        });
        console.log(`MongoDB Connection established`);
      } catch (err) {
        console.log('Could not connect to the database. Exiting now...', err);
        console.error(err.message);
        process.exit(1);
    }
}
connectDB();

app.get('/', (req, res) => {
    res.render("index")
});

// Adding songs in the database
app.post("/addsong", async(req, res) => {
    try{
        const music_data = await new Music(req.body);
        music_data.save();
        res.send("item saved to database");
    } catch(err){
        res.status(400).send("unable to save to database");
    }
});
// listing all the songs
app.get('/getSongs',async(req,res)=>{
    try{
        const music = await Music.find({});
        const count = await Music.count();
        res.render("table",{music: music, count: count});
    }catch(err){
        res.json({ "message" : "err"})
    }
})
// Deleting songs by id
app.post('/deleteSongs/:id',async(req,res) => {
    try{
        const music = await Music.findByIdAndDelete(req.params.id);
        console.log('Deleted Successfully');
        res.redirect('/getSongs');
    }catch(err) {
        res.json({ "message" : "err"});
    }
})

// Searching songs according to Director's Name
app.get('/director',async(req,res) => {
    try {
        const directorName = req.query.director;
        const music = await Music.find({ Music_director: directorName });
        res.render('search', { music: music });
    }catch(err){
        res.json(err.message);
    }
})
app.listen(PORT, () => {
    console.log(`server successfully running on port: ${PORT}`);
})


