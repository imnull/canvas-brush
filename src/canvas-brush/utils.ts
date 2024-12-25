import { TPoint } from "./type";

export const calDistance = (a: TPoint, b: TPoint) => {
    const x = a.x - b.x
    const y = a.y - b.y
    return Math.sqrt(x * x + y * y)
}

export const calAngle = (a: TPoint, b: TPoint) => {
    const x = a.x - b.x
    const y = a.y - b.y
    return Math.atan2(y, x)
}