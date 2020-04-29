import { Vector2, Color } from "./utils/index";

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D  = canvas.getContext("2d")!;

let CANVAS_WIDTH = canvas.width,
  CANVAS_HEIGHT = canvas.height,
  globalColor = new Color("rgb(0, 0, 0)");

/**
 * This function resizes the canvas to the specified size, and simply draws
 * a rectangle covering the entire canvas with the specified fill color.
 * @param width The width of the canvas.
 * @param height The height of the canvas in pixels.
 * @param color The color of the canvas in pixels.
 * @example background(600, 600, new Color("rgb(127, 255, 0)"))
 */
function background(width: number, height: number, color: Color) {
  CANVAS_WIDTH = width;
  CANVAS_HEIGHT = height;
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  globalColor = color;

  ctx.fillStyle = color.getHex();
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

/**
 * This function is purely a DOM manipulation function: it 
 * absolutely centers the canvas element.
 */
function center() {
  canvas.style.position = "absolute";
  canvas.style.top = "50%";
  canvas.style.left = "50%";
  canvas.style.transform = "translate(-50%, -50%)";
}

/**
 * This function simply draws a line.
 * @param loc1 The location of the first point.
 * @param loc2 The location of the second point.
 * @param color The color of the line.
 * @param width Optional parameter: if not specified, defaults to 1. The width of the line in pixels.
 * @example stroke(new Vector2(100, 100), new Vector2(500, 200), new Color("rgb(127, 255, 0)"), 5)
 */
function stroke(loc1: Vector2, loc2: Vector2, color: Color, width?: number) {
  ctx.lineWidth = width || 1;
  ctx.strokeStyle = color.getHex();
  ctx.beginPath();
  ctx.moveTo(loc1.x, loc1.y);
  ctx.lineTo(loc2.x, loc2.y);
  ctx.closePath();
  ctx.stroke();
}

/**
 * This function draws either a filled circle, or a hollow circle with a border.
 * @param loc The location of the center of the circle.
 * @param radius The radius of the circle in pixels.
 * @param color The color of the circle.
 * @param fill Wether or not the circle should be filled.
 * @param width Only applies when `fill` is false: the width of the circle border.
 * @example circle(new Vector2(300, 300), 50, new Color("rgb(127, 255, 0)"), false, 5)
 */
function circle(loc: Vector2, radius: number, color: Color, fill: boolean, width?: number) {
  ctx.lineWidth = width || 1;
  ctx.strokeStyle = color.getHex();
  ctx.fillStyle = color.getHex();
  ctx.beginPath();
  ctx.arc(loc.x, loc.y, radius, 0, Math.PI * 2);
  ctx.closePath();
  fill ? ctx.fill() : ctx.stroke();
}

/**
 * This function draws either a filled rectangle, or a hollow rectangle with a border.
 * @param loc1 The first vertex of the rectangle.
 * @param loc2 The vertex opposite/diagonal to the first vertex.
 * @param color The color of the rectangle.
 * @param fill Wether or not the rectangle should be filled.
 * @param width Only applies when `fill` is false: the width of the rectangle border.
 * @example rect(new Vector2(200, 200), new Vector2(100, 100), new Color("rgb(127, 255, 0)"), true)
 */
function rect(loc1: Vector2, loc2: Vector2, color: Color, fill: boolean, width?: number) {
  stroke(new Vector2(loc1.x, loc1.y), new Vector2(loc2.x, loc1.y), color, width || 1);
  stroke(new Vector2(loc1.x, loc1.y), new Vector2(loc1.x, loc2.y), color, width || 1);
  stroke(new Vector2(loc1.x, loc2.y), new Vector2(loc1.x, loc2.y), color, width || 1);
  stroke(new Vector2(loc1.x, loc2.y), new Vector2(loc1.x, loc1.y), color, width || 1);
  if (fill) {
    ctx.fillStyle = color.getHex();
    let v1b = new Vector2(0, 0), v2b = new Vector2(0, 0);
    if (loc1.x < loc2.x) {
      v1b.x = loc1.x, v2b.x = loc2.x;
    } else {
      v1b.x = loc2.x; v2b.x = loc1.x;
    }
    if (loc1.y < loc2.y) {
      v1b.y = loc1.y, v2b.y = loc2.y;
    } else {
      v1b.y = loc2.y; v2b.y = loc1.y;
    }
    ctx.rect(v1b.x, v1b.y, Math.abs(v1b.x - v2b.x), Math.abs(v1b.y - v2b.y));
    ctx.fill();
  }
}

/**
 * This function draws a triangle connecting the 3 provided vertices.
 * It can either be filled, or hollow with a border.
 * 
 * The order of the vertices does not matter.
 * @param loc1 The first vertex of the triangle.
 * @param loc2 The second vertex of the triangle.
 * @param loc3 The third vertex of the triangle.
 * @param color The color of the triangle.
 * @param fill Wether or not the triangle should be filled.
 * @param width Only applies when `fill` is false: the width of the triangle border.
 * @example triangle(new Vector2(300, 300), new Vector2(250, 350), new Vector2(200, 250), new Color("rgb(127, 255, 0)"), false, 5)
 */
function triangle(loc1: Vector2, loc2: Vector2, loc3: Vector2, color: Color, fill: boolean, width?: number) {
  ctx.lineWidth = width || 1;
  ctx.strokeStyle = color.getHex();
  ctx.fillStyle = color.getHex();
  ctx.beginPath();
  ctx.moveTo(loc1.x, loc1.y);
  ctx.lineTo(loc2.x, loc2.y);
  ctx.lineTo(loc3.x, loc3.y);
  ctx.moveTo(loc3.x, loc3.y);
  ctx.lineTo(loc2.x, loc2.y);
  ctx.closePath();
  fill ? ctx.fill() : ctx.stroke();
}

/**
 * This function simply calls `background()`, except
 * the arguments are always the current canvas width
 * and height, and the color used in the last `background()` call.
 * It is used to clear the canvas.
 * 
 * The engine calls this function every frame.
 * 
 * You should not need to call this function manually,
 * it is exposed for convenience.
 */
function clear() {
  background(CANVAS_WIDTH, CANVAS_HEIGHT, globalColor);
}

/**
 * This function draws a circle sector (an arc connected with the center).
 * 
 * It is essentially a _"slice of pie"_ shape.
 * 
 * The starting angle and ending angle are in a clockwise order.
 * @param loc The center location of the arc.
 * @param radius The radius of the arc.
 * @param color The color of the arc.
 * @param startAngle The starting angle of the arc in radians.
 * @param endAngle The ending angle of the arc in radians.
 * @param fill Wether or not the arc should be filled.
 * @param width Only applies when `fill` is false: the width of the lines of the shape.
 * @example arc(new Vector2(300, 300), 50, new Color("rgb(127, 255, 0)"), 270, 0, false, 5)
 */
function arc(loc: Vector2, radius: number, color: Color, startAngle: number, endAngle: number, fill: boolean,  width?: number) {
  ctx.strokeStyle = color.getHex();
  ctx.lineWidth = width || 1;
  ctx.fillStyle = color.getHex();
  ctx.beginPath();
  Math.abs(startAngle - endAngle) !== Math.PI*2 && startAngle !== endAngle && ctx.moveTo(loc.x, loc.y);
  ctx.arc(loc.x, loc.y, radius, startAngle, endAngle);
  Math.abs(startAngle - endAngle) !== Math.PI*2 && startAngle !== endAngle && ctx.lineTo(loc.x, loc.y);
  ctx.closePath();
  fill ? ctx.fill() : ctx.stroke();
}


/**
 * This function is called once, on app startup.
 * 
 * This is where `background()`, `center()`, and other DOM
 * functions should be ideally called, for performance reasons.
 * 
 * Note that this function does not initalise the main loop, instead
 * that functionality is passed onto the `update()` function.
 * @param callback The callback function that executes your code.
 */
function setup(callback?: Function) {
  callback && callback();
}


/**
 * This function initialises the main app loop.
 * The provided callback is called every frame.
 * 
 * This function is called inside a `requestAnimationFrame()`, which
 * makes sure it will run at the maximum possible performance.
 * @param callback The callback function that executes your code.
 */
function update(callback?: Function) {
  let then = Date.now(), now = 0;
  requestAnimationFrame(() => {
    now = Date.now();
    clear(); callback && callback(now - then);
    then = now;
    requestAnimationFrame(() => update(callback));
  });
}

export {
  canvas,
  ctx,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  background,
  center,
  stroke,
  circle,
  arc,
  rect,
  triangle,
  clear,
  setup,
  update,
  Vector2,
  Color
}