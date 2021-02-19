//此INDEX是用來建立資料庫內的東西而已
const mongoose = require('mongoose');
const cities = require('./cities');
const {places,descriptors}=require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random()*array.length)];//丟一個陣列(seedHelpers裡面的陣列)到sample這個裡面 會回傳值
console.log(descriptors[0]);

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp =new Campground({
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/190727',
            descriptions:'暫時評論',
            price
        })
        await camp.save();
    }
}

seedDB().then(() =>{
    mongoose.connection.close();
})