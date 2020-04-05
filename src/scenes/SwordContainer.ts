import Phaser from 'phaser'

export default class SwordContainer extends Phaser.GameObjects.Container
{
	private display: Phaser.GameObjects.Image
	private physicsObject: Phaser.GameObjects.Arc

	// NOTE: change this to test scenario with physics body as child of Scene
	private containPhysicsObject = true

	get physicsBody()
	{
		return this.physicsObject.body as Phaser.Physics.Arcade.Body
	}

	get physicsDisplay()
	{
		return this.physicsObject
	}

	get isPhysicsDisplayContained()
	{
		return this.containPhysicsObject
	}

	constructor(scene: Phaser.Scene, x: number, y: number)
	{
		super(scene, x, y)

		this.display = scene.add.image(0, 0, 'sword')

		this.add(this.display)

		const width = this.display.width
		const radius = 20

		this.physicsObject = scene.add.circle(
			(width * 0.6), 0,
			radius,
			undefined,
			0
		)

		scene.physics.add.existing(this.physicsObject)

		if (!this.containPhysicsObject)
		{
			this.physicsObject.x += x
			this.physicsObject.y += y
		}
		else
		{
			this.add(this.physicsObject)
		}

		this.display.x += width * 0.35

		this.physicsBody.setCircle(20)

		scene.add.existing(this)
	}

	rotateBy(degrees = 1)
	{
		const startRotation = this.rotation

		this.angle += degrees

		if (this.containPhysicsObject)
		{
			return
		}

		// rotate around a specific point
		// only necessary if the physicsObject is not part of
		// the Container
		const x = this.x
		const y = this.y

		let px = this.physicsObject.x
		let py = this.physicsObject.y

		const diff = this.rotation - startRotation

		const c = Math.cos(diff)
		const s = Math.sin(diff)

		const tx = px - x
		const ty = py - y

		px = tx * c - ty * s + x
		py = tx * s + ty * c + y

		this.physicsObject.x = px
		this.physicsObject.y = py
	}
}
