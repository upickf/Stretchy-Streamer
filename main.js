Bounds = Matter.Bounds;
class Line {
    constructor(defaultPoints = [], lineWidth = 1, miterLimit = 10) {
      this.points = defaultPoints;
      this.outsidePoints = [];
      this.insidePoints = [];
      this.lineWidth = lineWidth;
      this.miterLimit = miterLimit;
  
      if (this.points.length > 0) {
        this.calculatePoints();
      }
    }
    clear() {
      this.points = [];
      this.outsidePoints = [];
      this.insidePoints = [];
    }
    addPoint(point) {
      this.points.push(point);
      this.calculatePoints();
    }
    calculatePoints() {
      this.outsidePoints = [];
      this.insidePoints = [];
      if (this.points.length <= 1) return;
      for (let index = 0; index < this.points.length; index++) {
        if (index === 0) {
          this.calculateFirstPoint(index);
        } else if (index === this.points.length - 1) {
          this.calculateLastPoint(index);
        } else {
          this.calculateMiddlePoint(index);
        }
      }
    }
    calculateFirstPoint(index) {
      const point = this.points[index];
      const afterPoint = this.points[index + 1];
      const rad =
        Math.atan2(afterPoint.y - point.y, afterPoint.x - point.x) - Math.PI / 2;
      const sin = Math.sin(rad) * this.lineWidth;
      const cos = Math.cos(rad) * this.lineWidth;
      this.outsidePoints.push({ x: point.x + cos, y: point.y + sin });
      this.insidePoints.push({ x: point.x - cos, y: point.y - sin });
    }
    calculateLastPoint(index) {
      const point = this.points[index];
      const beforePoint = this.points[index];
      const rad =
        Math.atan2(this.points[index - 1].y - point.y, this.points[index - 1].x - point.x) + Math.PI / 2;
      const sin = Math.sin(rad) * this.lineWidth;
      const cos = Math.cos(rad) * this.lineWidth;
      this.outsidePoints.push({ x: point.x + cos, y: point.y + sin });
      this.insidePoints.push({ x: point.x - cos, y: point.y - sin });
    }
    calculateMiddlePoint(index) {
      const point = this.points[index];
      let rad1 = Math.atan2(this.points[index - 1].y - point.y, this.points[index - 1].x - point.x);
      let rad2 = Math.atan2(this.points[index + 1].y - point.y, this.points[index + 1].x - point.x);
      // rad1 = 0° にした、二等分線になっている
      const rad = (rad2 - rad1) / 2;
      const x = Math.cos(rad) * this.lineWidth / Math.sin(rad);
      const y = this.lineWidth;
      const distance = getDistance({ x: 0, y: 0 }, { x, y });
      // 回転移動させる
      const rx = x * Math.cos(rad1) - y * Math.sin(rad1);
      const ry = x * Math.sin(rad1) + y * Math.cos(rad1);
      rad1 -= Math.PI / 2;
      rad2 += Math.PI / 2;
      if (distance > this.miterLimit && x < 0) {
        this.outsidePoints.push({ x: point.x - Math.cos(rad1) * this.lineWidth, y: point.y - Math.sin(rad1) * this.lineWidth });
        this.outsidePoints.push({ x: point.x - Math.cos(rad2) * this.lineWidth, y: point.y - Math.sin(rad2) * this.lineWidth });
      } else {
        this.outsidePoints.push({ x: point.x + rx, y: point.y + ry });
      }
      if (distance > this.miterLimit && x >= 0) {
        this.insidePoints.push({ x: point.x + Math.cos(rad1) * this.lineWidth, y: point.y + Math.sin(rad1) * this.lineWidth });
        this.insidePoints.push({ x: point.x + Math.cos(rad2) * this.lineWidth, y: point.y + Math.sin(rad2) * this.lineWidth });
      } else {
        this.insidePoints.push({ x: point.x - rx, y: point.y - ry });
      }
    }
    getVertices() {
      const vertices = this.outsidePoints.concat(this.insidePoints.reverse());
      this.insidePoints.reverse();
      return vertices;
    }
  }
  
  function getDistance(point1, point2) {
    // 三平方の定理
    const a = Math.abs(point1.x - point2.x);
    const b = Math.abs(point1.y - point2.y);
    return Math.sqrt(a * a + b * b);
  }

  class MatterLine extends Line {
    constructor(world, defaultPoints = [], bodyOptions) {
      super(defaultPoints, 1, 10);
      this.lineWidth = 1;
        this.miterLimit = 10;
        this.bodyOptions = bodyOptions;
      this.world = world;
      this.body = null;
      this.generateBody();
    }
    addPoint(point) {
      super.addPoint(point);
      this.generateBody();
    }
    generateBody() {
      const vertices = this.getVertices();
      if (vertices.length <= 2) {
        if (this.body !== null) {
          World.remove(this.world, this.body);
        }
        this.body = null;
      } else {
        if (this.body !== null) {
          World.remove(this.world, this.body);
        }
        this.body = Bodies.fromVertices(0, 0, vertices, this.bodyOptions);
        World.add(this.world, this.body);
        const bounds = Bounds.create(vertices);
        Body.setPosition(this.body, {
          x: this.body.position.x - this.body.bounds.min.x + bounds.min.x,
          y: this.body.position.y - this.body.bounds.min.y + bounds.min.y
        });
        Body.setStatic(this.body, true);
      }
    }
  }

  lines = [];
  makeLines = function(paths){
      
    paths.forEach(path => {
        var points = [];
        path.bodies.forEach(body => {
            points.push({
                x: body.position.x,
                y: body.position.y,
                parentBody: body
            })
        })
        line = new MatterLine (world, points, {
            collisionFilter: path.bodies[0].collisionFilter,
            render: {
                fillStyle: 'transparent',
                strokeStyle: c_red,
                lineWidth: 0
            }
        });
        path.bodies.forEach(body => {
            body.parentLine = line;
        })
        lines.push(line);
    })
  }


