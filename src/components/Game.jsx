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

    function preload() {
      this.load.image("background", "assets/background.png");
      this.load.image("ground", "assets/platform.png");
      this.load.image("star", "assets/star.png");
      this.load.image("bomb", "assets/bomb.png");
      this.load.spritesheet("fish-main", "assets/fish-main.png", {
        frameWidth: Math.floor(1635 / 12),
        frameHeight: 90,
      });
    }

    var platforms;
    var player;
    var cursors;
    var stars;
    var scale = 1;
    var maxScale = 7;
    var fishEvent;
    var fish;

    const collectStar = (player, star) => {
      star.disableBody(true, true);
      scale += 1;
      const scalef = Math.tanh(scale * 0.05) * maxScale;
      player.setScale(scalef);
    };

    const eatFish = (player, fish) => {
      fish.disableBody(true, true);
      scale += 1;
      const scalef = Math.tanh(scale * 0.05) * maxScale;
      player.setScale(scalef);
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

      stars = this.physics.add.group({
        key: "star",
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 },
      });

      stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.setCollideWorldBounds(true);
      });

      this.physics.add.collider(stars, platforms);
      this.physics.add.overlap(player, stars, collectStar, null, this);

      // fishEvent = this.time.addEvent({
      //   delay: 1000,
      //   callback: newFishEvent,
      //   callbackScope: this,
      //   loop: true,
      // });
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

    function newFishEvent() {
      fish = this.physics.add.group({
        key: "star",
        repeat: 10,
        setXY: { x: 0, y: 10, stepY: 70 },
      });

      fishEvent = this.time.addEvent({
        delay: 1000,
        callback: newFishEvent,
        callbackScope: this,
        loop: true,
      });
    }
  }, []);

  return <></>;
};

export default Game;
