import { TPoint } from "./type"
import { calAngle, calDistance } from "./utils"

export class ChainNode<T = any> {
    public readonly value: T
    public previous: ChainNode<T> | null
    public next: ChainNode<T> | null
    constructor(value: T) {
        this.value = value
        this.previous = null
        this.next = null
    }

    protected createInstance(value: T) {
        const C = this.constructor as any
        return new C(value)
    }

    after(node: T | ChainNode<T>): ChainNode<T> {
        if(node instanceof ChainNode) {
            this.previous = node
            node.next = this
            return node
        } else {
            const newNode = this.createInstance(node)
            this.after(newNode)
            return newNode
        }
    }
    before(node: T | ChainNode<T>): ChainNode<T> {
        if(node instanceof ChainNode) {
            this.next = node
            node.previous = this
            return node
        } else {
            const newNode = this.createInstance(node)
            this.before(newNode)
            return newNode
        }
    }
}

export class PointChainNode extends ChainNode<TPoint> {
    get velocity() {
        if(!this.previous) {
            return 0
        }
        const previous = this.previous.value
        const current = this.value
        const dur = (current.t - previous.t)
        const dis = calDistance(current, previous)
        return dis / dur
    }

    get angle() {
        if(!this.previous) {
            return 0
        }
        const previous = this.previous.value
        const current = this.value
        const ang = calAngle(current, previous)
        return ang
    }

    getVeloSize(scale: number = 1, unit: number = 3) {
        if(this.velocity === 0) {
            return 1
        }
        const size = Math.max(unit, (scale * unit) - (scale * Math.min(unit, Math.pow(this.velocity, 0.6)))) / unit
        return size
    }

    getVeloCross(scale: number = 1, unit: number = 3) {
        const size = this.getVeloSize(scale, unit)
        const point = this.value
        const angle = this.angle
        const x0 = size * Math.cos(angle - Math.PI * .5) + point.x
        const y0 = size * Math.sin(angle - Math.PI * .5) + point.y
        const x1 = size * Math.cos(angle + Math.PI * .5) + point.x
        const y1 = size * Math.sin(angle + Math.PI * .5) + point.y
        return [x0, y0, x1, y1]
    }
}