function shadeColor(color, percent) {

  var R = parseInt(color.substring(1,3),16);
  var G = parseInt(color.substring(3,5),16);
  var B = parseInt(color.substring(5,7),16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R<255)?R:255;  
  G = (G<255)?G:255;  
  B = (B<255)?B:255;  

  var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
  var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
  var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

  return "#"+RR+GG+BB;
}

var AppForm = null;

gameCanvas = "";//"";
windowMainHeight = 720;
isMobile = false;
WAIT = 1000;


function ngMain()
{
  if (window.innerWidth < 800){
    isMobile = true;
  }

  WinEightControls.ColorScheme="Yellow";
  //WinEightControls.BackgroundColor= '#282828';
  ngApp.SetClientParam('colorscheme',"Yellow");

  /*if (isMobile){
    //maingui.windowMain.CloseBtn = true;
    WAIT = 6000;
    maingui.windowMain.L = 0;
    maingui.windowMain.R = 0;
  }*/
  // Start coding right here
  AppForm = new ngControls(maingui);
  
  AppForm.Update();
  AppForm.windowMain.Controls.listInventory.SetItems(Items.getAllCategories());
  AppForm.windowMain.Hide();
  var win=ngMessageDlg('weDlgProgressBox','Setting up physics stuff','weDlgProgressBox');
  win.Controls.Progress.BeginProcess();
  setTimeout(function() {
    win.Close();
    if (!isMobile)
      AppForm.windowMain.Show();
  }, WAIT);
  //var body = document.getElementsByTagName("BODY")[0]; 

  if (isMobile){
    AppForm.winGame.Hide();
    gameCanvas = AppForm.paneGame.Elm();//AppForm.winGame.Controls.paneGame.Elm();
    //AppForm.windowMain.Hide();
    AppForm.windowMain.Controls.toggleGravity.SetEnabled(false);
  }
  else{
    removeElementsByClass("b");
    removeElementsByClass("c");
    AppForm.winGame.Hide();
    gameCanvas = AppForm.paneGame.Elm();//document.getElementById('ngApp');
  }


  //AppForm.winGame.Maximize();
  startGame();
 
  window.setTimeout(function(){
    for(var i = 0; i < 150; i ++)
      Matter.Runner.tick(runner, engine, 1)
      
  }, 5  );


  window.setInterval(function(){
    AppForm.windowMain.Controls.lbFPS.SetText("FPS: " + Math.round(fps));
    AppForm.windowMain.Controls.lbWaist.SetText("Waist Size: " + Math.round((FAT*4-3)*100) + "%");
  }, 500);

  ZOOM = window.innerHeight*0.98/768;
  zoom(ZOOM);
/*
  AppForm.winGame.Controls.btDoor.Elm().classList.add('btn-gradient');
  AppForm.winGame.Controls.btDoor.Elm().classList.add('yellow');
  AppForm.winGame.Controls.btDoor.Elm().classList.add('mini');*/
  //body.style.background = "bg3.png"
}

showing = false;
function showMenu(){
  if (!showing){
    AppForm.windowMain.Show();
    AppForm.windowMain.Maximize();
  }else{
    AppForm.windowMain.Hide();
  }
  showing = !showing
}

gameLock = true;
function lockGame(){
  gameLock = !gameLock;
  AppForm.toolbarMain.SetEnabled(gameLock);
  var msg;
  if (gameLock)
    msg = "Screen Unlocked!";
  else
    msg = "Screen Locked!";

  iqwerty.toast.Toast(msg,{
    settings: {
      duration: 1000
    }
  });
}

function openClose(){
  forceLineUpdate(1000);
  if (currentDoor == 'front'){
    AppForm.windowMain.Controls.toggleFront.ActionClick();
    /*if (frontDoor.length < 9)
      frontDoor.length = 10;
    else
      frontDoor.length = 0;*/
  }else{
    AppForm.windowMain.Controls.toggleBack.ActionClick();
    /*if (backDoor.length < 16)
      backDoor.length = 16;
    else
      backDoor.length = 8;*/
  }
}

function changeDoor(){
  if (currentDoor == 'front'){
    setDoor('back')
  }else{
    setDoor('front')
  }
}

function forceLineUpdate(duration){
  READY = false;
  window.setTimeout(function(){
    READY = true;
      
  }, duration);
}

