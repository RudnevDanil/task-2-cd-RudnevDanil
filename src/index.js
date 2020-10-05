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

function test_state() // debug
{
    gs.numbObj = 15;
    for (let i = 0; i < gs.numbObj; i++)
    {
        gs.objs[i].x = 10;
        gs.objs[i].vx = 0;
        gs.objs[i].y = 110;
        gs.objs[i].vy = 0;
    }

    // demonstrate ball-triangle collision
    gs.objs[0].x = 110 + 200 * 1 - 70;
    gs.objs[0].y = 110 + 200 * 0;
    gs.objs[0].vy = 0.2;
    gs.objs[1].x = 110 + 200 * 1;
    gs.objs[1].y = 110 + 200 * 1;
    gs.objs[1].vy = -0.2;

    gs.objs[3].x = 110 + 200 * 2 + 70;
    gs.objs[3].y = 110 + 200 * 0;
    gs.objs[3].vy = 0.2;
    gs.objs[4].x = 110 + 200 * 2;
    gs.objs[4].y = 110 + 200 * 1;
    gs.objs[4].vy = -0.2;

    gs.objs[6].x = 110 + 200 * 3;
    gs.objs[6].y = 110 + 200 * 0;
    gs.objs[6].vy = 0.2;
    gs.objs[7].x = 110 + 200 * 3;
    gs.objs[7].y = 110 + 200 * 1;
    gs.objs[7].vy = -0.2;

    gs.objs[9].x = 110 + 200 * 4;
    gs.objs[9].y = 110 + 200 * 1;
    gs.objs[9].vy = -0.2;
    gs.objs[10].x = 110 + 200 * 4;
    gs.objs[10].y = 110 + 200 * 0;
    gs.objs[10].vy = 0.2;


    /*let which_obj_to_move = 4;
    let under_which_to_locate = 0;


    gs.objs[which_obj_to_move].x = 110 + under_which_to_locate * 200 + 70;
    gs.objs[which_obj_to_move].y = gs.objs[which_obj_to_move].y + 200;
    gs.objs[which_obj_to_move].vy *= -0.3;*/
}

function test_ball_triangle_collision()
{

}


setup();

test_state();
run();
