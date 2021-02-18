const express = require('express');

const path = require ('path');
const mongoose=require('mongoose');
const methodOverride = require('method-override');
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
app.set('views',path.join(__dirname,'views')); //去views資料夾拿ejs

app.use(express.urlencoded({extended:true})); //可以解析req內的東西
app.use(methodOverride('_method'));

app.get('/',(req,res)=>{
    res.send('home')
})

app.get('/campgrounds',async(req,res)=>{
   const campgrounds = await Campground.find({});  //Model.find() 是mongoose裡面的fun 可以去mongodb拿資料 (此頁的yelp-camp，)
   //而yelp-camp有東西是因為在SEEDS裡面建立完成。
   res.render('campgrounds/index',{campgrounds})
})


app.get('/campgrounds/new',(req,res)=>{

    res.render('campgrounds/new')
 })

app.post('/campgrounds',async(req,res)=>{
    console.log(req.body.campground);//{ title: '333333', location: '33322' }
    const campground = await Campground(req.body.campground);
    await campground.save();//moogose的語法
    res.redirect(`/campgrounds/${campground._id}`)
})


app.get('/campgrounds/:id',async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show',{campground});
 })


 app.get('/campgrounds/:id/edit',async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
 })

 app.put('/campgrounds/:id',async(req,res)=>{
    const{id} =req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`)
 })

app.listen(3000,()=>{
   console.log('Serving on port 3000')
})