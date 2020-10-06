import Ball from './ball'
import Triangle from "./triangle";
import Hex from "./hex";

describe('Ball constructor', () =>
{
    it('should construct ball', () =>
    {
        const ball = new Ball(100,200,20,5,500,700);
        expect(ball.x).toBe(100)
        expect(ball.y).toBe(200)
        expect(ball.k).toBe(20)
        expect(ball.touched).toBe(0)
        expect(ball.vx).toBeGreaterThanOrEqual(-2.5)
        expect(ball.vx).toBeLessThan(2.5)
        expect(ball.vy).toBeGreaterThanOrEqual(-2.5)
        expect(ball.vy).toBeLessThan(2.5)
        expect(ball.canv_w).toBe(500)
        expect(ball.canv_h).toBe(700)
    })
})

describe('Ball moving', () =>
{
    it('should move ball and check walls', () =>
    {
        const ball = new Ball(100,200,20,5,500,700);
        let vx = ball.vx;
        let vy = ball.vy;
        ball.move();
        expect(ball.x).toBeCloseTo(100 + vx)
        expect(ball.y).toBeCloseTo(200 + vy)



        // left wall
        ball.x = 18;
        ball.vx = 1;
        vx = 1;
        ball.move();
        expect(ball.vx).toBeCloseTo(-1)

        // right wall
        ball.x = 480;
        ball.vx = 1;
        vx = 1;
        ball.move();
        expect(ball.vx).toBeCloseTo(-1)

        ball.x = 200;
        ball.vx = 1;

        // top wall
        ball.y = 18;
        ball.vy = 1;
        vy = 1;
        ball.move();
        expect(ball.vy).toBeCloseTo(-1)

        // bottom wall
        ball.y = 680;
        ball.vy = 1;
        vy = 1;
        ball.move();
        expect(ball.vy).toBeCloseTo(-1)
    })
})

describe('Ball system distance function', () =>
{
    it('should calculate distance from line to point with sign ball', () =>
    {const ball = new Ball(100,200,20,5,500,700);
        let A = -1, B = 3, C = -2;
        let x1 = 4, y1 = 0;
        let x2 = 2, y2 = 3;

        expect(ball._dist_lp(A,B,C,x1,y1)).toBeCloseTo(-1.8973)
        expect(ball._dist_lp(A,B,C,x2,y2)).toBeCloseTo(1.5811)
    })
})

describe('Ball activity if intersected', () =>
{
    it('should move ball after intersection', () =>
    {
        const ball = new Ball(100,200,20,5,500,700);
        ball.intersected(1,1);

        expect(ball.touched).toBe(1)
    })
})

describe('Ball touched max = 3', () => {
    it('if ball was touched enough', () => {
        const ball_1 = new Ball(100, 200, 20, 5, 500, 700);
        const ball_2 = new Ball(101, 201, 20, 5, 500, 700);

        ball_1.touched = 3
        ball_1.check_intersects(ball_2)
        expect(ball_1.x).toBeCloseTo(100)
        expect(ball_1.y).toBeCloseTo(200)
        expect(ball_2.x).toBeCloseTo(101)
        expect(ball_2.y).toBeCloseTo(201)
    })

    it('if ball was touched enough', () => {
        const ball_1 = new Ball(100, 200, 20, 5, 500, 700);
        const ball_2 = new Ball(101, 201, 20, 5, 500, 700);

        ball_2.touched = 3
        ball_1.check_intersects(ball_2)
        expect(ball_1.x).toBeCloseTo(100)
        expect(ball_1.y).toBeCloseTo(200)
        expect(ball_2.x).toBeCloseTo(101)
        expect(ball_2.y).toBeCloseTo(201)
    })
})

describe('Ball - Ball collision', () =>
{
    it('ball - ball intersect inside radius', () =>
    {
        const ball_1 = new Ball(100,200,20,5,500,700);
        const ball_2 = new Ball(101,201,20,5,500,700);

        ball_1.check_intersects(ball_2)
        expect(ball_1.touched).toBe(1)
        expect(ball_2.touched).toBe(1)
        expect(ball_1.x).toBeLessThan(100)
        expect(ball_1.y).toBeLessThan(200)
        expect(ball_2.x).toBeGreaterThan(101)
        expect(ball_2.y).toBeGreaterThan(201)
    })

    it('ball - ball NOT intersect', () =>
    {
        const ball_1 = new Ball(100,200,20,5,500,700);
        const ball_2 = new Ball(141,241,20,5,500,700);

        ball_1.check_intersects(ball_2)
        expect(ball_1.touched).toBe(0)
        expect(ball_2.touched).toBe(0)
        expect(ball_1.x).toBeCloseTo(100)
        expect(ball_1.y).toBeCloseTo(200)
        expect(ball_2.x).toBeCloseTo(141)
        expect(ball_2.y).toBeCloseTo(241)
    })
})

