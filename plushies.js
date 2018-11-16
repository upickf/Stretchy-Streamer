
//const size = 10;
const speed = 0.07;

shapeHorse = [
    [0,0,0,0,0,0,0,1,0,0,0],
    [0,0,0,0,0,0,0,1,1,1,1],
    [0,0,0,0,0,0,0,1,1,1,1],
    [0,0,0,0,0,0,0,1,1,0,0],
    [0,0,0,0,0,0,0,1,1,0,0],
    [0,0,0,0,0,0,0,1,1,0,0],
    [0,0,0,0,0,0,0,1,1,0,0],
    [0,0,0,0,0,0,0,1,1,0,0],
    [0,0,0,1,1,1,1,1,1,0,0],
    [1,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,0,0,1,1,0,0],
    [0,0,0,1,1,0,0,1,1,0,0],
    [0,0,0,1,1,0,0,1,1,0,0],
];

shapeHeart = [
    [0,1,1,0,1,1,0],
    [1,1,1,1,1,1,1],
    [0,1,1,1,1,1,0],
    [0,0,1,1,1,0,0],
    [0,0,0,1,0,0,0]
];

shapeBread = [
    [0,1,1,1,1,1,0],
    [1,1,1,1,1,1,1],
    [0,1,1,1,1,1,0]
];

function connect(c, bodyA, bodyB, constraintOptions){
    if ( bodyA && bodyB ) {
      Composite.addConstraint( c, Constraint.create(
        Common.extend({ 
          bodyA: bodyA, 
          bodyB: bodyB
        }, constraintOptions)
      ));
    }
  }

  function softSkeleton(xx, yy, matrix, particleRadius, constraintOptions, callback) {

    let c = Composite.create({ label: 'Skeleton' });
    let y = 0;
    let lastRow = null;
    constraintOptions = constraintOptions || { stiffness:2 };

    callback = callback || function(x,y,size){
        body = Bodies.rectangle( x, y, size, size);
       return body;
    };

    for (let i = 0, len = matrix.length; i < len; i++){


      //let c = Composite.create({ label: 'Row' + i });
      let row = matrix[i];
      let x = 0;

      for (let j = 0, count = row.length; j < count; j++){
        if ( row[j] ) {

          row[j] = callback(
            xx + ( x * particleRadius), 
            yy + ( y * particleRadius ), 
            particleRadius,
            i,
            j
          );

          Composite.addBody( c, row[j] );

          connect(c, row[j - 1], row[j], constraintOptions);

          if ( lastRow ) {
            connect(c, row[j], lastRow[j], constraintOptions);
            connect(c, row[j], lastRow[j + 1], constraintOptions);
            connect(c, row[j], lastRow[j - 1], constraintOptions);
          }
        }
        x++;
      }

      y++;
      lastRow = row;

    }

    return c;
  };

  
//var width = ( shape[0].length * size );
//var height = ( shape.length * size );
//var startY = 1300 ;
var startX = Math.random()*1360/2;//(sceneWidth/2) - width; //-width/2;

function makePlushie(shape,size, color ,startY){
  size /= 2;
    return softSkeleton(
        Math.random()*1360/2, 
    startY,
    shape, 
    size, 
    { stiffness: 0.99, render: { visible: false } },
    function(x,y,size, i, j){

    let s = size * ( j < 4 ? 0.8 : 1 );
    let c = 
        ( i === 2 && j === 9 ? '#000' : // Eyeball 
            ( j % 2 !== ( i % 2 ? 0 : 1 ) ? color : shadeColor(color, -40))//'#52C292' ) 
        );
    var body = Bodies.rectangle( x, y, s, s,{   
            render: { 
            fillStyle: c,
            strokeStyle: color,
            lineWidth: s * 0.3
            }
        });
        console.log(body);
    
    return body;
    });
}