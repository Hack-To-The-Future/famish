import Phaser from "phaser";
import { useEffect } from "react";

const Game = () => {
  useEffect(() => {
    var config = {
      type: Phaser.AUTO,
      width: 1350,
      height: 550,
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

    let game = new Phaser.Game(config);
    const fishes = ["fish", "fish2", "fish3"];

    function preload() {
      this.load.image("background", "assets/background.png");
      this.load.image("ground", "assets/platform.png");
      this.load.image("bomb", "assets/bomb.png");
      this.load.spritesheet("fish-main", "assets/fish-main.png", {
        frameWidth: Math.floor(1635 / 12),
        frameHeight: 90,
      });

      this.load.spritesheet("fish", "assets/fish1.png", {
        frameWidth: Math.floor(1635 / 12),
        frameHeight: 90,
      });
      this.load.spritesheet("fish2", "assets/fish2.png", {
        frameWidth: Math.floor(1635 / 12),
        frameHeight: 90,
      });
      this.load.spritesheet("fish3", "assets/fish3.png", {
        frameWidth: Math.floor(1635 / 12),
        frameHeight: 90,
      });
    }

    var platforms;
    var player;
    var cursors;
    var playerScore = 1;
    var maxScale = 7;
    var fishEvent;
    var fish;
    var maxFish = 300;

    const eatFish = (player, fish) => {
      fish.disableBody(true, true);
      if (playerScore >= fish.fishSize) {
        playerScore += fish.fishSize * 0.1;
        player.setScale(scaleFunction(playerScore));
      } else {
        alert("Game over!");
        window.location.reload();
      }
    };

    const scaleFunction = (x) => {
      return Math.tanh(x * 0.05) * maxScale;
    };

    function create() {
      game.scale.pageAlignHorizontally = true;
      game.scale.pageAlignVertically = true;

      this.cameras.main.setBackgroundColor("#fff");

      this.add.image(1350 / 2, 550 / 2, "background");

      platforms = this.physics.add.staticGroup();

      player = this.physics.add.sprite(100, 450, "fish-main");
      player.setVelocityX(160);
      player.setBounce(0.2);

      player.setCollideWorldBounds(true);

      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("fish-main", {
          start: 0,
          end: 5,
        }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: "turn",
        frames: [{ key: "fish-main", frame: 6 }],
        frameRate: 20,
      });

      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("fish-main", {
          start: 6,
          end: 11,
        }),
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
        const bobSpeed = Math.floor(
          Math.random() * (fishSpeed * 0.75) - (fishSpeed * 0.75) / 2
        );
        child.setVelocityY(bobSpeed);
      });
    }

    function newFishEvent() {
      const side = Math.random() > 0.5 ? 0 : config.width;
      const fishtype = Math.floor(Math.random() * 3);
      const direction = side === 0 ? 1 : -1;
      fish = this.physics.add.group({
        key: fishes[fishtype],
        setXY: { x: side, y: Math.floor(Math.random() * config.height) },
      });

      fish.children.iterate(function (child) {
        const fishSpeed = Math.floor(Math.random() * 230);
        const bobSpeed = Math.floor(
          Math.random() * (fishSpeed * 0.75) - (fishSpeed * 0.75) / 2
        );
        child.setVelocityX(direction * fishSpeed);
        child.setVelocityY(bobSpeed);
        child.fishSize = Math.max(
          playerScore - (Math.random() * playerScore) / 4 + playerScore / 8,
          0.5
        );
        child.setScale(scaleFunction(child.fishSize));
      });

      const bobTime = Math.floor(Math.random() * 6000) + 500;
      this.time.addEvent({
        delay: bobTime,
        callback: bobFish,
        args: [fish],
        loop: true,
      });

      this.physics.add.overlap(player, fish, eatFish, null, this);

      fishEvent = this.time.addEvent({
        delay: 10000,
        callback: newFishEvent,
        callbackScope: this,
        loop: true,
      });
    }

    function goodbye(obj) {
      obj.kill();
    }
  }, []);

  return <></>;
};

export default Game;
