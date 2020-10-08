import QuadTree from './quad-tree'
import Ball from "./ball";
import Triangle from "./triangle";
import Hex from "./hex";
import Rectangle from './rectangle'

describe('QuadTree', () => {
    it('should be empty in the initial state', () => {
        const boundary = new Rectangle(0, 0, 100, 100)
        const tree = new QuadTree(boundary)

        expect(tree.length).toBe(0)
    })

    it('should throw an exception when boundary has not been passed', () => {
        expect(() => {
            const tree = new QuadTree()
        }).toThrow(TypeError)
    })

    it('should throw an exception when boundary is not a Rectangle', () => {
        expect(() => {
            const tree = new QuadTree(42)
        }).toThrow(TypeError)
    })

    it('should return true if insert in tree corect',() => {
        const area = new Rectangle(0,0,1200,1920)
        const tree = new QuadTree(area)
        let fig = []
        fig.push(new Ball(50,50,20, 5, 500, 700))
        fig.push(new Triangle(250,250,20, 5, 500, 700))
        fig.push(new Ball(550,550,20, 5, 500, 700))
        fig.push(new Ball(570,520,20, 5, 500, 700))
        fig.push(new Triangle(450,450,20, 5, 500, 700))
        expect(() =>{
            tree.length == 5
        }).toBeTruthy()
    })

    it('should return correct candidates',() => {
        const area = new Rectangle(0,0,1200,1920)
        const tree = new QuadTree(area)
        let fig = []
        fig.push(new Ball(50,50,20, 5, 500, 700))
        fig.push(new Triangle(250,250,20, 5, 500, 700))
        fig.push(new Ball(550,550,20, 5, 500, 700))
        fig.push(new Ball(570,520,20, 5, 500, 700))
        fig.push(new Triangle(450,450,20, 5, 500, 700))
        fig.push(new Hex(550,590,20, 5, 500, 700))
        let candidates =[]
        const len = 100
        const bounds = new Rectangle(fig[4].center().x-25,fig[4].center().x-25,len,len)
        tree.queryRange(bounds,candidates)
        let ExpectedCandidates = []
        ExpectedCandidates.push(fig[4]) //сам обьект
        ExpectedCandidates.push(fig[3]) //обьект находищийся в радиусе возможно столкновения
        ExpectedCandidates.push(fig[5]) //обьект находищийся в радиусе возможно столкновения
        expect(() => {
            ExpectedCandidates == candidates
        }).toBeTruthy()
    })

    it('should return correct candidates',() => {
        let objs = [];
        for (let i = 0; i < 10; i++)
        {
            objs[i] = new Ball(100, 200, 10, 20, 500, 500);
            objs[i].move();
        }

        let area = new Rectangle(0,0,500, 700)
        let tree = new QuadTree(area)
        let points = []
        for(let fig of objs)
            points.push(fig.center())
        points.forEach(p=>tree.insert(p))
        let candidates =[]
        for (let i = 0;i< points.length;i++) {
            const len = 100
            const bounds = new Rectangle(points[i].x-50, points[i].y-50, len, len)
            tree.queryRange(bounds, candidates)
            for (let other of candidates) {
                if (points[i].figure != other.figure)
                {
                    points[i].figure.check_intersects(other.figure)
                }
            }
        }

        for (let i = 0; i < 10; i++)
        {
            expect(objs[i].touched).toBeGreaterThan(0);
        }

        tree.clear();
    })
})