export default class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static from(v: Vector2): Vector2 {
    return new Vector2(v.x, v.y);
  }

  /**
   * Returns the angle from the X-axis to the vector.
   * @returns Angle in radians.
   */
  getDirection(): number {
    return Math.atan2(this.y, this.x);
  };
  
  /**
   * Sets the direction of the vector.
   * @param radians Angle in radians.
   */
  setDirection(radians: number): void {
    const magnitude = this.getMagnitude();
    this.x = Math.cos(radians) * magnitude;
    this.y = Math.sin(radians) * magnitude;
  };
  
  /**
   * Gets the length of a vector from the origin.
   * @returns Length of vector.
   */
  getMagnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };
  
  /**
   * Sets the vectors length.
   * @param magnitude The number to set the vectors magnitude to.
   */
  setMagnitude(magnitude: number): void {
    const direction = this.getDirection(); 
    this.x = Math.cos(direction) * magnitude;
    this.y = Math.sin(direction) * magnitude;
  };

  /**
   * Returns the result of adding two vectors together.
   * @param v Another vector.
   * @returns A new vector.
   */
  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  /**
   * Adds the argument vector to this vector.
   * @param v Another vector.
   */
  addAndMutate(v: Vector2): void {
    this.x += v.x; this.y += v.y;
  }

  /**
   * Returns the result of subtracting the argument vector from this vector.
   * @param v Another vector.
   * @returns A new vector.
   */
  subtract(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  /**
   * Subtracts the argument vector from this vector.
   * @param v Another vector.
   */
  subtractAndMutate(v: Vector2): void {
    this.x -= v.x;
    this.y -= v.y;
  }

  /**
   * Returns an absolute value of this vector.
   * This essentially puts the vector into the first quadrant of the coordinate plane.
   * @returns An absolute vector.
   */
  absolute(): Vector2 {
    return new Vector2(Math.abs(this.x), Math.abs(this.y));
  }

  /**
   * Makes this vector absolute.
   */
  absoluteAndMutate(): void {
    this.set(this.absolute());
  }

  /**
   * Returns the result of multiplying this vector by the provided number.
   * @param scalar The number by which to multiply this vector.
   * @returns A new vector.
   */
  multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  /**
   * Multiplies this vector by the provided number.
   * @param scalar The number by which to multiply this vector.
   */
  multiplyAndMutate(scalar: number): void {
    this.x *= scalar; this.y *= scalar;
  }

  /**
   * Returns the result of dividing this vector by the provided number.
   * @param scalar The number by which to divide this vector.
   * @returns A new vector.
   */
  divide(scalar: number): Vector2 {
    return new Vector2(this.x / scalar, this.y / scalar);
  };
  
  /**
   * Divides this vector by the provided number.
   * @param scalar The number by which to divide this vector.
   */
  divideAndMutate(scalar: number): void {
    this.x /= scalar;
    this.y /= scalar;
  };

  /**
   * Returns a vector identical to this one.
   * @returns A new vector.
   */
  copy(): Vector2 {
    return new Vector2(this.x, this.y);
  };
  
  /**
   * Returns a string representation of this vector.
   * @returns A string representing this vector.
   * @example "x: 20, y: 30"
   */
  toString(): string {
    return "x: " + this.x + ", y: " + this.y;
  };
  /**
   * Returns an array representation of this vector.
   * @returns An array representing this vector.
   * @example "[20, 30]"
   */
  toArray(): number[] {
    return [this.x, this.y];
  };
  
  /**
   * Returns an object representation of this vector.
   * @returns An object representing this vector.
   * @example {x: 20, y: 30}
   */
  toObject(): {x: number, y: number} {
    return {x: this.x, y: this.y};
  };

  /**
   * Sets this vector's coordinates to that of another vector.
   */
  set(v: Vector2): void {
    this.x = v.x; this.y = v.y;
  }

  /**
   * Returns the result of normalising this vector.
   * @returns A normalised vector.
   */
  normalise(): Vector2 {
    return this.divide(this.getMagnitude());
  }

  /**
   * Normalises this vector.
   */
  normaliseAndMutate(): void {
    this.divideAndMutate(this.getMagnitude());
  }

  /**
   * Returns the normal of this vector.
   * By default, this returns the counter-clockwise normal.
   * @param clockwise Wether to return the clockwise normal of this vector.
   * Defaults to false.
   * @returns A normal vector.
   */
  normal(clockwise: boolean = false): Vector2 {
    return new Vector2(clockwise ? this.y : -this.y, clockwise ? -this.x : this.x);
  }
}