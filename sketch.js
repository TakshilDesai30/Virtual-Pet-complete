var dog, dog1, HappyDog, sadDog;
var database, dogref;
var foodS;
var bg;
var feed, addFood, fedTime, lastFed, foodO;
var readGS;
var bedroom, garden, washroom;
var currentTime;

function preload() {
    dog1 = loadImage("images/dogImg.png");
    HappyDog = loadImage("images/dogImg1.png");
    bg = loadImage("field.png");
    bedroom=loadImage("images/bedroom.png");
    garden=loadImage("images/Garden.png");
    washroom=loadImage("images/washroom.png");
    sadDog=loadImage("images/sadDog.png");
}

function setup(){
    database = firebase.database();
    createCanvas(1000,500);
    food1=new Food();
    dog = createSprite(900,300,50,100);

    dogref = database.ref("food");
    dogref.on("value",readStock,showError);

    feed=createButton("Feed Padfoot");
    feed.position(700,95);
    feed.mousePressed(feedPadfoot);

    addFood=createButton("Add food");
    addFood.position(820,95);
    addFood.mousePressed(increaseFood);

    timeRef=database.ref("fedTime");
    timeRef.on("value",function(data){
        lastFed=data.val();
    });   
    
    readGS=database.ref("gameState");
    readGS.on("value", function(data){
        gameState=data.val();
    });
}

function draw(){
    textFont("Comic Sans MS");
    fill("red");
    textSize(20);
    text("Food Remaining: "+foodS,150,100);
    text("Press the up arrow to feed Padfoot.",100,50);

    if(lastFed>=12) {
        text("Last fed at: "+lastFed%12+" p.m.",750,50);
    } else if (lastFed===0) {
        text("Last fed at: 12 a.m.",750,50);
    } else {
        text("Last fed at: "+lastFed+" a.m.",750,50);
    }
    currentTime=hour();
    if (currentTime===(lastFed+1)) {
        food1.Garden();
        updateGS("Playing");
        dog.addImage(dog1);
        dog.scale=0.3;
        textFont("Arial");
        fill(0);
        text("Playing is so much fun.",450,40);
    } else if (currentTime===(lastFed+2)) {
        food1.Bedroom();
        updateGS("Sleeping");
        dog.addImage(dog1);
        dog.scale=0.3;
        textFont("Arial");
        fill(0);
        text("Let me sleep...",450,40);
    } else if (currentTime>(lastFed+2) && currentTime<=(lastFed+4)) {
        food1.Washroom();
        updateGS("Bathing");
        dog.addImage(dog1);
        dog.scale=0.3;
        textFont("Arial");
        fill(0);
        text("Bath time! Yay!",450,40);
    } else {
        updateGS("Hungry");
        food1.display();
        dog.addImage(dog1);        
        dog.scale=0.3;
        textFont("Arial");
        fill(0);
        text("I'm hungry.",850,180);
    }
    if (gameState!=="Hungry") {
        feed.hide();
        addFood.hide();
        dog.remove();
    } else {
        feed.show();
        addFood.show();
        dog.addImage(sadDog);
    }
    drawSprites();
}
function readStock(data) {
    foodS = data.val();
}
function showError() {
    console.log("Cannot read the values from the database.");
}
function feedPadfoot() {
    dog.addImage(HappyDog);
    dog.x=850;
    if (foodS>=1) {
    foodS-=1;
    }
    food1.updateStock(foodS);
    lastFed=hour();
    updateHour(hour());
}
function increaseFood() {
    dog.addImage(dog1);
    if (foodS<20) {
    foodS+=1;
    }
    food1.updateStock(foodS);
}
function updateHour(lastFedTime) {
    database.ref("/").update({fedTime:lastFedTime});
}
function updateGS(state) {
    database.ref("/").update({gameState:state});
}