staticChain = [];
staticChains = [];
function makeStaticChain(parentChain){
    parentChain.bodies.forEach(body=>{
        var circle = Bodies.rectangle(body.position.x, body.position.y, 12,6,{ 
          isStatic: true,
          collisionFilter: { group: body.collisionFilter.group },
          render: {
            //fillStyle: 'transparent'
          }
        }); 

        /*Bodies.circle(body.position.x, body.position.y, 6,{ 
          isStatic: true,
          collisionFilter: { group: body.collisionFilter.group }
        });  */
        circle.parentChainBody = body;
        staticChain.push(circle);
      });
}

//--FUNCTIONS-----------------------------------------------------------------------------
var createChainAuto= function(stiffness, width, height, color, coords, nextGroup){
    if (typeof nextGroup == 'undefined')
        nextGroup = true;

    for (var i = 0; i < coords.length; i ++)
        coords[i] /= 2;
    width /= 2;
    height/=2;

  var totalDist = 0;
  for (var i = 0; i < coords.length-2; i += 2){
    var a = coords[i+2] - coords[i];
    var b = coords[i+3] - coords[i+1];
    totalDist += Math.sqrt(a*a + b*b);
  }

  var num = totalDist*1.5/height + 1;
  num/=8;
  var chain = createChain(coords[0], coords[1], num, stiffness, width, height, color, nextGroup);
  var dist = 0;
  for (var i = 0; i < coords.length-2; i += 2){
    var a = coords[i+2] - coords[i];
    var b = coords[i+3] - coords[i+1];
    dist += Math.sqrt(a*a + b*b);
    var index = Math.floor(dist/totalDist*num);
    createConstraint(chain, index, coords[i+2], coords[i + 3]);
  }

  createConstraint(chain, chain.bodies.length-1, coords[coords.length-2], coords[coords.length - 1], 0.5);
  makeStaticChain(chain);
  staticChains.push(chain);
  return chain;
}

