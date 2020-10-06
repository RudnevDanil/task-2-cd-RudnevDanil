import Ball from './ball'
import Triangle from "./triangle";
import Hex from "./hex";

describe('Triangle constructor', () =>
{
    it('should construct triangle', () =>
    {
        const triangle = new Triangle(100,200,20,5,500,700);
        expect(triangle.x).toBe(100)
        expect(triangle.y).toBe(200)
        expect(triangle.k).toBe(20)
        expect(triangle.touched).toBe(0)
        expect(triangle.vx).toBeGreaterThanOrEqual(-2.5)
        expect(triangle.vx).toBeLessThan(2.5)
        expect(triangle.vy).toBeGreaterThanOrEqual(-2.5)
        expect(triangle.vy).toBeLessThan(2.5)
        expect(triangle.canv_w).toBe(500)
        expect(triangle.canv_h).toBe(700)
    })
})

describe('Triangle moving', () =>
{
    it('should move triangle and check walls', () =>
    {
        const triangle = new Triangle(100,200,20,5,500,700);
        let vx = triangle.vx;
        let vy = triangle.vy;
        triangle.move();
        expect(triangle.x).toBeCloseTo(100 + vx)
        expect(triangle.y).toBeCloseTo(200 + vy)

        // left wall
        triangle.x = 8;
        triangle.vx = 1;
        vx = 1;
        triangle.move();
        expect(triangle.vx).toBeCloseTo(-1)

        // right wall
        triangle.x = 491;
        triangle.vx = 1;
        vx = 1;
        triangle.move();
        expect(triangle.vx).toBeCloseTo(-1)

        triangle.x = 200;
        triangle.vx = 1;

        // top wall
        triangle.y = 7;
        triangle.vy = 1;
        vy = 1;
        triangle.move();
        expect(triangle.vy).toBeCloseTo(-1)

        // bottom wall
        triangle.y = 692;
        triangle.vy = 1;
        vy = 1;
        triangle.move();
        expect(triangle.vy).toBeCloseTo(-1)
    })
})

describe('Triangle system distance function', () =>
{
    it('should calculate distance from line to point with sign triangle', () =>
    {
        const triangle = new Triangle(100,200,20,5,500,700);
        let A = -1, B = 3, C = -2;
        let x1 = 4, y1 = 0;
        let x2 = 2, y2 = 3;

        expect(triangle._dist_lp(A,B,C,x1,y1)).toBeCloseTo(-1.8973)
        expect(triangle._dist_lp(A,B,C,x2,y2)).toBeCloseTo(1.5811)
    })
})

describe('Triangle activity if intersected', () =>
{
    it('should move triangle after intersection', () =>
    {
        const triangle = new Triangle(100,200,20,5,500,700);
        triangle.intersected(1,1);

        expect(triangle.touched).toBe(1)
    })
})

describe('Triangle touched max = 3', () => {
    it('if triangle_2 was touched enough', () => {
        const triangle_1 = new Triangle(100, 200, 20, 5, 500, 700);
        const triangle_2 = new Triangle(101, 201, 20, 5, 500, 700);

        triangle_1.touched = 3
        triangle_1.check_intersects(triangle_2)
        expect(triangle_1.x).toBeCloseTo(100)
        expect(triangle_1.y).toBeCloseTo(200)
        expect(triangle_2.x).toBeCloseTo(101)
        expect(triangle_2.y).toBeCloseTo(201)
    })

    it('if triangle_2 was touched enough', () => {
        const triangle_1 = new Triangle(100, 200, 20, 5, 500, 700);
        const triangle_2 = new Triangle(101, 201, 20, 5, 500, 700);

        triangle_2.touched = 3
        triangle_1.check_intersects(triangle_2)
        expect(triangle_1.x).toBeCloseTo(100)
        expect(triangle_1.y).toBeCloseTo(200)
        expect(triangle_2.x).toBeCloseTo(101)
        expect(triangle_2.y).toBeCloseTo(201)
    })
})

