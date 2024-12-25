import { useEffect, useState } from "react"
import './app.scss'

import {
    createPaintController,
    renderPoints,
} from './canvas-brush'

export default () => {
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
    useEffect(() => {
        if(!canvas) {
            return
        }
        const handler = createPaintController(canvas, {
            onMove: (point, privousPoint, points) => {
                renderPoints(canvas, points)
            }
        })
        return () => {
            handler.dispose()
        }
    }, [canvas])
    return <div className="canvas-brush-wrapper">
        <h1>Canvas Brush</h1>
        <canvas className="canvas-brush" width={640} height={480} ref={setCanvas}></canvas>
    </div>
}