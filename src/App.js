import Phaser from 'phaser';
import { useEffect } from 'react';
import './App.css';

function App() {

  useEffect(() => {
    var config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
      },
      scene: {
          preload: preload,
          create: create,
          update: update
      }
    };
    
    new Phaser.Game(config);
    
    function preload ()
    {
      this.load.image('sky', 'assets/sky.png');
      this.load.image('ground', 'assets/platform.png');
      this.load.image('star', 'assets/star.png');
      this.load.image('bomb', 'assets/bomb.png');
      this.load.spritesheet('dude', 
          'assets/dude.png',
          { frameWidth: 32, frameHeight: 48 }
      );
    }

    var platforms;
    var player;
    var cursors;
    var stars;
    var scale = 1;
    var maxScale = 7;
    
    const collectStar = (player, star) => {
      star.disableBody(true, true);
      scale += 1
      const scalef = Math.tanh(scale*0.05)*maxScale;
      player.setScale(scalef);
    }

    const eatFish = (player, fish) => {
      fish.disableBody(true, true);
      scale += 1
      const scalef = Math.tanh(scale*0.05)*maxScale;
      player.setScale(scalef);
    }

    function create ()
    {
      this.add.image(400, 300, 'sky').setScale(2);

      platforms = this.physics.add.staticGroup();

      player = this.physics.add.sprite(100, 450, 'dude');
      player.setVelocityX(160);
      player.setBounce(0.2);

      player.setCollideWorldBounds(true);

      this.anims.create({
          key: 'left',
          frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1
      });

      this.anims.create({
          key: 'turn',
          frames: [ { key: 'dude', frame: 4 } ],
          frameRate: 20
      });

      this.anims.create({
          key: 'right',
          frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
          frameRate: 10,
          repeat: -1
      });

      this.physics.add.collider(player, platforms);
      cursors = this.input.keyboard.createCursorKeys();

      stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
      });
    
      stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.setCollideWorldBounds(true);
      });
      
      this.physics.add.collider(stars, platforms);
      this.physics.add.overlap(player, stars, collectStar, null, this);
    }
    
    function update ()
    {
      if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
      }
      else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
      }
      else {
        const vel = player.body.velocity;
        player.setVelocityX(vel.x*0.99);
        player.anims.play('turn');
      }

      if (cursors.up.isDown) {
        player.setVelocityY(-160);
        player.anims.play('turn', true);
      }
      else if (cursors.down.isDown) {
        player.setVelocityY(160);
        player.anims.play('turn', true);
      } else {
        const vel = player.body.velocity;
        player.setVelocityY(vel.y*0.95);
      }
    }
  },[]);

  return <></>
}

export default App;