describe('Ball - Triangle collision', () =>
{
    it('ball - triangle intersect inside radius', () =>
    {
        const ball = new Ball(100,200,20,5,500,700);
        const triangle = new Triangle(101,201,20,5,500,700);

        triangle.check_intersects(ball)
        expect(triangle.touched).toBe(1)
        expect(triangle.x).toBeGreaterThan(101)
        expect(triangle.y).toBeGreaterThan(201)
    })

    it('ball - triangle NOT intersect', () =>
    {
        const ball = new Ball(100,200,20,5,500,700);
        const triangle = new Triangle(101,350,20,5,500,700);

        triangle.check_intersects(ball)
        expect(triangle.touched).toBe(0)
        expect(triangle.x).toBeCloseTo(101)
        expect(triangle.y).toBeCloseTo(350)
    })


    it('ball - triangle intersect by shapes from bottom', () =>
    {
        // ball under triangle and they are touched
        const ball = new Ball(100,228,20,5,500,700);
        const triangle = new Triangle(100,200,20,5,500,700);

        triangle.check_intersects(ball)
        expect(triangle.touched).toBe(1)
        expect(triangle.y).toBeLessThan(200)
    })

    it('ball - triangle NOT intersect by shapes from bottom', () =>
    {
        // ball under triangle and they are NOT touched
        const ball = new Ball(100,229,20,5,500,700);
        const triangle = new Triangle(100,200,20,5,500,700);

        triangle.check_intersects(ball)
        expect(triangle.touched).toBe(0)
        expect(triangle.y).toBeCloseTo(200)
    })

    it('ball - triangle intersect by shapes from left', () =>
    {
        // ball to the right triangle and they are touched
        const ball = new Ball(128,200,20,5,500,700);
        const triangle = new Triangle(100,200,20,5,500,700);

        triangle.check_intersects(ball)
        expect(triangle.touched).toBe(1)
        expect(triangle.x).toBeLessThan(100)
    })

    it('ball - triangle NOT intersect by shapes from left', () =>
    {
        // ball to the right triangle and they are NOT touched
        const ball = new Ball(130,200,20,5,500,700);
        const triangle = new Triangle(100,200,20,5,500,700);

        triangle.check_intersects(ball)
        expect(triangle.touched).toBe(0)
        expect(triangle.x).toBeCloseTo(100)
    })

    it('ball - triangle intersect by shapes from right', () =>
    {
        // ball to the left triangle and they are touched
        const ball = new Ball(72,200,20,5,500,700);
        const triangle = new Triangle(100,200,20,5,500,700);

        triangle.check_intersects(ball)
        expect(triangle.touched).toBe(1)
        expect(triangle.x).toBeGreaterThan(100)
    })

    it('ball - triangle NOT intersect by shapes from right', () =>
    {
        // ball to the left triangle and they are NOT touched
        const ball = new Ball(70,200,20,5,500,700);
        const triangle = new Triangle(100,200,20,5,500,700);

        triangle.check_intersects(ball)
        expect(triangle.touched).toBe(0)
        expect(triangle.x).toBeCloseTo(100)
    })
})

