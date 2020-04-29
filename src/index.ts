import { Vector2, Color } from "./utils/index";
import { CANVAS_WIDTH, CANVAS_HEIGHT, ctx, triangle, background, center, circle, arc, update, setup } from "./engine";

// Global Color variable that is used to represent when `checkIntersection()` returns true.
let c = new Color("#ff0000");

class Boid {
  public loc: Vector2;
  public dir: Vector2;
  public speed: number;
  public color: Color;
  public perceptionAngle: number;
  /**
   * 
   * @param loc The location of the center of the boid. The center is the centroid of the boid.
   * @param dir A unit vector representing the direction of the boid.
   * @param speed A number that scales the amount of pixels added to the location of the boid in the direction `dir`
   * @param color The color of the boid
   * @param perceptionAngle The angle in which the boid is aware of it's surroundings.
   */
  constructor(loc: Vector2, dir: Vector2, speed: number, color: Color, perceptionAngle: number = 120) {
    this.loc = loc;
    this.dir = dir;
    this.speed = speed;
    this.color = color;
    this.perceptionAngle = perceptionAngle;
  }

  /**
   * This function get's called every frame.
   * 
   * It should ideally only include business logic (i.e. moving the boid, doing calculations, etc.)
   * @param deltaTime The amount of miliseconds passed since the last frame
   */
  update(deltaTime: number): void {
    // Move the boid in the specified direction "dir" at speed "speed".
    this.loc.addAndMutate(this.dir.multiply(this.speed * deltaTime));

    // The following series of conditions checks if the boid's center is out
    // of bounds, and if so, changes its location to the opposite bounding edge.
    if (this.loc.x > CANVAS_WIDTH) {
      this.loc.x = 0;
    }
    if (this.loc.x < 0) {
      this.loc.x = CANVAS_WIDTH;
    }
    if (this.loc.y > CANVAS_HEIGHT) {
      this.loc.y = 0;
    }
    if (this.loc.y < 0) {
      this.loc.y = CANVAS_HEIGHT;
    }

    if (this.checkIntersection(new Vector2(200, 200), this.loc, 50, -this.perceptionAngle * Math.PI / 180, this.perceptionAngle * Math.PI / 180)) {
      c.r = 0;
      c.g = 255;
      c.b = 0;
    } else {
      c.r = 255;
      c.g = 0;
      c.b = 0;
    }
  }

  /**
   * This function takes a point with a location, and checks wether
   * it intersects with a circle sector with a specified radius, location, and starting
   * and ending angles.
   * 
   * The starting and ending angle of the circle sector are relative to the boid's direction.
   * (i.e. a 270 degree sector: = startAngle: -135 degrees, endAngle: 135 degrees)
   * @param pointLocation The location of the circle.
   * @param sectorLocation The location of the circle sector.
   * @param sectorRadius The radius of the circle sector.
   * @param sectorStartAngle The starting angle of the circle sector in radians.
   * @param sectorEndAngle The endinge angle of the circle sector in radians.
   */
  checkIntersection(pointLocation: Vector2, sectorLocation: Vector2, sectorRadius: number, sectorStartAngle: number, sectorEndAngle: number): boolean {
    arc(this.loc, sectorRadius, this.color, this.dir.getDirection() + sectorStartAngle, this.dir.getDirection() + sectorEndAngle, false);
    // Check if the circle at circleLocation with radius circleRadius is intersecting with the circle at sectorLocation with radius sectorRadius.
    if (!(Math.pow(pointLocation.x - sectorLocation.x, 2) + Math.pow(pointLocation.y - sectorLocation.y, 2) <= Math.pow(sectorRadius, 2))) return false;
    // If the angles are the same, which means a circle sector of 0 degrees, the circle cannot be intersecting the sector
    if (sectorStartAngle === sectorEndAngle) return false;
    // If the sector encompasses the entire circle (i.e. it is a 360 degree/2PI sector), it means the circle will always intersect the sector.
    if (Math.abs(sectorStartAngle - sectorEndAngle) === Math.PI*2) return true;

    // Calculate the angle between the sectorLocation and pointLocation points, then account for the direction of the boid.
    let pointVectorAngle: number = Math.atan2(pointLocation.y - sectorLocation.y, pointLocation.x - sectorLocation.x) - this.dir.getDirection();

    /**
     * This function returns a boolean value when the third argument `x`
     * has a value in between the values of `a` and `b`.
     * 
     * @param a The first limit.
     * @param b The second limit.
     * @param x The number that will be compared to the limits.
     * @returns A boolean indicating wether `x` is inside the limits
     * defined by `a` and `b`
     */
    const between = (a: number, b: number, x: number): boolean => {
      const min = Math.min(a, b),
        max = Math.max(a, b);
      return x > min && x < max;
    };

    // If the point's angle is in between the angles that define the sector, then the point is inside the sector.
    return between(sectorStartAngle, sectorEndAngle, pointVectorAngle);
  }

  /**
   * This function should be called when you want to render the boid.
   * 
   * This typically gets called every frame after `update()`.
   */
  draw(): void {
    // Save the translation and rotation info.
    ctx.save();

    // Translate the point to it's center (the boid's location is defined as it's center)
    ctx.translate(this.loc.x, this.loc.y);

    // Rotate the drawing by amount of radians calculated from the "dir" unit vector.
    // The "getDirection()" method returns the angle from the X axis to the vector, in radians.
    ctx.rotate(this.dir.getDirection());

    // Draw triangle at points (0, 7), (0, -7), (30, 0), with the center at (0, 0).
    // However, this way the center is at the halfway point of the base of the triangle.
    // The center must be at the actual centroid of the triangle to make it look and
    // function better.
    // So we find the center of the triangle (which happens to be (-10, 0)) and add it
    // to all of the other vertices.
    triangle(new Vector2(-10, -7), new Vector2(-10, 7), new Vector2(20, 0), this.color, true);

    // Restore the translation and rotation info.
    ctx.restore();
  }
}

// Global array that stores all of the boids.
let boids: Boid[] = [];

/**
 * Returns a random number between `min` (inclusive) and `max` (exclusive)
 * @param min Minimum number that can be outputted.
 * @param max The maximum number can be up to this value.
 * @param isWhole Wether to return an integer value, rather than a float.
 */
function randomRange(min: number, max: number, isWhole?: boolean): number {
  return isWhole ? Math.round(Math.random() * (max - min) + min) : Math.random() * (max - min) + min;
}

setup(() => {
  background(600, 600, new Color("#eeeeee"));
  center();
  for (let i = 0; i < 1; i++) {
    boids.push(new Boid(new Vector2(130, 100), new Vector2(1, 1).normalise(), 0.05, new Color(randomRange(0, 255, true), randomRange(0, 255, true), randomRange(0, 255, true))));
  }
});

update((deltaTime: number) => {
  circle(new Vector2(200, 200), 25, c, true);
  for (let boid of boids) {
    boid.update(deltaTime);
    boid.draw();
  }
});