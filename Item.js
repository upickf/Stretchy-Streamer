Item = {
    make: function(name, desc, make){
        var item = {
            name: name,
            Text: name,
            desc: desc,
            make: make
        };
        
        return item;
    }
}


const green = '#62D2A2';
const pink = '#DD5B82';
const breadColor = '#ffd56d';

var makeFood = function(item, calories){
    item.calories = calories;
    item.originalSize = 1;
}

getAll =  function(){
    var result = [];
    for (var i in this){
        if (typeof this[i] !== "function")
            result.push(this[i]);
    }

    return result;
}

Items = {
    getAllCategories: function(){
        var categories = [];
        for (var i in this){
            if (typeof Items[i] !== "function"){
                var cat = {
                    Text: i,
                    Items: Items[i].getAll()
                }
                categories.push(cat);
            }
        }
        return categories;
    }
}

function eachItem(item){
    setCollisionFilter(item, {
        category: currentCategory,
        mask: catO | currentCategory
    });
}

Items.animals = {
    chick: Item.make("chick", "It's a chick", function(){
        var item = Animals.chick(spawn.position.x,spawn.position.y);
        eachItem(item)
        item.isItem = true;
        World.add(world, item);
        makeFood(item, 30);
    }),
    frog: Item.make("frog", "It's a frog", function(){
        var item = Animals.frog(spawn.position.x,spawn.position.y);
        eachItem(item)
        item.isItem = true;
        World.add(world, item);
        makeFood(item, 30);
    }),
    mice: Item.make("mice", "It's a mice", function(){
        var item = Animals.mice(spawn.position.x,spawn.position.y);
        eachItem(item)
        item.bodies.forEach(body => {
            body.parentItem = item;
            body.heavy = true;
            makeFood(body, 10);
            //Matter.Body.setMass(body, 0.1);
            Matter.Body.setDensity(body, body.density/10);
        });
        item.bodies[0].parts.forEach(part =>{
            makeFood(part, 10);
            part.parentItem = item;
            part.isPart = true;
        })

        item.isItem = true;
        
        World.add(world, item);
    }),
    snake: Item.make("snake", "It's a snake", function(){
        var item = Animals.snake(spawn.position.x,spawn.position.y);
        eachItem(item)
        item.bodies.forEach(body => {
            body.parentItem = item;
            makeFood(body, 10);
            //body.heavy = true;
            //Matter.Body.setMass(body, 0.1);
            //Matter.Body.setDensity(body, body.density/10);
        });
        item.isItem = true;
        World.add(world, item);
    }),
    
    getAll: getAll
}

Items.toys = {
    ragdoll: Item.make("ragdoll", "It's a ragdoll", function(){
        var item = ragdoll(spawn.position.x,spawn.position.y,0.5/2);
        eachItem(item)
        item.bodies.forEach(body => {
            body.parentItem = item;
            body.heavy = true;
            //Matter.Body.setMass(body, 0.1);
            Matter.Body.setDensity(body, body.density/10);
        });
        item.isItem = true;
        World.add(world, item);
    }),
    beads: Item.make("beads", "It's a beads", function(){
        var item = makeBeads(true);
        eachItem(item)
        item.bodies.forEach(body => {
            body.parentItem = item;
            //body.heavy = true;
            
            Matter.Body.setDensity(body, body.density/5);
            //Matter.Body.setInertia(body, body.inertia/2);
        });
        item.isItem = true;
        World.add(world, item);
    }),
    ball: Item.make("ball", "ball", function(){
        var item = Matter.Bodies.circle(spawn.position.x,spawn.position.y, 20/2);
        eachItem(item)
        item.isItem = true;
       // item.collisionFilter.mask = currentCategory;
       // item.collisionFilter.category = currentCategory;
        World.add(world, item);
        return item;
    }),
    getAll: getAll
}

Items.food = {
    cookie: Item.make("cookie", "It's a cookie", function(){
        var item = Matter.Bodies.circle(spawn.position.x,spawn.position.y, 12);
        eachItem(item)
        item.isItem = true;
        item.calories = 10;
        item.originalSize = 1;
       // item.collisionFilter.mask = currentCategory;
       // item.collisionFilter.category = currentCategory;
        World.add(world, item);
        return item;
    }),
    fishBalls: Item.make("fish balls", "It's string of fish balls", function(){
        var item = makeBeads(false);
        eachItem(item)
        item.bodies.forEach(body => {
            body.parentItem = item;
            //body.heavy = true;
            body.calories = 10;
            body.render.fillStyle = "#ffe100";
            body.originalSize = 1;
            Matter.Body.setDensity(body, body.density/5);
            //Matter.Body.setInertia(body, body.inertia/2);
        });
        item.isItem = true;
        World.add(world, item);
    }),
    getAll: getAll
}



/*    horse: Item.make("horse (may lag!)", "It's a plushie", function(){
        var item = makePlushie(shapeHorse, 10, green, 1300/2);
        item.bodies.forEach(body => {
            body.parentItem = item;
        });
        item.isItem = true;
        World.add(world, item);
        item.bodies.forEach(body=>{
            Matter.Body.setMass(body,0.001);
            body.heavy = true;
        })
        return item;
    }),
    heart: Item.make("heart (may lag!)", "It's a plushie", function(){
        var item = makePlushie(shapeHeart, 10, pink,1380/2);
        item.bodies.forEach(body => {
            body.parentItem = item;
        });
        item.isItem = true;
        World.add(world, item);
        item.bodies.forEach(body=>{
            Matter.Body.setMass(body,0.001);
            body.heavy = true;
        })
        return item;
    }),
    bread: Item.make("bread (may lag!)", "It's a bread", function(){
        var item = makePlushie(shapeBread, 15, breadColor,1420/2);
        item.bodies.forEach(body => {
            body.parentItem = item;
        });
        item.isItem = true;
        World.add(world, item);
        item.bodies.forEach(body=>{
            Matter.Body.setMass(body,0.001);
            body.heavy = true;
        })
        return item;
    }), */