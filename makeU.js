function makeUterusPackage(){
    var group = Body.nextGroup(true);
    var uterus = Composites.stack(688/2, (1536-468)/2 , 49, 1, 10, 10, function(x, y) {
        return Bodies.circle(x, y, 10/2, { collisionFilter: { group: group },
        render: {
                fillStyle: '#C44D58'
            } });
    });
    Composites.chain(uterus, 0,0,0, 0, { stiffness:0.5, length: 0, render: { type: 'line', visible: false } });
    Composite.add(uterus, Constraint.create({
        bodyB: uterus.bodies[0],
        pointB: { x: 0, y: 0 },
        pointA: { x: 689/2, y: (1536-468)/2 },
        stiffness: 1,
        render: {visible: false}
    }));

    Matter.Body.setPosition(uterus.bodies[15],{x:659/2,y:(1536-536)/2});
    //Composites.chain(uterus, 0,0,0, 0, { stiffness: 1, length: 0, render: { type: 'line' } });
    Composite.add(uterus, Constraint.create({
        bodyB: uterus.bodies[15],
        pointB: { x: 0, y: 0 },
        pointA: { x: 659/2, y: (1536-536)/2 },
        stiffness: 1,
        render: {visible: false}
    }));

    Matter.Body.setPosition(uterus.bodies[33],{x:746/2,y:(1536-536)/2});
    //Composites.chain(uterus, 0,0,0, 0, { stiffness: 1, length: 0, render: { type: 'line' } });
    Composite.add(uterus, Constraint.create({
        bodyB: uterus.bodies[33],
        pointB: { x: 0, y: 0 },
        pointA: { x: 746/2, y: (1536-536)/2 },
        stiffness: 1,
        render: {visible: false}
    }));


    Matter.Body.setPosition(uterus.bodies[48],{x:686/2,y:(1536-468)/2});
    //Composites.chain(uterus, 0,0,0, 0, { stiffness: 1, length: 0, render: { type: 'line' } });
    Composite.add(uterus, Constraint.create({
        bodyB: uterus.bodies[48],
        pointB: { x: 0, y: 0 },
        pointA: { x: 696/2, y: (1536-468)/2 },
        stiffness: 1,
        render: {visible: false}
    }));

    var ropeA = Composites.stack(660/2, (1536-365)/2 , 29, 1, 10, 10, function(x, y) {
    return Bodies.circle(x, y, 6/2,{ collisionFilter: { group: group },
        render: {
            fillStyle: '#C44D58'
        } });
    });

    Composites.chain(ropeA, 0,0,0, 0, { stiffness: 1, length: 0, render: { type: 'line', visible: false } });
    Composite.add(ropeA, Constraint.create({
        bodyB: ropeA.bodies[0],
        pointB: { x: 0, y: 0 },
        pointA: { x: 660/2, y: (1536-365)/2 },
        stiffness: 1,
        render: {visible: false}
    }));


    Matter.Body.setPosition(ropeA.bodies[5],{x:690/2,y:(1536-370)/2});
    //Composites.chain(ropeA, 0,0,0, 0, { stiffness: 1, length: 0, render: { type: 'line' } });
    Composite.add(ropeA, Constraint.create({
        bodyB: ropeA.bodies[5],
        pointB: { x: 0, y: 0 },
        pointA: { x: 690/2, y: (1536-370)/2 },
        stiffness: 1,
        render: {visible: false}
    }));

    Matter.Body.setPosition(uterus.bodies[3],{x:675/2,y:(1536-485)/2});
    Matter.Body.setPosition(ropeA.bodies[28],{x:675/2,y:(1536-485)/2});
    //Composites.chain(ropeA, 0,0,0, 0, { stiffness: 1, length: 0, render: { type: 'line' } });
    Composite.add(ropeA, Constraint.create({
    bodyB: ropeA.bodies[28],
    bodyA: uterus.bodies[3],
    pointB: { x: 0, y: 0 },
    }));


    var ropeB = Composites.stack(738/2, (1536-365)/2 , 29, 1, 10, 10, function(x, y) {
    return Bodies.circle(x, y, 6/2,{ collisionFilter: { group: group },
        render: {
            fillStyle: '#C44D58'
        } });
    });
    Composites.chain(ropeB, 0,0,0, 0, { stiffness: 1, length: 0, render: { type: 'line', visible: false } });
    Composite.add(ropeB, Constraint.create({
        bodyB: ropeB.bodies[0],
        pointB: { x: 0, y: 0 },
        pointA: { x: 738/2, y: (1536-365)/2 },
        stiffness: 1,
        render: {visible: false}
    }));


    Matter.Body.setPosition(ropeB.bodies[5],{x:710/2,y:(1536-370)/2});
    //Composites.chain(ropeB, 0,0,0, 0, { stiffness: 1, length: 0, render: { type: 'line' } });
    Composite.add(ropeB, Constraint.create({
        bodyB: ropeB.bodies[5],
        pointB: { x: 0, y: 0 },
        pointA: { x: 710/2, y: (1536-370)/2 },
        stiffness: 1,
        render: {visible: false}
    }));


    Matter.Body.setPosition(uterus.bodies[43],{x:720/2,y:(1536-485)/2});
    Matter.Body.setPosition(ropeB.bodies[28],{x:720/2,y:(1536-485)/2});
    //Composites.chain(ropeB, 0,0,0, 0, { stiffness: 1, length: 0, render: { type: 'line' } });
    Composite.add(ropeB, Constraint.create({
        bodyB: ropeB.bodies[28],
        bodyA: uterus.bodies[43],
        pointB: { x: 0, y: 0 },
        //pointA: { x: 720, y: 1536-485 },
        stiffness: 1,
        render: {visible: false}
    }));
    return {
        uterus: uterus,
        ropeA: ropeA,
        ropeB: ropeB
    }
}