maingui = {
  /* ControlsForm: 'Form1' */
  winGame: {
    Type: 'weWindow',
    ScrollBars: ssBoth,
    L: 220,
    W: 300,
    H: 200,
    Data: {
      HTMLEncode: true,
      Text: ''
    },
    Controls: {
      paneGame: {
        Type: 'wePanel',
        L: 0,
        T: 0,
        W: 1360,
        H: 768,
        Controls: {}
      }
    }
  },
  windowMain: {
    Type: 'weWindow',
    L: 660,
    T: 80,
    W: 355,
    H: 720,
    CloseBtn: false,
    Data: {
      HTMLEncode: true,
      Sizeable: false,
      Text: 'Interact'
    },
    Controls: {
      pageWin: {
        Type: 'wePages',
        L: 0,
        T: 0,
        R: 0,
        B: 0,
        Data: {
          HTMLEncode: true,
          Page: 0
        },
        Pages: [
          {
            Text: 'Options',
            Controls: {
              radioFront: {
                Type: 'weRadioButton',
                L: 20,
                T: 20,
                Data: {
                  Checked: 1,
                  HTMLEncode: true,
                  RadioGroup: 'door',
                  Text: 'Front Door'
                },
                Events: {
                  OnClick: function (e) {
                    setDoor('front');
                  }
                }
              },
              radioBack: {
                Type: 'weRadioButton',
                L: 138,
                T: 20,
                Data: {
                  Checked: 0,
                  HTMLEncode: true,
                  RadioGroup: 'door',
                  Text: 'Back Door'
                },
                Events: {
                  OnClick: function (e) {
                    setDoor('back');
                  }
                }
              },
              toggleGravity: {
                Type: 'weToggleSwitch',
                L: 20,
                T: 128,
                Data: {
                  HTMLEncode: true,
                  Text: 'toggleGravity',
                  Checked: false
                },
                Events: {
                  OnClick: function (e) {
                    world.bodies.forEach(body=>{
                      Matter.Sleeping.set(body, false);
                    })

                    var value = e.btn.Checked;
                    if (value)
                      world.gravity.y = GRAVITY;
                    else
                      world.gravity.y = 0;
                    
                    forceLineUpdate(1000);
                  }
                }
              },
              toggleTurbo: {
                Type: 'weToggleSwitch',
                L: 20,
                T: 162,
                Data: {
                  HTMLEncode: true,
                  Text: 'toggleTurbo'
                },
                Events: {
                  OnClick: function (e) {
                    var value = e.btn.Checked;
                    if (!value)
                      mouseConstraint.constraint.stiffness = MOUSE;
                    else
                      mouseConstraint.constraint.stiffness = 0.2;
                  }
                }
              },
              toggleSpasm: {
                Type: 'weToggleSwitch',
                L: 20,
                T: 95,
                Data: {
                  Enabled: false,
                  HTMLEncode: true,
                  Text: 'toggleSpasm'
                },
                Events: {
                  OnClick: function (c) {
                    var value = c.btn.Checked;
                    if (value) {
                      cavityLILeft.bodies.forEach(body => {
                        if (Math.random() > 0.5)
                          body.collisionFilter.group = 0;
                      });
                      cavityLIRight.bodies.forEach(body => {
                        if (Math.random() > 0.5)
                          body.collisionFilter.group = 0;
                      });
                    } else {
                      cavityLILeft.bodies.forEach(body => {
                        body.collisionFilter.group = -1;
                      });
                      cavityLIRight.bodies.forEach(body => {
                        body.collisionFilter.group = -1;
                      });
                    }
                  }
                }
              },
              weLabel2: {
                Type: 'weLabel',
                L: 81,
                T: 122,
                Data: {
                  HTMLEncode: true,
                  Text: 'Gravity'
                }
              },
              weLabel3: {
                Type: 'weLabel',
                L: 81,
                T: 155,
                Data: {
                  HTMLEncode: true,
                  Text: 'Turbo'
                }
              },
              weLabel1: {
                Type: 'weLabel',
                L: 82,
                T: 88,
                Data: {
                  HTMLEncode: true,
                  Text: 'Spasm'
                }
              },
              toggleFront: {
                Type: 'weToggleSwitch',
                L: 20,
                T: 56,
                Data: {
                  HTMLEncode: true,
                  Text: 'toggleFront'
                },
                Events: {
                  OnClick: function () {
                    forceLineUpdate(1000);
                    if (frontDoor.length < 9)
                      frontDoor.length = 10;
                    else
                      frontDoor.length = 0;
                  }
                }
              },
              toggleBack: {
                Type: 'weToggleSwitch',
                L: 136,
                T: 56,
                Data: {
                  HTMLEncode: true,
                  Text: 'toggleBack'
                },
                Events: {
                  OnClick: function () {
                    forceLineUpdate(1000);
                    if (backDoor.length < 32)
                      backDoor.length = 32;
                    else
                      backDoor.length = 8;
                  }
                }
              },
              cbBoundaries: {
                Type: 'weCheckBox',
                L: 20,
                T: 207,
                Data: {
                  HTMLEncode: true,
                  Text: 'Show Boundaries'
                },
                Events: {
                  OnCheckChanged: function (c) {
                    var value = c.Checked;
                    var width = 0;
                    if (value) {
                      width = 1;
                    }
                    walls.forEach(wall => {
                      wall.render.lineWidth = width;
                    });
                  }
                }
              },
              lbFPS: {
                Type: 'weLabel',
                L: 21,
                T: 248,
                Data: {
                  HTMLEncode: true,
                  Text: 'FPS: '
                }
              },
              lbWaist: {
                Type: 'weLabel',
                L: 21,
                T: 268,
                Data: {
                  HTMLEncode: true,
                  Text: 'Waist size: 100%'
                }
              },
              toggleDigest: {
                Type: 'weToggleSwitch',
                L: 20,
                T: 290,
                Data: {
                  Checked: true,
                  HTMLEncode: true,
                  Text: 'toggleDigest'
                },
                Events: {
                  OnClick: function (e) {
                    var value = e.btn.Checked;
                    doDigest = value;
                  }
                }
              },
              weLabel6: {
                Type: 'weLabel',
                L: 80,
                T: 290,
                Data: {
                  HTMLEncode: true,
                  Text: 'Digestion'
                }
              }
            }
          },
          {
            Text: 'Inventory',
            Controls: {
              listInventory: {
                Type: 'weTreeList',
                L: 11,
                T: 6,
                W: 163,
                B: 0,
                style: {
                  borderColor: '#ffcc85',
                  borderStyle: 'dashed'
                },
                Data: {
                  HTMLEncode: true,
                  Items: [],
                  SelectType: nglSelectSingle
                }
              },
              btAddItem: {
                Type: 'weButton',
                L: 180,
                T: 138,
                Data: {
                  HTMLEncode: true,
                  Text: 'Add Item'
                },
                Events: {
                  OnClick: function () {
                    var item = AppForm.windowMain.Controls.listInventory.GetSelected()[0];
                    if (item) {
                      item.make();
                      iqwerty.toast.Toast(`Spawned a(n) ${ item.Text }!`, { settings: { duration: 500 } });
                    }
                  }
                }
              },
              ItemEditor: {
                Type: 'weButton',
                L: 180,
                T: 6,
                R: 0,
                Data: {
                  Enabled: false,
                  HTMLEncode: true,
                  Text: 'Item Editor'
                }
              },
              btImportItems: {
                Type: 'weButton',
                L: 180,
                T: 46,
                R: 0,
                Data: {
                  Enabled: false,
                  HTMLEncode: true,
                  Text: 'Import Items'
                }
              },
              btRemoveItem: {
                Type: 'weButton',
                L: 180,
                T: 86,
                R: 0,
                Data: {
                  Enabled: false,
                  HTMLEncode: true,
                  Text: 'Remove Item'
                }
              }
            }
          },
          {
            Text: 'Themes',
            Controls: {
              btChangeTheme: {
                Type: 'weButton',
                L: 185,
                T: 46,
                R: 4,
                Data: {
                  Enabled: true,
                  HTMLEncode: true,
                  Text: 'Change Theme'
                },
                Events: {
                  OnClick: function () {
                    var item = AppForm.windowMain.Controls.listThemes.GetSelected()[0];
                    if (item){
                      render.options.background = item.Text;
                      window.setTimeout(function(){
                        fatten(1);
                      }, 10);
                      
                    }
                  }
                }
              },
              btEditor: {
                Type: 'weButton',
                L: 185,
                T: 7,
                R: 4,
                Data: {
                  Enabled: false,
                  HTMLEncode: true,
                  Text: 'Theme Editor'
                }
              },
              btImportTheme: {
                Type: 'weButton',
                L: 186,
                T: 84,
                R: 4,
                Data: {
                  Enabled: false,
                  HTMLEncode: true,
                  Text: 'Import Theme'
                }
              },
              listThemes: {
                Type: 'weList',
                L: 6,
                T: 7,
                W: 170,
                B: 0,
                style: {
                  borderColor: '#ffcc85',
                  borderStyle: 'dashed'
                },
                Data: {
                  //
                  HTMLEncode: true,
                  Items: [
                    { Text: 'bg.png' },
                    { Text: 'bg2.png' },
                    { Text: 'bg3.png' },
                    { Text: 'bg4.png' },
                    { Text: 'bg5.png' },
                    { Text: 'bg6.png' },
                    { Text: 'bg7.png' },
                    { Text: 'bg8.png' }
                  ],
                  SelectType: nglSelectSingle
                }
              }
            }
          }
        ]
      }
    }
  },
  toolbarMain: {
    Type: 'weToolBar',
    L: 0,
    T: 0,
    R: 0,
    B: 0,
    ScrollBars: ssAuto,
    Controls: {
      paneGame: {
        Type: 'wePanel',
        L: 0,
        T: 0,
        W: 1360,
        H: 768,
        Controls: {}
      }
    }
  }
}
