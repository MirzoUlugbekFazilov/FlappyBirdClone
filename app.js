let config = document.getElementById("game");

config = {
  renderer: Phaser.AUTO,
  width: 900,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let game = new Phaser.Game(config);

function preload() {
  this.load.image("background", "assets/background.png");
  this.load.image("road", "assets/road.png");
  this.load.image("column", "assets/column.png");
  this.load.spritesheet("bird", "assets/bird.png", {
    frameWidth: 64,
    frameHeight: 96,
  });
}

let bird;
let cursors;
let hasLanded = false;
let hitColumn = false;
let isGameStarted = false;
let messageToPlayer;
let distanceCounter;
let levelIndicator;
let restartButton;

// let num = [80, -80, 0][Math.floor(Math.random() * 3)];

function create() {
  const background = this.add
    .tileSprite(0, 0, 20030, 600, "background")
    .setOrigin(0, 0);

  let topColumns = this.physics.add.staticGroup();
  for (let i = 0; i < 5000; i++) {
    topColumns.create(
      250 + 400 * i,
      [50, 40, 0, -50, -90][Math.floor(Math.random() * 5)],
      "column"
    );
  }

  // {
  //   key: "column",
  //   repeat: 1,
  //   setXY: { x: 200, y: 80, stepX: 400 }
  // }

  let bottomColumns = this.physics.add.staticGroup(); // 500, 600, 400, 450, 550

  for (let i = 0; i < 5000; i++) {
    topColumns.create(
      450 + 400 * i,
      [450, 500, 400, 550][Math.floor(Math.random() * 4)],
      "column"
    );
  }
  const bro = this.physics.add.staticGroup();
  const road = bro.create(9300, 1492, "road").setScale(30).refreshBody();
  bird = this.physics.add.sprite(30, 90, "bird").setScale(2.5);
  bird.setBounce(0.4);
  bird.setCollideWorldBounds(true);

  this.physics.add.overlap(bird, road, () => (hasLanded = true));
  this.physics.add.overlap(bird, topColumns, () => (hitColumn = true));
  this.physics.add.overlap(bird, bottomColumns, () => (hitColumn = true));
  this.physics.add.collider(bird, topColumns);
  this.physics.add.collider(bird, bottomColumns);

  this.physics.add.collider(bird, road);

  cursors = this.input.keyboard.createCursorKeys();
  cursors.r = this.input.keyboard.addKey("r");
  cursors.pointer = this.input.activePointer;

  restartButton = this.add
    .text(450, 250, "Restart", {
      fontFamily: "Georgia, 'Times New Roman', Times, serif",
      fontSize: "30px",
      color: "white",
      backgroundColor: "red",
      padding: { x: 20, y: 10 },
    })
    .setOrigin(0.5, 0.5)
    .setInteractive()
    .setVisible(false); // Hide it initially

  // Make button clickable

  restartButton.on("pointerdown", () => {
    restart();
    restartButton.setVisible(false); // Hide button after restart
  });

  // Make button follow camera
  restartButton.setScrollFactor(0);
  //   this.input.on('pointerdown', function() {
  //     bird.setVelocityY(-200); // Same upward velocity as spacebar
  // });

  // messageToPlayer = this.add.text(0, 0, "Press 'Enter' to start", {
  //   fontFamily: "'Times New Roman', Times, serif",
  //   fontSize: "20px",
  //   color: "white",
  //   backgroundColor: "black",
  // });
  // Phaser.Display.Align.In.BottomCenter(messageToPlayer, background, 0, 55);

  levelIndicator = this.add
    .text(450, 565, "Level: Easy", {
      fontFamily: "Georgia, 'Times New Roman', Times, serif",
      fontSize: "20px",
      color: "green",
      fontStyle: "bolder",
    })
    .setOrigin(0.5, 0.5);

  messageToPlayer = this.add
    .text(450, 530, "Press 'Enter' to start", {
      fontFamily: "Georgia, 'Times New Roman', Times, serif",
      fontSize: "20px",
      color: "black",
      fontStyle: "bolder",
    })
    .setOrigin(0.5, 0.5);

  distanceCounter = this.add
    .text(450, 80, "0", {
      fontFamily: "Georgia, 'Times New Roman', Times, serif",
      fontSize: "40px",
      color: "white",
      fontStyle: "bold",
      shadow: {
        offsetX: 2,
        offsetY: 3,
        color: "blue",

        fill: true,
      },
    })
    .setOrigin(0.5, 0.5);

  messageToPlayer.setScrollFactor(0);
  distanceCounter.setScrollFactor(0);
  levelIndicator.setScrollFactor(0);

  this.physics.world.setBounds(0, 0, 20030, 600);
  this.cameras.main.setBounds(0, 0, 20030, 600);
  this.cameras.main.startFollow(bird);
}

function restart() {
  bird.setPosition(30, 90);
  bird.setVelocity(0, 0);
  hasLanded = false;
  hitColumn = false;
  isGameStarted = false;
}

function update() {
  if (cursors.space.isDown) {
    bird.setVelocityY(-200);
  }

  bird.body.velocity.x = 90;

  if (!hasLanded && !hitColumn) {
    bird.body.velocity.x = 90;
  } else {
    bird.body.velocity.x = 0;
    bird.body.velocity.y = -9;
  }

  if (isGameStarted == false) {
    bird.body.velocity.y = -160;
    bird.body.velocity.x = 0;
  }

  if (isGameStarted == true) {
    messageToPlayer.text =
      "To fly Press the 'Space bar' or Click on the screen";
  }

  if (bird.x >= 4000) {
    levelIndicator.text = "Level: Middle";
    levelIndicator.setColor("blue");
    bird.body.velocity.x = 100;
  }

  if (bird.x >= 10000) {
    levelIndicator.text = "Level: Hard";
    levelIndicator.setColor("red");
    bird.body.velocity.x = 110;
  }
  if (bird.x >= 15000) {
    levelIndicator.text = "Level: Insane";
    levelIndicator.setColor("purple");
    bird.body.velocity.x = 120;
  }

  if (hasLanded == true || hitColumn == true) {
    messageToPlayer.text =
      "You crashed! To restart Press 'r' or Click on 'Restart' button";
    restartButton.setVisible(true);
    if (cursors.r && cursors.r.isDown) {
      restartButton.setVisible(false); // Hide it initially
      restart();
    }
  }

  if (bird.x >= 20020) {
    messageToPlayer.text = "Congrats! You won!";
  }

  for (let i = 1; i <= 100; i++) {
    if (bird.x >= 200 * i) {
      distanceCounter.text = i;
    }
  }
  if (cursors.pointer.isDown) {
    bird.setVelocityY(-200);
  }
}

function GameStarter() {
  isGameStarted = true;
}

function restart() {
  bird.setPosition(30, 90);
  bird.setVelocity(0, 0);
  hasLanded = false;
  hitColumn = false;
  isGameStarted = false;
  messageToPlayer.text = "Press 'Enter' to start";
  levelIndicator.text = "Level: Easy";
  levelIndicator.setColor("green");
  distanceCounter.text = "0";

  if (bird.x >= 4000) {
    levelIndicator.text = "Level: Middle";
    levelIndicator.setColor("blue");
    bird.body.velocity.x = 100;
  }

  if (bird.x >= 10000) {
    levelIndicator.text = "Level: Hard";
    levelIndicator.setColor("red");
    bird.body.velocity.x = 110;
  }
  if (bird.x >= 15000) {
    levelIndicator.text = "Level: Insane";
    levelIndicator.setColor("purple");
    bird.body.velocity.x = 120;
  }

  if (bird.x >= 20020) {
    messageToPlayer.text = "Congrats! You won!";
  }

  if (hasLanded == true || hitColumn == true) {
    messageToPlayer.text = "You crashed! To restart Press 'r' or Click on 'Restart' button";
  }
}
