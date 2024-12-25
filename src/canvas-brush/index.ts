import { TPoint } from "./type"
import { PointChainNode } from './chain'

const getEventNames = () => {
    if (typeof document.ontouchstart === 'undefined') {
        return {
            mousedown: 'mousedown',
            mousemove: 'mousemove',
            mouseup: 'mouseup',
        }
    } else {
        return {
            mousedown: 'touchstart',
            mousemove: 'touchmove',
            mouseup: 'touchend',
        }
    }
}
const getEventPosition = (e: unknown): TPoint | null => {
    if (e instanceof MouseEvent) {
        return { x: e.clientX, y: e.clientY, t: e.timeStamp }
    } else if (e instanceof TouchEvent) {
        const list = Array.from(e.touches)
        const touch = list[0]
        if (touch) {
            return { x: touch.clientX, y: touch.clientY, t: e.timeStamp }
        }
    }
    return null
}

export const createPaintController = (canvas: HTMLCanvasElement, config: {
    onStart?: (point: PointChainNode) => void;
    onMove?: (point: PointChainNode) => void;
    onEnd?: (point: PointChainNode) => void;
} = {}) => {
    const {
        onMove,
        onStart,
        onEnd
    } = config

    const eventNames = getEventNames()
    const { left, top } = canvas.getBoundingClientRect()

    let pointNode: PointChainNode | null = null
    const calPoint = (point: TPoint) => {
        const x = point.x - left
        const y = point.y - top
        const p = { x, y, t: point.t }
        if (!pointNode) {
            pointNode = new PointChainNode(p)
        } else {
            pointNode = pointNode.before(p) as PointChainNode
        }
        return pointNode
    }

    const mousedown = (e: any) => {
        const pos = getEventPosition(e)
        if (!pos) {
            return
        }
        const point = calPoint(pos)
        if (typeof onStart === 'function') {
            onStart(point)
        }
        if (typeof onMove === 'function') {
            onMove(point)
        }
        document.addEventListener(eventNames.mousemove, mousemove)
        document.addEventListener(eventNames.mouseup, mouseup)
    }
    const mousemove = (e: any) => {
        const pos = getEventPosition(e)
        if (!pos) {
            return
        }
        const point = calPoint(pos)
        if (typeof onMove === 'function') {
            onMove(point)
        }
    }
    const mouseup = () => {
        if (typeof onEnd === 'function' && !!pointNode) {
            onEnd(pointNode)
        }
        pointNode = null
        document.removeEventListener(eventNames.mousemove, mousemove)
        document.removeEventListener(eventNames.mouseup, mouseup)
    }

    canvas.addEventListener(eventNames.mousedown, mousedown)

    return {
        dispose() {
            canvas.removeEventListener(eventNames.mousedown, mousedown)
            document.removeEventListener(eventNames.mousemove, mousemove)
            document.removeEventListener(eventNames.mouseup, mouseup)
        }
    }
}

const PI2 = Math.PI * 2

export const cleanupCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) {
        return
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

export const renderPointStep = (canvas: HTMLCanvasElement, node: PointChainNode) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) {
        return
    }
    // const point = node.value
    // const previous = node.previous ? node.previous.value : null
    // if (previous) {
    //     ctx.beginPath()
    //     ctx.moveTo(previous.x, previous.y)
    //     ctx.lineTo(point.x, point.y)
    //     ctx.lineWidth = 2
    //     ctx.strokeStyle = '#000'
    //     ctx.stroke()
    // }
    // ctx.beginPath()
    // ctx.arc(point.x, point.y, 3, 0, PI2)
    // ctx.fillStyle = '#000'
    // ctx.fill()

    // if(node.velocity > 0) {
    //     const ax = 30 * node.velocity * Math.cos(node.angle)
    //     const ay = 30 * node.velocity * Math.sin(node.angle)
    //     ctx.beginPath()
    //     ctx.moveTo(point.x, point.y)
    //     ctx.lineTo(point.x + ax, point.y + ay)
    //     ctx.lineWidth = 2
    //     ctx.strokeStyle = '#000'
    //     ctx.stroke()
    // }

    // if (node.previous) {
    //     const point = node.value
    //     const previous = node.previous.value
    //     const lineWidth = node.getVeloSize(50)
    //     ctx.beginPath()
    //     ctx.moveTo(previous.x, previous.y)
    //     ctx.lineTo(point.x, point.y)
    //     ctx.lineCap = 'round'
    //     ctx.lineJoin = 'round'
    //     ctx.lineWidth = lineWidth
    //     ctx.strokeStyle = 'rgba(0,0,0,0.5)'
    //     ctx.stroke()
    // }

    if(node.previous) {
        const [x0, y0, x1, y1] = node.getVeloCross(30)
        const [x3, y3, x2, y2] = (node.previous as PointChainNode).getVeloCross(30)
        // const left = Math.min(x0, x1, x2, x3)
        // const right = Math.max(x0, x1, x2, x3)
        // const top = Math.min(y0, y1, y2, y3)
        // const bottom = Math.max(y0, y1, y2, y3)
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.lineTo(x3, y3)
        ctx.closePath()
        // ctx.lineWidth = 2
        // ctx.strokeStyle = '#000'
        // ctx.stroke()
        ctx.fillStyle = 'rgba(0,0,0,0.5)'
        // ctx.fillStyle = '#000'
        ctx.fill()
    }
}
