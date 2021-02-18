const express = require('express');

const path = require ('path');
const mongoose=require('mongoose');
const Campground=require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log("Db連接了:)")
});



const app=express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views')) //去views資料夾拿ejs

app.get('/',(req,res)=>{
    res.send('home')
})

app.get('/campgrounds',async(req,res)=>{
   const campgrounds = await Campground.find({});  //Model.find() 是mongoose裡面的fun 可以去mongodb拿資料 (此頁的yelp-camp，)
   //而yelp-camp有東西是因為在SEEDS裡面建立完成。
   res.render('campgrounds/index',{campgrounds})
})

app.get('/campgrounds/:id',async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show',{campground});
 })



app.listen(3000,()=>{
   console.log('Serving on port 3000')
})