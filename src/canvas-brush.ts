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
type TPoint = { x: number; y: number; t: number }
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
    onStart?: (point: TPoint) => void;
    onMove?: (point: TPoint, provious: TPoint | null, points: TPoint[]) => void;
    onEnd?: (points: TPoint[]) => void;
} = {}) => {
    const {
        onMove,
        onStart,
        onEnd
    } = config

    const eventNames = getEventNames()
    const { left, top } = canvas.getBoundingClientRect()

    let points: TPoint[] = []
    const pushPoint = (point: TPoint) => {
        const x = point.x - left
        const y = point.y - top
        const p = { x, y, t: point.t }
        points.push(p)
        return p
    }

    let proviousPoint: TPoint | null = null
    const mousedown = (e: any) => {
        points = []
        proviousPoint = null
        const pos = getEventPosition(e)
        if (!pos) {
            return
        }
        const point = pushPoint(pos)
        if(typeof onStart === 'function') {
            onStart(point)
        }
        if(typeof onMove === 'function') {
            onMove(point, proviousPoint, points)
        }
        proviousPoint = point

        document.addEventListener(eventNames.mousemove, mousemove)
        document.addEventListener(eventNames.mouseup, mouseup)
    }
    const mousemove = (e: any) => {
        const pos = getEventPosition(e)
        if (!pos) {
            return
        }
        const point = pushPoint(pos)
        if(typeof onMove === 'function') {
            onMove(point, proviousPoint, points)
        }
        proviousPoint = point
    }
    const mouseup = (e: any) => {
        if(typeof onEnd === 'function') {
            onEnd(points)
        }
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

export const renderPoints = (canvas: HTMLCanvasElement, points: TPoint[]) => {
    if(points.length < 1) {
        return
    }
    const ctx = canvas.getContext('2d')
    if(!ctx) {
        return
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let provious: TPoint | null = null
    points.forEach(point => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 3, 0, PI2)
        ctx.fillStyle = '#000'
        ctx.fill()
        if(provious) {
            ctx.moveTo(provious.x, provious.y)
            ctx.lineTo(point.x, point.y)
            ctx.lineWidth = 2
            ctx.strokeStyle = '#000'
            ctx.stroke()
        }
        provious = point
    })
}