describe('Triangle - Triangle collision', () => {
    it('triangle - triangle intersect inside radius', () => {
        const triangle_1 = new Triangle(100, 200, 20, 5, 500, 700);
        const triangle_2 = new Triangle(101, 201, 20, 5, 500, 700);

        triangle_1.check_intersects(triangle_2)
        expect(triangle_2.touched).toBe(1)
        expect(triangle_2.x).toBeGreaterThan(101)
        expect(triangle_2.y).toBeGreaterThan(201)
    })

    it('triangle - triangle NOT intersect', () => {
        const triangle_1 = new Triangle(100, 200, 20, 5, 500, 700);
        const triangle_2 = new Triangle(100, 250, 20, 5, 500, 700);

        triangle_1.check_intersects(triangle_2)
        expect(triangle_2.touched).toBe(0)
        expect(triangle_2.x).toBeCloseTo(100)
        expect(triangle_2.y).toBeCloseTo(250)
    })

    it('triangle - triangle intersect', () => {
        const triangle_1 = new Triangle(100, 200, 20, 5, 500, 700);
        const triangle_2 = new Triangle(100, 210, 20, 5, 500, 700);

        triangle_2.check_intersects(triangle_1)
        expect(triangle_2.touched).toBe(1)
        expect(triangle_2.y).toBeGreaterThan(210)
    })


    it('triangle - triangle NOT intersect', () => {
        const triangle_1 = new Triangle(100, 200, 20, 5, 500, 700);
        const triangle_2 = new Triangle(100, 212, 20, 5, 500, 700);

        triangle_2.check_intersects(triangle_1)
        expect(triangle_2.touched).toBe(0)
        expect(triangle_2.y).toBeCloseTo(212)
    })

    it('triangle - triangle intersect', () => {
        const triangle_1 = new Triangle(100, 200, 20, 5, 500, 700);
        const triangle_2 = new Triangle(100, 210, 20, 5, 500, 700);

        triangle_1.check_intersects(triangle_2)
        expect(triangle_1.touched).toBe(1)
        expect(triangle_1.y).toBeLessThan(200)
    })


    it('triangle - triangle NOT intersect', () => {
        const triangle_1 = new Triangle(100, 200, 20, 5, 500, 700);
        const triangle_2 = new Triangle(100, 220, 20, 5, 500, 700);

        triangle_1.check_intersects(triangle_2)
        expect(triangle_1.touched).toBe(0)
        expect(triangle_1.y).toBeCloseTo(200)
    })
})

describe('Triangle - Hex collision', () => {
    it('triangle - hex intersect inside radius', () => {
        const hex = new Hex(100, 200, 20, 5, 500, 700);
        const triangle = new Triangle(101, 201, 20, 5, 500, 700);

        triangle.check_intersects(hex)
        expect(triangle.touched).toBe(1)
        expect(triangle.x).toBeGreaterThan(101)
        expect(triangle.y).toBeGreaterThan(201)
    })

    it('triangle - hex NOT intersect', () => {
        const hex = new Hex(100, 200, 20, 5, 500, 700);
        const triangle = new Triangle(100, 300, 20, 5, 500, 700);

        triangle.check_intersects(hex)
        expect(triangle.touched).toBe(0)
        expect(triangle.x).toBeCloseTo(100)
        expect(triangle.y).toBeCloseTo(300)
    })

    it('triangle - hex intersect by shapes', () => {
        // triangle to the right hex and they are touched
        const hex = new Hex(100, 200, 20, 5, 500, 700);
        const triangle = new Triangle(71, 191, 20, 5, 500, 700);

        triangle.check_intersects(hex)
        expect(triangle.touched).toBe(1)
        expect(triangle.x).toBeLessThan(71)
    })

    it('triangle - hex intersect by shapes', () => {
        // triangle to the left hex and they are touched
        const hex = new Hex(100, 200, 20, 5, 500, 700);
        const triangle = new Triangle(129, 191, 20, 5, 500, 700);

        triangle.check_intersects(hex)
        expect(triangle.touched).toBe(1)
        expect(triangle.x).toBeGreaterThan(129)
    })

    it('triangle - hex NOT intersect by shapes', () => {
        // triangle to the right hex and they are NOT touched
        const hex = new Hex(100, 200, 20, 5, 500, 700);
        const triangle = new Triangle(69, 191, 20, 5, 500, 700);

        triangle.check_intersects(hex)
        expect(triangle.touched).toBe(0)
        expect(triangle.x).toBeCloseTo(69)
    })

    it('triangle - hex NOT intersect by shapes', () => {
        // triangle to the left hex and they are NOT touched
        const hex = new Hex(100, 200, 20, 5, 500, 700);
        const triangle = new Triangle(131, 191, 20, 5, 500, 700);

        triangle.check_intersects(hex)
        expect(triangle.touched).toBe(0)
        expect(triangle.x).toBeCloseTo(131)
    })
})