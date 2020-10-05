export default class Hex
{
    constructor(x, y, k, base_obj_speed, canv_w, canv_h)
    {
        this.x = x;
        this.y = y;
        this.k = k;
        this.p1 = 0.866 * k;  // 1/2 height
        this.p2 = 0.5 * k;// 1/2 side
        this.p3 = 0.288675 * k; // radius of the inside circle
        this.touched = 0;
        this.clr = ["green", "yellow", "red"];
        this.vx = (Math.random()-0.5) * base_obj_speed;
        this.vy = (Math.random()-0.5) * base_obj_speed;
        this.canv_w = canv_w;
        this.canv_h = canv_h;
    }

    move()
    {
        this.x += this.vx;
        this.y += this.vy;
        this.check_wall();
    }

    check_wall()
    {
        if(this.x < this.k) // left wall
            this.vx *= -1;
        else if (this.y < this.p1) // top wall
            this.vy *= -1;
        else if (this.x + this.k > this.canv_w) // right wall
            this.vx *= -1;
        else if (this.y + this.p1 > this.canv_h) // bottom wall
            this.vy *= -1;
    }

    /*get left()
    {
        return this.x - this.k;
    }

    get right()
    {
        return this.x + this.k;
    }

    get top()
    {
        return this.y - this.p1;
    }

    get bottom()
    {
        return this.y + this.p1;
    }

    contains(point)
    {
        //return (   point.x >= this.x - this.r
            //&& point.x <= this.x + this.r
            //&& point.y >= this.y - this.r
            //&& point.y <= this.y + this.r);
    }
*/
    check_intersects(triangle)
    {
        //return ((Math.sqrt((ball.x - this.x)*(ball.x - this.x)+(ball.y - this.y)*(ball.y - this.y))) < this.r + ball.r);
    }


    intersected(vx_sign, vy_sign)
    {
        this.touched += 1;
        this.vx = Math.abs(this.vx) * vx_sign;
        this.vy = Math.abs(this.vy) * vy_sign;
        this.move(); // check_wall inside. do we need it?
    }

    draw(cnt)
    {
        if(this.touched < 3)
        {
            cnt.beginPath();
            cnt.moveTo(this.x - this.p2, this.y + this.p1);
            cnt.lineTo(this.x - this.k, this.y);
            cnt.lineTo(this.x - this.p2, this.y - this.p1);
            cnt.lineTo(this.x + this.p2, this.y - this.p1);
            cnt.lineTo(this.x + this.k, this.y);
            cnt.lineTo(this.x + this.p2, this.y + this.p1);
            cnt.lineTo(this.x - this.p2, this.y + this.p1);
            cnt.fillStyle = this.clr[this.touched];
            cnt.fill();
            cnt.closePath();
        }
    }
}