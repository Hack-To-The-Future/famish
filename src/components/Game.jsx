import Phaser from "phaser";
import { useEffect } from "react";

const Game = () => {
  useEffect(() => {
    var config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    new Phaser.Game(config);

    function preload() {
      this.load.image("sky", "assets/sky.png");
      this.load.image("ground", "assets/platform.png");
      this.load.image("fish", "assets/star.png");
      this.load.image("bomb", "assets/bomb.png");
      this.load.spritesheet("dude", "assets/dude.png", {
        frameWidth: 32,
        frameHeight: 48,
      });
    }

    var platforms;
    var player;
    var cursors;
    var stars;
    var playerScore = 1;
    var maxScale = 7;
    var fishEvent;
    var fish;
    var maxFish = 300;

    const eatFish = (player, fish) => {
      fish.disableBody(true, true);
      if (playerScore > fish.fishSize) {
        playerScore += fish.fishSize * 0.1;
        player.setScale(scaleFunction(playerScore));
      } else {
        alert('Game over!');
        window.location.reload(); 
      }
    };

    const scaleFunction = (x) => {
      return Math.tanh(x * 0.05) * maxScale;
    }

    function create() {
      this.add.image(400, 300, "sky").setScale(2);

      platforms = this.physics.add.staticGroup();

      player = this.physics.add.sprite(100, 450, "dude");
      player.setVelocityX(160);
      player.setBounce(0.2);

      player.setCollideWorldBounds(true);

      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: "turn",
        frames: [{ key: "dude", frame: 4 }],
        frameRate: 20,
      });

      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1,
      });

      this.physics.add.collider(player, platforms);
      cursors = this.input.keyboard.createCursorKeys();

      player.setScale(scaleFunction(1));

      fishEvent = this.time.addEvent({
        delay: 1000,
        callback: newFishEvent,
        callbackScope: this,
        loop: true,
      });
    }

    function update() {
      if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play("left", true);
      } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play("right", true);
      } else {
        const vel = player.body.velocity;
        player.setVelocityX(vel.x * 0.99);
        player.anims.play("turn");
      }

      if (cursors.up.isDown) {
        player.setVelocityY(-160);
        player.anims.play("turn", true);
      } else if (cursors.down.isDown) {
        player.setVelocityY(160);
        player.anims.play("turn", true);
      } else {
        const vel = player.body.velocity;
        player.setVelocityY(vel.y * 0.95);
      }
    }

    function bobFish(fishes) {
      fishes.children.iterate(function (child) {
        const fishSpeed = child.body.velocity.x;
        const bobSpeed = Math.floor(Math.random() * (fishSpeed*0.75) - (fishSpeed*0.75)/2);
        child.setVelocityY(bobSpeed);
      });
    }

    function newFishEvent() {
      const side = (Math.random() > 0.5)? 0 : config.width;
      const direction = (side === 0)? 1:-1
      fish = this.physics.add.group({
        key: "fish",
        setXY: { x: side, y: Math.floor(Math.random() * config.height) },
      });

      fish.children.iterate(function (child) {
        const fishSpeed = Math.floor(Math.random() * 230);
        const bobSpeed = Math.floor(Math.random() * (fishSpeed*0.75) - (fishSpeed*0.75)/2);
        child.setVelocityX(direction*fishSpeed);
        child.setVelocityY(bobSpeed);
        child.fishSize = Math.random() * playerScore * 1.5;
        child.setScale(scaleFunction(child.fishSize));
      });
      
      const bobTime = Math.floor(Math.random() * 6000) + 500;
      this.time.addEvent({ 
        delay: bobTime, 
        callback: bobFish, 
        args: [fish], 
        loop: true });

      this.physics.add.overlap(player, fish, eatFish, null, this);

      fishEvent = this.time.addEvent({
        delay: 10000,
        callback: newFishEvent,
        callbackScope: this,
        loop: true,
      });
    }

    function goodbye(obj) {   obj.kill();}

  }, []);

  return <></>;
};

export default Game;
