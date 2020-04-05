import Phaser from 'phaser'

import SwordContainer from './SwordContainer'

export default class HelloWorldScene extends Phaser.Scene
{
	private sword?: SwordContainer

	constructor()
	{
		super('hello-world')
	}

	preload()
    {
		this.load.image('sword', 'assets/swordGold.png')
    }

    create()
    {
		this.sword = new SwordContainer(this, 400, 300)

		const circle = this.add.circle(400, 200, 30, 0xfff, 1)
		this.physics.add.existing(circle)
		const circleBody = circle.body as Phaser.Physics.Arcade.Body
		circleBody.setCollideWorldBounds(true, 1, 1)

		this.physics.add.overlap(this.sword.physicsDisplay, circle, (swordObject: Phaser.GameObjects.GameObject, circleObj: Phaser.GameObjects.GameObject) => {
			// to give us intellisense for Transform component properties
			type Transformable = Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform
			const s = swordObject as Transformable
			const c = circleObj as Transformable
			
			const vec = new Phaser.Math.Vector2(0, 0)

			if (this.sword?.isPhysicsDisplayContained)
			{
				// if sword keeps physics display in the container
				// we need to transform the position to world space
				const matrix = c.getWorldTransformMatrix()
				const cPos = new Phaser.Geom.Point()
				matrix.transformPoint(c.x, c.y, cPos)

				vec.x = s.x - cPos.x
				vec.y = s.y - cPos.y
			}
			else
			{
				vec.x = c.x - s.x
				vec.y = c.y - s.y
			}

			vec.normalize()

			const cBody = circleObj.body as Phaser.Physics.Arcade.Body
			cBody.setVelocity(vec.x * 200, vec.y * 200)
		})
	}
	
	update(t: number, dt: number)
	{
		if (!this.sword)
		{
			return
		}

		this.sword.rotateBy(-2)
	}
}