var createChain = function(xx, yy, num, stiffness, width, height, color, nextGroup){
  var group;
  if (nextGroup){
    group = Body.nextGroup(true);
    lastGroup = group;
  }else{
    group = lastGroup;
    console.log("false")
  }


  /*
var chain = Composites.stack(xx, yy, num, 1, 10/2, 10/2, function(x, y) {
        var body =  Bodies.circle(x, y, height, { isSensor: true, frictionStatic: 1, frictionAir: 0.1, collisionFilter: { group: group }, render: {
            fillStyle: color
        } });
        toUpdate.push(body);

      return body;    
});
  */

  var chain = Composites.stack(xx, yy, num, 1, 10/2, 10/2, function(x, y) {
      /*return Bodies.rectangle(x, y, width, height, { frictionStatic: 1, frictionAir: 0.1, collisionFilter: { group: group }, render: {
            fillStyle: color
        } });*/
        var body =  Bodies.rectangle(x, y, width*6, height*2, { frictionStatic: 1, frictionAir: 0.1, collisionFilter: { group: group }, render: {
            fillStyle: 'transparent'//color
        } });
        /*var body =  Bodies.circle(x, y, width, { frictionStatic: 1, frictionAir: 0.1, collisionFilter: { group: group }, render: {
            fillStyle: color
        } });*/
          toUpdate.push(body);

        return body;    
  });
  chain.bodies[0].render.fillStyle = color;
  chain.bodies[ chain.bodies.length-1].render.fillStyle = color;

 Composites.chain(chain,  0.4, 0, -0.4, 0, { stiffness:stiffness, length: 0, render: { type: 'line', visible: false }, damping: 0.001 });
 Composite.add(chain, Constraint.create({
     bodyB: chain.bodies[0],
     pointB: { x: 0, y: 0 },
     pointA: { x: xx, y: yy },
     stiffness: stiffness,
     render:{visible: false}
 }));
  return chain;
}

var createConstraint = function(chain, index, xx, yy, stiffness){
  Matter.Body.setPosition(chain.bodies[index],{x:xx,y:yy});
  Composite.add(chain, Constraint.create({
      bodyB: chain.bodies[index],
      pointB: { x: 0, y: 0 },
      pointA: { x: xx, y: yy },
      stiffness: 0.01,
      damping: 0.1,
      render: {visible: false}
  }));
}

var createConstraintBody = function(chain, index, chain2, index2, xx, yy){
  Matter.Body.setPosition(chain.bodies[index],{x:xx,y:yy});
  Matter.Body.setPosition(chain2.bodies[index2],{x:xx,y:yy});
  Composite.add(chain, Constraint.create({
      bodyB: chain.bodies[index],
      bodyA: chain2.bodies[index2],
      pointB: { x: 0, y: 0 },
      pointA: { x: 0, y: 0 },
      stiffness: 0.5,
      render: {visible: false}
  }));
  //createConstraint(chain2, index2, xx, yy);
}

function setCollisionFilter(object, filter){
    if (object.collisionFilter){
        if (filter.category)
            object.collisionFilter.category = filter.category
        if (filter.mask)
            object.collisionFilter.mask = filter.mask
        if (filter.group)
            object.collisionFilter.group = filter.group
    }else if (object.bodies) 
        object.bodies.forEach(body => {
            if (!body.collisionFilter)
                body.collisionFilter = {
                    group: 0
                }
            if (filter.category)
                body.collisionFilter.category = filter.category
            if (filter.mask)
                body.collisionFilter.mask = filter.mask
            if (filter.group)
                body.collisionFilter.group = filter.group
        });
}

function setOpacity(composite, opacity){
    composite.bodies.forEach(body => {
        body.render.opacity = opacity;
    });
}

currentDoor = 'front';
//--------------
function setDoor(door){
    currentDoor = door;
    if (door == "front"){
        AppForm.windowMain.Controls.radioFront.ActionCheck()
        currentCategory = catU;
        //mouseConstraint.collisionFilter.mask = defaultMask;
        mouseConstraint.collisionFilter.category = catU| catO;
        u.forEach(composite => {
            setOpacity(composite, 1);
        })
        l.forEach(composite => {
            setOpacity(composite, 0.1);
        })
    }else{
        AppForm.windowMain.Controls.radioBack.ActionCheck()
        currentCategory = catL;
       // mouseConstraint.collisionFilter.mask = catL | catO;
        mouseConstraint.collisionFilter.category = catL| catO;
        u.forEach(composite => {
            setOpacity(composite, 0.1);
        })
        l.forEach(composite => {
            setOpacity(composite, 1);
        })
    }
}

// Converts from radians to degrees.
Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
  };

walls = [];
function makeWall(x,y,w,h, angle){
    var wall = Bodies.rectangle(x/2, y/2, w/2, h/2, {
        isStatic: true,
        angle:Math.radians(angle),
        render: {
            fillStyle: 'transparent'
        }
    })

    walls.push(wall);
    return wall;
}

