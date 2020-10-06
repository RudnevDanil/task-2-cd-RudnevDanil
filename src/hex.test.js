import Ball from './hex'
import Triangle from "./triangle";
import Hex from "./hex";

describe('Hex constructor', () =>
{
    it('should construct hex', () =>
    {
        const hex = new Hex(100,200,20,5,500,700);
        expect(hex.x).toBe(100)
        expect(hex.y).toBe(200)
        expect(hex.k).toBe(20)
        expect(hex.touched).toBe(0)
        expect(hex.vx).toBeGreaterThanOrEqual(-2.5)
        expect(hex.vx).toBeLessThan(2.5)
        expect(hex.vy).toBeGreaterThanOrEqual(-2.5)
        expect(hex.vy).toBeLessThan(2.5)
        expect(hex.canv_w).toBe(500)
        expect(hex.canv_h).toBe(700)
    })
})

describe('Hex moving', () =>
{
    it('should move hex and check walls', () =>
    {
        const hex = new Hex(100,200,20,5,500,700);
        let vx = hex.vx;
        let vy = hex.vy;
        hex.move();
        expect(hex.x).toBeCloseTo(100 + vx)
        expect(hex.y).toBeCloseTo(200 + vy)

        // left wall
        hex.x = 18;
        hex.vx = 1;
        vx = 1;
        hex.move();
        expect(hex.vx).toBeCloseTo(-1)

        // right wall
        hex.x = 480;
        hex.vx = 1;
        vx = 1;
        hex.move();
        expect(hex.vx).toBeCloseTo(-1)

        hex.x = 200;
        hex.vx = 1;

        // top wall
        hex.y = 16;
        hex.vy = 1;
        vy = 1;
        hex.move();
        expect(hex.vy).toBeCloseTo(-1)

        // bottom wall
        hex.y = 683;
        hex.vy = 1;
        vy = 1;
        hex.move();
        expect(hex.vy).toBeCloseTo(-1)
    })
})

describe('Hex system distance function', () =>
{
    it('should calculate distance from line to point with sign hex', () =>
    {
        const hex = new Hex(100,200,20,5,500,700);
        let A = -1, B = 3, C = -2;
        let x1 = 4, y1 = 0;
        let x2 = 2, y2 = 3;

        expect(hex._dist_lp(A,B,C,x1,y1)).toBeCloseTo(-1.8973)
        expect(hex._dist_lp(A,B,C,x2,y2)).toBeCloseTo(1.5811)
    })
})

describe('Hex activity if intersected', () =>
{
    it('should move hex after intersection', () =>
    {
        const hex = new Hex(100,200,20,5,500,700);
        hex.intersected(1,1);

        expect(hex.touched).toBe(1)
    })
})

describe('Hex touched max = 3', () => {
    it('if hex was touched enough', () => {
        const hex_1 = new Hex(100, 200, 20, 5, 500, 700);
        const hex_2 = new Hex(101, 201, 20, 5, 500, 700);

        hex_1.touched = 3
        hex_1.check_intersects(hex_2)
        expect(hex_1.x).toBeCloseTo(100)
        expect(hex_1.y).toBeCloseTo(200)
        expect(hex_2.x).toBeCloseTo(101)
        expect(hex_2.y).toBeCloseTo(201)
    })

    it('if hex was touched enough', () => {
        const hex_1 = new Hex(100, 200, 20, 5, 500, 700);
        const hex_2 = new Hex(101, 201, 20, 5, 500, 700);

        hex_2.touched = 3
        hex_1.check_intersects(hex_2)
        expect(hex_1.x).toBeCloseTo(100)
        expect(hex_1.y).toBeCloseTo(200)
        expect(hex_2.x).toBeCloseTo(101)
        expect(hex_2.y).toBeCloseTo(201)
    })
})