describe('Ball - Triangle collision', () =>
{
    it('ball - triangle intersect inside radius', () =>
    {
        const ball = new Ball(100,200,20,5,500,700);
        const triangle = new Triangle(101,201,20,5,500,700);

        ball.check_intersects(triangle)
        expect(ball.touched).toBe(1)
        expect(ball.x).toBeLessThan(100)
        expect(ball.y).toBeLessThan(200)
    })

    it('ball - triangle NOT intersect', () =>
    {
        const ball = new Ball(100,200,20,5,500,700);
        const triangle = new Triangle(101,350,20,5,500,700);

        ball.check_intersects(triangle)
        expect(ball.touched).toBe(0)
        expect(ball.x).toBeCloseTo(100)
        expect(ball.y).toBeCloseTo(200)
    })


    it('ball - triangle intersect by shapes from bottom', () =>
    {
        // ball under triangle and they are touched
        const ball = new Ball(100,228,20,5,500,700);
        const triangle = new Triangle(100,200,20,5,500,700);

        ball.check_intersects(triangle)
        expect(ball.touched).toBe(1)
        expect(ball.y).toBeGreaterThan(228)
    })

    it('ball - triangle NOT intersect by shapes from bottom', () =>
    {
        // ball under triangle and they are NOT touched
        const ball = new Ball(100,229,20,5,500,700);
        const triangle = new Triangle(100,200,20,5,500,700);

        ball.check_intersects(triangle)
        expect(ball.touched).toBe(0)
        expect(ball.y).toBeCloseTo(229)
    })

    it('ball - triangle intersect by shapes from left', () =>
    {
        // ball to the right triangle and they are touched
        const ball = new Ball(128,200,20,5,500,700);
        const triangle = new Triangle(100,200,20,5,500,700);

        ball.check_intersects(triangle)
        expect(ball.touched).toBe(1)
        expect(ball.x).toBeGreaterThan(128)
    })

    it('ball - triangle NOT intersect by shapes from left', () =>
    {
        // ball to the right triangle and they are NOT touched
        const ball = new Ball(130,200,20,5,500,700);
        const triangle = new Triangle(100,200,20,5,500,700);

        ball.check_intersects(triangle)
        expect(ball.touched).toBe(0)
        expect(ball.x).toBeCloseTo(130)
    })

    it('ball - triangle intersect by shapes from right', () =>
    {
        // ball to the left triangle and they are touched
        const ball = new Ball(72,200,20,5,500,700);
        const triangle = new Triangle(100,200,20,5,500,700);

        ball.check_intersects(triangle)
        expect(ball.touched).toBe(1)
        expect(ball.x).toBeLessThan(72)
    })

    it('ball - triangle NOT intersect by shapes from right', () =>
    {
        // ball to the left triangle and they are NOT touched
        const ball = new Ball(70,200,20,5,500,700);
        const triangle = new Triangle(100,200,20,5,500,700);

        ball.check_intersects(triangle)
        expect(ball.touched).toBe(0)
        expect(ball.x).toBeCloseTo(70)
    })
})

describe('Ball - Hex collision', () => {
    it('ball - hex intersect inside radius', () => {
        const ball = new Ball(100, 200, 20, 5, 500, 700);
        const hex = new Hex(101, 201, 20, 5, 500, 700);

        ball.check_intersects(hex)
        expect(ball.touched).toBe(1)
        expect(ball.x).toBeLessThan(100)
        expect(ball.y).toBeLessThan(200)
    })

    it('ball - hex NOT intersect inside radius', () => {
        const ball = new Ball(100, 200, 20, 5, 500, 700);
        const hex = new Hex(141, 200, 20, 5, 500, 700);

        ball.check_intersects(hex)
        expect(ball.touched).toBe(0)
        expect(ball.x).toBeCloseTo(100)
        expect(ball.y).toBeCloseTo(200)
    })

    it('ball - hex intersect by shapes from right', () =>
    {
        // ball to the left hex and they are touched
        const ball = new Ball(139,200,20,5,500,700);
        const hex = new Hex(100,200,20,5,500,700);

        ball.check_intersects(hex)
        expect(ball.touched).toBe(1)
        expect(ball.x).toBeGreaterThan(139)
    })

    it('ball - hex NOT intersect by shapes from right', () =>
    {
        // ball to the left hex and they are touched
        const ball = new Ball(141,200,20,5,500,700);
        const hex = new Hex(100,200,20,5,500,700);

        ball.check_intersects(hex)
        expect(ball.touched).toBe(0)
        expect(ball.x).toBeCloseTo(141)
    })

    it('ball - hex intersect by shapes from bottom', () =>
    {
        // ball to the left hex and they are touched
        const ball = new Ball(100,237,20,5,500,700);
        const hex = new Hex(100,200,20,5,500,700);

        ball.check_intersects(hex)
        expect(ball.touched).toBe(1)
        expect(ball.y).toBeGreaterThan(237)
    })

    it('ball - hex NOT intersect by shapes from bottom', () =>
    {
        // ball to the left hex and they are touched
        const ball = new Ball(100,238,20,5,500,700);
        const hex = new Hex(100,200,20,5,500,700);

        ball.check_intersects(hex)
        expect(ball.touched).toBe(0)
        expect(ball.y).toBeCloseTo(238)
    })
})