//---------------VW---------------------------------------------------------------
 /*var cavityU = createChain(688, 1536 - 468, 49,1,4,4,c_red);
createConstraint(cavityU, 15, 659, 1536 - 546);
createConstraint(cavityU, 33, 746, 1536 - 546);
createConstraint(cavityU, 48, 706, 1536 - 468);

var cavityVLeft = createChain(660, 1536-365, 30,1, 4,4,c_red);
createConstraint(cavityVLeft, 5, 690, 1536 - 370);
createConstraintBody(cavityVLeft, 29, cavityU, 9, 675, 1536-485);
//createConstraint(cavityVLeft, 29, 675, 1536 - 485);

var cavityVRight = createChain(738, 1536 - 365, 30,1, 4,4,c_red);
createConstraint(cavityVRight, 5, 700, 1536 - 370);
createConstraintBody(cavityVRight, 29, cavityU, 40, 675, 1536-485);*/

//createConstraint(cavityVRight, 29, 720, 1536 - 485);
//--------------------------------------------------------------------------------------
//createChainAuto= function(stiffness, width, height, color, coords)

function startGame(){
 Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Common = Matter.Common,
        Constraint = Matter.Constraint,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        World = Matter.World,
        Bodies = Matter.Bodies;

    // create engine
    engine = Engine.create(),
        world = engine.world;

        //engine.constraintIterations = 0.2;
        engine.enableSleeping = true

    GRAVITY = 1;
    MOUSE = 0.006;
    ZOOM = 1;
    ZOOMINC = 0.1;
    FAT = 1;
    HEIGHT = 1360;
    WIDTH = 768;
        world.gravity.y = 0;

    drawBase = false;

    // create renderer
    render = Render.create({
        element: gameCanvas,//AppForm.winGame.Controls.paneGame.Elm(),//document.getElementById('ngApp'),
        engine: engine,
        options: {
            showSleeping: false,
            width: 1360,
            height: 768,
            showAngleIndicator: false,
            showCollisions: false,
            showVelocity: false,
            wireframes: false
        }
    });
    
    doDigest = true;
    fatten = function(percent){
        FAT *= percent;
        //render.canvas.style.backgroundPosition = `-${(FAT-1)/2*1360}px 0px`;
        zoom(ZOOM, true);

        cons = []
        Matter.Composite.allConstraints(world).forEach(con=>{
            if (!con.bodyA || !con.bodyB){
                //if (con.pointB.x == 0 && con.pointB.y==0)
                    con.pointA.x *= percent;
                    if (con.pointB)
                        con.pointB.x *= percent;
            }
        })

        if (tick % 5 == 0){
            world.bodies.forEach(body=>{
                Matter.Sleeping.set(body, false);
              })
        }

        lines.forEach(line => {
            line.isCollided = true;
        })
        
        walls.forEach(wall => {
            
            Matter.Body.translate(wall, {
                x: wall.position.x * (percent-1),
                y: 0
            })
        })

    }

    zoom = function(value, doNoteUpdate){
        var doNoteUpdate = doNoteUpdate || false;
        render.canvas.style.backgroundSize = `${1360*value*FAT}px ${768*value}px`;
        render.options.width = 1360*value;
        render.options.height = 768*value;
        /*render.bounds.max = {
            x:  1360*value,
            y: 768*value
        }*/
        if (!doNoteUpdate){
            render.canvas.width = 1360*value
            render.canvas.height = 768*value
        }
        AppForm.paneGame.SetBounds({L:0, T: 0, W: value*1360, H: value*768})
        //AppForm.winGame.Controls.paneGame.SetBounds({L:0, T: 0, W: value*1360, H: value*768})
    }

    zoomIn = function(){
        ZOOM += ZOOMINC;
        zoom(ZOOM);
    }

    zoomOut = function(){
        ZOOM -= ZOOMINC;
        zoom(ZOOM);
    }
    //this.engine.render.textures['particle-texture'] = new ParticleTexture().canvas;

    //engine.world.gravity.y = 0
    Render.run(render);
    

    // create runner
    runner = Runner.create();
    Runner.run(runner, engine);

    var defaultCategory = 0x0001,
    redCategory = 0x0002,
    greenCategory = 0x0004,
    blueCategory = 0x0008;

    c_red = '#C44D58';

    toUpdate = [];

    uterusPackage = makeUterusPackage();

    VBodies = [];
    uterusPackage.ropeA.bodies.forEach(body => {
        VBodies.push(body);
    })

    uterusPackage.ropeB.bodies.slice().reverse().forEach(function(body) {
        VBodies.push(body);
    })

    cavityLILeft = createChainAuto(0.07, 10,10,c_red,
        [677, 1536 - 360, 679, 1536 - 427, 811, 1536 - 516, 782, 1536 - 635, 641, 1536 - 638, 595, 1536 - 485]);
    cavityLIRight = createChainAuto(0.07,10,10,c_red,
        [710, 1536 - 360, 730, 1536 - 400, 855, 1536 - 503, 807, 1536 - 675, 605, 1536 - 670, 569, 1536 - 467, 596,1536 - 458], false);

    LIBodies = [];
    cavityLILeft.bodies.forEach(body => {
        LIBodies.push(body);
    })

    cavityLIRight.bodies.slice().reverse().forEach(function(body) {
        LIBodies.push(body);
    })

/*
    liningSILeft = createChainAuto(1, 5,5,c_red,
        [595,1536 -  485, 718, 1536 - 488, 618, 1536 - 504, 622,1536 -  536, 769, 1536 - 545, 625, 1536 - 541, 634, 1536 - 577,
        760, 1536 - 583, 638,1536 -  583, 648, 1536 - 623, 715,1536 -  617]);

    liningSIRight= createChainAuto(1, 5,5,c_red,
    [596,1536 - 456, 793,1536 - 518, 638, 1536 -520, 787,1536 - 528, 786,1536 - 561, 646,1536 - 556, 784,1536 - 566, 775, 1536 -598, 662, 1536 -602,
        742,1536 - 613]);
*/
    /*
    var liningESleft = createChainAuto(0.7, 8,8,c_red,
    [713,1536 - 1183, 715,1536 - 800, 675, 1536 -731]);
    var liningESRight= createChainAuto(0.7, 8,8,c_red,
    [752,1536 - 1185, 732,1536 - 834, 756, 1536 -854, 803,1536 - 816, 759,1536 - 706, 675,1536 - 731]);
    */

    var liningESleft = createChainAuto(0.05, 10,10,c_red,
    [703,1536 - 1183, 714, (1536 - 1183+1536 - 800)/2,695,1536 - 800, 675, 1536 -731], false);
    var liningESRight= createChainAuto(0.05, 10,10,c_red,
    [762,1536 - 1185, (752+732)/2,  (1536 - 1185+1536 - 834)/2,752,1536 - 834, 766, 1536 -854, 803,1536 - 816, 759,1536 - 706, 675,1536 - 731], false);
    
    LSBodies = [];
    liningESleft.bodies.forEach(body => {
        LSBodies.push(body);
    })

    liningESRight.bodies.slice().reverse().forEach(function(body) {
        LSBodies.push(body);
    })

    var circle = Matter.Bodies.circle(250, 50, 20);
    Matter.Body.setDensity(circle, 0.0001);
    catU = 0x0002;
    catL = 0x0008;
    catO = 0x0001;
    catW = 0x00016;

    defaultMask = 4294967295;
    u = [uterusPackage.ropeA,
        uterusPackage.ropeB,
        uterusPackage.uterus]
        
    u.forEach(composite => {
            setCollisionFilter(composite, {
                category: catU,
                mask: catU
            });
        })

    l =[cavityLILeft,
        cavityLIRight]
    l.forEach(composite => {
            setCollisionFilter(composite, {
                category: catL,
                mask: catL
            });
        })

    e = [liningESleft, liningESRight];
    [e].forEach(group => {
        group.forEach(comp => {
            comp.bodies.forEach(body => {
                body.digest = true;
            })
        })
    })


        



    var bin = Bodies.rectangle(2720/2/2, 1536/2/2, 100/2, 100/2, { //isStatic: true,
        render: {
                strokeStyle: '#ffffff',
                sprite: {
                    texture: 'bin.png'
                }
    } })

    /*wallpaper = Bodies.rectangle(2720/2, 1536/2, 2720, 1536, { isStatic: true,
        collisionFilter: {
            mask: greenCategory
        },
        render: {
                strokeStyle: '#ffffff',
                sprite: {
                    texture: 'bg2.png'
                }
    } });//https://gelbooru.com/index.php?page=post&s=view&id=4447664*/

        //World.add(world, staticChain);

        World.add(world, [
            
            Bodies.rectangle(2720/2/2, 1500/2, 2720/2, 50, {
                isStatic: true,
                collisionFilter:{
                    //category:catW
                },
                render: {
                    fillStyle: 'transparent',
                    lineWidth: 1
                }
            }),
            Bodies.rectangle(2720/2/2, 0, 2720/2, 50, {
                isStatic: true,
                collisionFilter:{
                    //category:catW
                },
                render: {
                    fillStyle: 'transparent',
                    lineWidth: 1
                }
            }),
            Bodies.rectangle(0, 768/2, 50, 768, {
                isStatic: true,
                collisionFilter:{
                    //category:catW
                },
                render: {
                    fillStyle: 'transparent',
                    lineWidth: 1
                }
            }),
            Bodies.rectangle(1340, 768/2, 50, 768, {
                isStatic: true,
                collisionFilter:{
                    //category:catW
                },
                render: {
                    fillStyle: 'transparent',
                    lineWidth: 1
                }
            }),
            //wallpaper,
            bin,
            
            /*makeWall(650,364,100,20,-15),
            makeWall(812,364,100,20,15),*/

            cavityLILeft,
            cavityLIRight,

            //cavityVLeft,
            //cavityVRight,
            //cavityU,
            uterusPackage.ropeA,
            uterusPackage.ropeB,
            uterusPackage.uterus,
            //liningSILeft,
            //liningSIRight,
            liningESleft,
            liningESRight
        ]);


        e.forEach(composite => {
            composite.bodies.forEach(body => {
                Matter.Body.setDensity(body, body.density/5);
            })
        });

        u.forEach(composite => {
            composite.bodies.forEach(body => {
                //body.isSensor = true;
                //Matter.Body.setDensity(body, body.density);
            })
        });

        l.forEach(composite => {
            composite.bodies.forEach(body => {
                body.isSensor = true; //////////////////////////////////////////////////////
                //Matter.Body.setDensity(body, body.density/5);
            })
        });

        bin.doDelete = true;

        // add mouse control
        mouse = Mouse.create(render.canvas),
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: MOUSE,//0.002,
                    render: {
                        visible: false
                    }
                }
            });

        Matter.Events.on(mouseConstraint, "mousedown", function(){

        });

        dragging = false;
        draggedItem = false;
        Matter.Events.on(mouseConstraint, "startdrag", function(event){
            dragging = true;
            var item = event.body;
            draggedItem = item;
            if (draggedItem.isSpawn){
                Matter.Body.setStatic(draggedItem, false);
            }

            if (item.parentItem)
                item = item.parentItem;
            if (!item.isItem)
                return;

            
            setCollisionFilter(item, {
                category: currentCategory,
                mask: catO | currentCategory
            });
        });

        Matter.Events.on(mouseConstraint, "enddrag", function(event){
            if (draggedItem.isSpawn){
                Matter.Body.setStatic(draggedItem, true);
            }

            //mouseConstraint.constraint.stiffness = 0.002;
            dragging = false;
            draggedItem = false;
        });

        Matter.Events.on(mouseConstraint, "startdrag", function(event){

            var item = event.body;
            draggedItem = item;
            if (item.parentItem)
                item = item.parentItem;
            if (!item.isItem)
                return;

            
            setCollisionFilter(item, {
                category: currentCategory,
                mask: catO | currentCategory
            });
        });


        toFatten = 1;
        var fattenCounter = 0;
        Matter.Events.on(engine, 'collisionActive', function(e) {
            fattenCounter++;
            if (fattenCounter > 6 && toFatten != 1){
                fatten(toFatten);
                toFatten = 1;
                fattenCounter = 0;
            }

            var pairs = e.pairs;
            totalCol = pairs.length;
            // change object colours to show those in an active collision (e.g. resting contact)
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i];
                checkDelete(pair);
                checkDigest(pair);
                checkLines(pair);

            }
        });

        var checkLines = function(pair){
            if((pair.bodyA.parentLine || pair.bodyB.parentLine ) && !(pair.bodyA.parentLine && pair.bodyB.parentLine) && !(pair.bodyA.isStatic || pair.bodyB.isStatic) ){
                var line = pair.bodyA.parentLine || pair.bodyB.parentLine;
                line.isCollided = true;
                //pair.bodyA.render.fillStyle = "#00ff3b";
                //pair.bodyB.render.fillStyle = "#00ff3b";
            }
        }

        var checkDigest =function(pair){
            if (!doDigest)
                return;

            var calories;
            var food;
            if (pair.bodyA.calories){
                food = pair.bodyA;
                calories = food.calories;
            }else if (pair.bodyB.calories){
                food = pair.bodyB;
                calories = food.calories;
            }
            var digest = pair.bodyA.digest || pair.bodyB.digest;
            if (food && digest){
                toFatten *= 1+calories/1000000;
                Matter.Body.scale(food, 0.999, 0.999);
                food.originalSize -= 0.001;
                //console.log(food.originalSize);
                if (food.originalSize < 0.5){
                    if (!food.parentItem)
                        Matter.World.remove(world, food);
                    else if (food.isPart)
                        Matter.World.remove(world, food.parentItem);
                    else
                        Matter.Composite.remove(food.parentItem, food)
                }
            }
        }

        var checkDelete = function(pair){
            if (pair.bodyA.doDelete){
                if (pair.bodyB.isItem)
                    Matter.World.remove(world, pair.bodyB);
                else if(pair.bodyB.parentItem){
                    Matter.World.remove(world, pair.bodyB.parentItem);
                    pair.bodyB.parentItem.remove()
                }
            }
            if (pair.bodyB.doDelete){
                if (pair.bodyA.isItem)
                    Matter.World.remove(world, pair.bodyA);
                else if(pair.bodyA.parentItem){
                    Matter.World.remove(world, pair.bodyA.parentItem);
                    pair.bodyA.parentItem.remove()
                }
            }
        }

        var lastLoop = new Date();

        var frameCount = 0;
        Matter.Events.on(engine, 'afterUpdate', function(event) {
            /*var thisLoop = new Date();
            fps = 1000 / (thisLoop - lastLoop);
            lastLoop = thisLoop;*/
            fpsCheck();
            world.bodies.forEach(body => {
                //Matter.Body.setInertia(body, 0.1);
            })
            if (dragging && draggedItem){
                if (draggedItem.heavy){
                    //mouseConstraint.constraint.stiffness = 0.02;
                    /*Body.setPosition(draggedItem, {
                        x: mouse.position.x,
                        y: mouse.position.y
                    });*/
                }
            }
        reported = false;




        if(mouseConstraint.mouse.button == 2){
        //console.log("trigger");
        var marble = Bodies.circle(mouse.position.x, mouse.position.y, 5);
        makeFood(marble, 10);
        World.add(world, marble);
        Matter.Body.setDensity(marble, marble.density/20);
        setCollisionFilter(marble, {
            category: currentCategory,
            mask: catO | currentCategory
        });
            }
            frameCount ++;
            if (frameCount == 50){
            for (var a = 0; a < toUpdate.length; a ++)
                toUpdate[a].parts[0].isSensor = false;
            }
            if(mouseConstraint.mouse.button == 1){
                
            }
        });

        tick = 0;
        counterLines = 0;
        spawn = false;
        Matter.Events.on(engine, "beforeUpdate", function(){
            
            counterLines ++;
            Animal.all.forEach(animal => {
                animal.step();
            })

            if (counterLines > 0/*lines.length*/){
                tick ++;
                counterLines = -1;
                var line = lines[tick % lines.length];
                if (line){
                    if (line.isCollided || !READY){
                        line.isCollided = false;
                        line.points.forEach(point => {
                            point.x = point.parentBody.position.x;
                            point.y = point.parentBody.position.y;
                        })

                        line.calculatePoints() 
                        line.generateBody();
                    }

                    line.body.render.opacity = line.points[0].parentBody.render.opacity;
                        line.body.parts.forEach(part => {
                            part.render.opacity = line.points[0].parentBody.render.opacity;
                            //part.render.visible - true;
                    })
                }
            }
            /*lines.forEach(line => {
                line.points.forEach(point => {
                    point.x = point.parentBody.position.x;
                    point.y = point.parentBody.position.y;
                })

                line.calculatePoints() 
                line.generateBody();
                line.body.render.opacity = line.points[0].parentBody.render.opacity;
                line.body.parts.forEach(part => {
                    part.render.opacity = line.points[0].parentBody.render.opacity;
                    //part.render.visible - true;
                })
                //line.body.render.opacity = line.points[0].parentBody.render.opacity
            })*/
            /*
            staticChain.forEach(body=>{
                Matter.Body.translate(body, {
                    x: body.parentChainBody.position.x - body.position.x,
                    y: body.parentChainBody.position.y - body.position.y,
                })
                body.collisionFilter = body.parentChainBody.collisionFilter;
                
                Matter.Body.rotate(body, body.parentChainBody.angle - body.angle);
              });*/
        })

        /*Matter.Events.on(render, "beforeRender", function(){
            lines.forEach(line => {
                var opacity = line.points[0].parentBody.render.opacity;
                line.body.render.opacity = opacity;
                line.body.parts
                line.body.render.visible = false;
            })
        })*/
    
        World.add(world, mouseConstraint);

        // keep the mouse in sync with rendering
        render.mouse = mouse;
        render.options.background = "bg8.png"

        READY = false;
        window.setTimeout(function(){
            READY = true;

            // fit the render viewport to the scene
            Render.lookAt(render, {
                min: { x: 0, y: 0 },
                max: { x: 2720/2, y: 1536/2 }
            });
            l.forEach(composite => {
                composite.bodies.forEach(body => {
                    body.isSensor = false; //////////////////////////////////////////////////////
                    Matter.Body.setDensity(body, body.density/5);
                })
            });
            
            spawn = Matter.Bodies.circle(100 + Math.random()*20, 900/2, 36,{
                isStatic: true,
                isSensor: true,
                render:{
                    fillStyle: "yellow",
                    opacity: 0.5
                }
            });
            spawn.isSpawn = true;

            World.add(world, [
                spawn,
                makeWall(600,355,200,50,-15),
                makeWall(865,355,200,50,15),
                makeWall(570,1150,200,50,15),
                makeWall(820,1150,200,50,-15),
                makeWall(500,580,350,100,90),
                makeWall(900,580,350,100,90),
                makeWall(500,1000,250,100,90),
                makeWall(900,1000,250,100,90)
            ])

            backDoor = Constraint.create({
                bodyB: cavityLILeft.bodies[0],
                pointB: { x: 0, y: 0 },
                bodyA: cavityLIRight.bodies[0],
                pointA: { x: 0, y:0 },
                stiffness: 1,
                render:{visible:false}
            })

            closedS = Constraint.create({
                bodyB: cavityLILeft.bodies[cavityLILeft.bodies.length-1],
                pointB: { x: 0, y: 0 },
                bodyA: cavityLIRight.bodies[cavityLIRight.bodies.length-1],
                pointA: { x: 0, y:0 },
                stiffness: 1,
                render:{visible:false}
            })

            closedS2 = Constraint.create({
                bodyB: liningESleft.bodies[liningESleft.bodies.length-1],
                pointB: { x: 0, y: 0 },
                bodyA: liningESRight.bodies[liningESRight.bodies.length-1],
                pointA: { x: 0, y:0 },
                stiffness: 1,
                render:{visible:false}
            })
            
            frontDoor = Constraint.create({
                bodyB: uterusPackage.ropeA.bodies[8],
                pointB: { x: 0, y: 0 },
                bodyA: uterusPackage.ropeB.bodies[8],
                pointA: { x: 0, y:0 },
                stiffness: 1,
                render:{visible:false}
            })
            World.add(world, [
                frontDoor,
                backDoor,
                closedS,
                closedS2
            ])

            frontDoor.length = 10;
            backDoor.length = 32;
            closedS.length = 8;
            closedS2.length = 8;

            render.canvas.style.backgroundRepeat = "no-repeat"

            makeLines(staticChains)

            drawBase = true;
        }, WAIT);

        Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: 1, y: 1 }
        });
        


    /// Set mode to front door
    currentCategory = catU;
    //mouseConstraint.collisionFilter.mask = defaultMask;
    mouseConstraint.collisionFilter.category = catU| catO;
    u.forEach(composite => {
        setOpacity(composite, 1);
    })
    l.forEach(composite => {
        setOpacity(composite, 0.1);
    })
    ///
    //-------------------------------------------------------------------

}