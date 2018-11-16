Animal = {};
Animal.make = function(animal, step){
    animal.step = step;
    animal.isAnimal = true;

    Animal.all.push(animal);
    return animal;
}

Animal.all = [];
countStep = function(number, target, callback){
    if (!target.countStepTimer)
        target.countStepTimer = 0;
    target.countStepTimer ++; 
    if (target.countStepTimer > number){
        target.countStepTimer = 0;
        target.countStepCallback = callback;
        target.countStepCallback();
    }

}

Animals = {};
Animals.mice = function(x, y){
    var renderOptions={
        friction: 0,
        render: {
            fillStyle: "#b7b7b7"
        }
    }
    var miceHead = Bodies.rectangle(x,y, 20, 20, renderOptions),
        miceBody = Bodies.circle(x+10, y, 15, renderOptions),
        miceTail = Bodies.rectangle(x+40,y, 40, 4, renderOptions),
        mice = Matter.Body.create({
            parts: [miceHead, miceBody]
        });

    Matter.Body.rotate(miceHead, 40);  
    var miceTailConstraint = Matter.Constraint.create({
            bodyA: miceTail,
            pointA: {x: -20, y: 0},
            bodyB: mice,
            pointB: {x: 20, y: 0},
            stiffness:0.5
        })
    miceTailConstraint.length = 0;

    var miceComp = Matter.Composite.create();
    Matter.Composite.add(miceComp, mice);
    Matter.Composite.add(miceComp, miceTail);
    Matter.Composite.add(miceComp, miceTailConstraint);
    mice.friction = 0.2;

    Animal.make(miceComp, function(){
        countStep(15, miceComp, function(){
            //console.log( (mice.position.x-miceTail.position.x))
            Matter.Body.applyForce(mice, mice.position, {
                x: (mice.position.x-miceTail.position.x)*0.00005,
                y: (mice.position.y-miceTail.position.y)*0.00005
            })
        })
    })

    return miceComp;
}

Animals.chick = function(x,y){
    var chick = Bodies.circle(x+10, y, 10, {
        render: {
            fillStyle: "#ffff72"
        }
    });
    // /Matter.Body.setDensity(chick, chick.density/2);
    Animal.make(chick, function(){
        countStep(10, chick, function(){
            if (Math.round(chick.velocity.y) == 0)
                Matter.Body.setVelocity(chick, {x:chick.velocity.x + Math.random()*3-Math.random()*3, y: + Math.random()*5-Math.random()*5}) //-3
        })
    })

    return chick;
}


Animals.frog = function(x,y){
    var frog = Bodies.circle(x+10, y, 10, {
        render: {
            fillStyle: "#5dd865"
        }
    });
    //Matter.Body.setDensity(frog, frog.density/2);
    Animal.make(frog, function(){
        countStep(60, frog, function(){
            if (Math.round(frog.velocity.y) == 0)
                Matter.Body.setVelocity(frog, {x:frog.velocity.x + Math.random()*10-Math.random()*10, y: + Math.random()*10-Math.random()*10 })//-7
        })
    })

    return frog;
}

Animals.snake = function(x,y){
    Composites = Matter.Composites;

    var group = Matter.Body.nextGroup(true);
    var snake = Composites.stack(x, y, 6, 1, 30, 20, function(x, y) {
        /*return Bodies.rectangle(x, y, width, height, { frictionStatic: 1, frictionAir: 0.1, collisionFilter: { group: group }, render: {
              fillStyle: color
          } });*/
          var body =  Bodies.rectangle(x, y, 30, 10, { friction:0.5, frictionStatic: 1, frictionAir: 0.1, collisionFilter: { 
             
            //  group: group 
            }, render: {
              //fillStyle: color
          } });
  
          return body;    
    });
   Composites.chain(snake,  0.5, 0, -0.5, 0, { stiffness:0.2, length: 0, render: { type: 'line', visible: false }, damping: 0.001, });
   snake.bodies.forEach(body => {
       Matter.Body.setDensity(body, body.density/10)
   });

   snake.currentNode = 0;
    Animal.make(snake, function(){
        countStep(5, snake, function(){
            snake.currentNode++;
            if (snake.currentNode >= snake.bodies.length - 1)
                snake.currentNode = 0;
            var body = snake.bodies[snake.currentNode];
            //if (Math.round(body.velocity.y) == 0)
                //Matter.Body.setVelocity(body, {x:body.velocity.x, y: -5})

            for (var a = 0; a < snake.bodies.length-1; a ++){
                var fx =  (snake.bodies[a].position.x-snake.bodies[a+1].position.x)*0.00002;
                var fy =    (snake.bodies[a].position.y-snake.bodies[a+1].position.y)*0.000002
                /*Matter.Body.applyForce(body, body.position, {
                    x: fy,
                    y: -fx
                })*/

                Matter.Body.applyForce(snake.bodies[a], snake.bodies[a].position, {
                    x: fx,
                    y: fy
                })
            }
        })
    })

    return snake;
}