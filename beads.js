function makeBeads(showStrings){
    var group = Body.nextGroup(true);

    var beads = Composites.stack(spawn.position.x,spawn.position.y, 5, 1, 10, 10, function(x, y) {
      return Matter.Bodies.circle(x, y, 20/2,{render: {
                //fillStyle: '#ffffff',
            }})
    });
    Composites.chain(beads, 0,0.5,0, -0.5, { stiffness: 1, length: 5, render: { type: 'line', visible: showStrings  } });
    return beads;
}