describe('Ball - Hex collision', () => {

    it('ball - hex intersect inside radius', () => {
        const ball = new Ball(100, 200, 20, 5, 500, 700);
        const hex = new Hex(101, 201, 20, 5, 500, 700);

        hex.check_intersects(ball)
        expect(hex.touched).toBe(1)
        expect(hex.x).toBeGreaterThan(101) //
        expect(hex.y).toBeGreaterThan(201) //
    })

    it('ball - hex NOT intersect inside radius', () => {
        const ball = new Ball(100, 200, 20, 5, 500, 700);
        const hex = new Hex(141, 200, 20, 5, 500, 700);

        hex.check_intersects(ball)
        expect(hex.touched).toBe(0)
        expect(hex.x).toBeCloseTo(141)
        expect(hex.y).toBeCloseTo(200)
    })

    it('ball - hex intersect by shapes from right', () =>
    {
        // ball to the left hex and they are touched
        const ball = new Ball(139,200,20,5,500,700);
        const hex = new Hex(100,200,20,5,500,700);

        hex.check_intersects(ball)
        expect(hex.touched).toBe(1)
        expect(hex.x).toBeLessThan(100)
    })

    it('ball - hex NOT intersect by shapes from right', () =>
    {
        // ball to the left hex and they are touched
        const ball = new Ball(141,200,20,5,500,700);
        const hex = new Hex(100,200,20,5,500,700);

        hex.check_intersects(ball)
        expect(hex.touched).toBe(0)
        expect(hex.x).toBeCloseTo(100)
    })

    /*it('ball - hex intersect by shapes from bottom', () =>
    {
        // ball to the left hex and they are touched
        const ball = new Ball(100,235,20,5,500,700);
        const hex = new Hex(100,200,20,5,500,700);

        hex.check_intersects(ball)
        expect(hex.touched).toBe(1)
        expect(hex.y).toBeLessThan(200)
    })*/


    it('ball - hex NOT intersect by shapes from bottom', () =>
    {
        // ball to the left hex and they are touched
        const ball = new Ball(100,238,20,5,500,700);
        const hex = new Hex(100,200,20,5,500,700);

        hex.check_intersects(ball)
        expect(hex.touched).toBe(0)
        expect(hex.y).toBeCloseTo(200)
    })
})

describe('Triangle - Hex collision', () => {
    it('triangle - hex intersect inside radius', () => {
        const hex = new Hex(100, 200, 20, 5, 500, 700);
        const triangle = new Triangle(101, 201, 20, 5, 500, 700);

        hex.check_intersects(triangle)
        expect(hex.touched).toBe(1)
        expect(hex.x).toBeLessThan(100)
        expect(hex.y).toBeLessThan(200)
    })

    it('triangle - hex NOT intersect', () => {
        const hex = new Hex(100, 200, 20, 5, 500, 700);
        const triangle = new Triangle(100, 300, 20, 5, 500, 700);

        hex.check_intersects(triangle)
        expect(hex.touched).toBe(0)
        expect(hex.x).toBeCloseTo(100)
        expect(hex.y).toBeCloseTo(200)
    })

    it('triangle - hex intersect by shapes', () => {
        // triangle to the right hex and they are touched
        const hex = new Hex(100, 200, 20, 5, 500, 700);
        const triangle = new Triangle(71, 191, 20, 5, 500, 700);

        hex.check_intersects(triangle)
        expect(hex.touched).toBe(1)
        expect(hex.x).toBeGreaterThan(100)
    })

    it('triangle - hex intersect by shapes', () => {
        // triangle to the left hex and they are touched
        const hex = new Hex(100, 200, 20, 5, 500, 700);
        const triangle = new Triangle(129, 191, 20, 5, 500, 700);

        hex.check_intersects(triangle)
        expect(hex.touched).toBe(1)
        expect(hex.x).toBeLessThan(100)
    })

    it('triangle - hex NOT intersect by shapes', () => {
        // triangle to the right hex and they are NOT touched
        const hex = new Hex(100, 200, 20, 5, 500, 700);
        const triangle = new Triangle(69, 191, 20, 5, 500, 700);

        hex.check_intersects(triangle)
        expect(hex.touched).toBe(0)
        expect(hex.x).toBeCloseTo(100)
    })

    it('triangle - hex NOT intersect by shapes', () => {
        // triangle to the left hex and they are NOT touched
        const hex = new Hex(100, 200, 20, 5, 500, 700);
        const triangle = new Triangle(131, 191, 20, 5, 500, 700);

        hex.check_intersects(triangle)
        expect(hex.touched).toBe(0)
        expect(hex.x).toBeCloseTo(100)
    })
})

describe('Hex - Hex collision', () => {
    it('hex - hex intersect inside radius', () => {
        const hex_1 = new Hex(100, 200, 20, 5, 500, 700);
        const hex_2 = new Hex(101, 201, 20, 5, 500, 700);

        hex_1.check_intersects(hex_2)
        expect(hex_1.touched).toBe(1)
        expect(hex_1.x).toBeLessThan(100)
        expect(hex_1.y).toBeLessThan(200)
    })

    it('hex - hex intersect inside radius', () => {
        const hex_1 = new Hex(100, 200, 20, 5, 500, 700);
        const hex_2 = new Hex(100, 300, 20, 5, 500, 700);

        hex_1.check_intersects(hex_2)
        expect(hex_2.touched).toBe(0)
        expect(hex_2.x).toBeCloseTo(100)
        expect(hex_2.y).toBeCloseTo(300)
    })
})