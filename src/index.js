import Ball from './ball'
import Triangle from './triangle'
import Hex from './hex'

const canvas = document.getElementById("cnvs");

const gs = {};

function queueUpdates(numTicks)
{
    for (let i = 0; i < numTicks; i++)
    {
        gs.lastTick = gs.lastTick + gs.tickLength
        update(gs.lastTick)
    }
}

function draw(tFrame)
{
    const cnt = canvas.getContext('2d');

    // clear canvas
    cnt.clearRect(0, 0, canvas.width, canvas.height)

    // draw
    for(let i = 0; i < gs.numbObj; i++)
    {
        gs.objs[i].draw(cnt)
    }
}

function update(tick)
{
    // move
    for(let i = 0; i < gs.numbObj; i++)
    {
        gs.objs[i].move();
    }

    // intersections
    for(let i = 0; i < gs.numbObj - 1; i++)
    {
        for(let j = i + 1; j < gs.numbObj; j++)
        {
            gs.objs[i].check_intersects(gs.objs[j]);
        }
    }
}

function run(tFrame)
{
    gs.stopCycle = window.requestAnimationFrame(run)

    const nextTick = gs.lastTick + gs.tickLength
    let numTicks = 0

    if (tFrame > nextTick) {
        const timeSinceTick = tFrame - gs.lastTick
        numTicks = Math.floor(timeSinceTick / gs.tickLength)
    }
    queueUpdates(numTicks)
    draw(tFrame)
    gs.lastRender = tFrame
}

function stopGame(handle)
{
    window.cancelAnimationFrame(handle);
}

function setup()
{
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    gs.lastTick = performance.now()
    gs.lastRender = gs.lastTick
    gs.tickLength = 15 //ms

    gs.numbObj = 100;
    gs.objs = [];
    gs.elements_k = [50, 100, 50]; // radius or wall side
    gs.base_obj_speed = 3;
    for(let i = 0; i < gs.numbObj; i++)
    {
        let x_rand = gs.elements_k[i % 3] + Math.random() * (canvas.width - 2 * gs.elements_k[i % 3]);
        let y_rand = gs.elements_k[i % 3] + Math.random() * (canvas.height - 2 * gs.elements_k[i % 3]);
        if(i % 3 == 0)
            gs.objs[i] = new Ball(x_rand, y_rand, gs.elements_k[0], gs.base_obj_speed, canvas.width, canvas.height);
        else if(i % 3 == 1)
            gs.objs[i] = new Triangle(x_rand, y_rand, gs.elements_k[1], gs.base_obj_speed, canvas.width, canvas.height);
        else
            gs.objs[i] = new Hex(x_rand, y_rand, gs.elements_k[2], gs.base_obj_speed, canvas.width, canvas.height);
    }
}

function test_ball_triangle() // debug
{
    gs.numbObj = 11;
    for (let i = 0; i < gs.numbObj; i++)
        gs.objs[i].touched = 3;

    // demonstrate ball-triangle collision
    locate(0,1,2, false); gs.objs[0].x -= 70;
    locate(1,1,3, true);

    locate(3,2,2, false); gs.objs[3].x += 70;
    locate(4,2,3, true);

    locate(6,3,0, false);
    locate(7,3,1, true);

    locate(9,4,0, false);
    locate(10,4,1, true);
}

function test_ball_hex() // debug
{
    gs.numbObj = 30;
    for (let i = 0; i < gs.numbObj; i++)
        gs.objs[i].touched = 3;

    // demonstrate ball-triangle collision
    locate(0,1,0, false); gs.objs[0].x -= 80;
    locate(2,1,1, true);

    locate(3,2,0, false); gs.objs[3].x += 80;
    locate(5,2,1, true);

    locate(6,3,0, false);
    locate(8,3,1, true);

    locate(9,4,0, false); gs.objs[9].x -= 40;
    locate(11,4,1, true);

    locate(12,5,0, false); gs.objs[12].x += 40;
    locate(14,5,1, true);

    locate(15,1,3, true); gs.objs[15].x -= 80;
    locate(17,1,2, false);

    locate(18,2,3, true); gs.objs[18].x += 80
    locate(20,2,2, false);

    locate(21,3,3, true);
    locate(23,3,2, false);

    locate(24,4,3, true); gs.objs[24].x -= 40;
    locate(26,4,2, false);

    locate(27,5,3, true); gs.objs[27].x += 40;
    locate(29,5,2, false);

}

function test_hex_hex() // debug
{
    gs.numbObj = 30;
    for (let i = 0; i < gs.numbObj; i++)
        gs.objs[i].touched = 3;

    // demonstrate ball-triangle collision
    locate(2,1,0, false); gs.objs[2].x -= 80;
    locate(5,1,1, true);

    locate(8,2,0, false); gs.objs[8].x += 80;
    locate(11,2,1, true);

    locate(14,3,0, false);
    locate(17,3,1, true);

    locate(20,4,0, false); gs.objs[20].x -= 50;
    locate(23,4,1, true);

    locate(26,5,0, false); gs.objs[26].x += 50;
    locate(29,5,1, true);
}

function test_triangle_triangle() // debug
{
    gs.numbObj = 17;
    for (let i = 0; i < gs.numbObj; i++)
        gs.objs[i].touched = 3;

    // demonstrate ball-triangle collision
    locate(1,1,0, false); gs.objs[1].x -= 60;
    locate(4,1,1, true);

    locate(7,2,0, false); gs.objs[7].x += 60;
    locate(10,2,1, true);

    locate(13,3,0, false);
    locate(16,3,1, true);
}

function locate(f_n, f_x_offs, f_y_offs, is_up)
{
    gs.objs[f_n].x = 110 + 200 * f_x_offs;
    gs.objs[f_n].y = 110 + 150 * f_y_offs;
    gs.objs[f_n].vy = (is_up?-1:1) * 0.2;
    gs.objs[f_n].touched = 0;
    gs.objs[f_n].vx = 0;
}

function test_collision_demonstrate()
{
    //test_ball_triangle();
    //test_ball_hex();
    //test_hex_hex();
    test_triangle_triangle()
}


setup();

test_collision_demonstrate();
run();
