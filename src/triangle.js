import Ball from "./ball";
import Hex from "./hex";


export default class Triangle
{
    constructor(x, y, k, base_obj_speed, canv_w, canv_h)
    {
        this.x = x;
        this.y = y;
        this.k = k;
        this.p1 = 0.433 * k; // 1/2 height
        this.p2 = 0.5 * k; // 1/2 side
        this.p3 = 0.577 * k; // radius of the outside circle
        this.p4 = this.p1 * 0.3333; // offset from y to center or circles
        this.touched = 0;
        this.clr = ["green", "yellow", "red"];
        this.vx = (Math.random() - 0.5) * base_obj_speed;
        this.vy = (Math.random() - 0.5) * base_obj_speed;
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
        if(this.x < this.p2) // left wall
            this.vx *= -1;
        else if (this.y < this.p1) // top wall
            this.vy *= -1;
        else if (this.x + this.p2 > this.canv_w) // right wall
            this.vx *= -1;
        else if (this.y + this.p1 > this.canv_h) // bottom wall
            this.vy *= -1;
    }

    check_intersects(obj)
    {
        if(this.touched >= 3 || obj.touched >= 3)
            return;

        let is_intersected = false;
        if (obj instanceof Ball)
        {
            obj.check_intersects(this);
            return;
        }
        else if (obj instanceof Triangle)
        {

        }
        else if (obj instanceof Hex)
        {

        }
        if(is_intersected)
        {
            let this_vx_sign = 1;
            let this_vy_sign = 1;
            if(this.x < obj.x)
                this_vx_sign = -1;
            if(this.y < obj.y)
                this_vy_sign = -1;
            this.intersected(this_vx_sign, this_vy_sign);
            obj.intersected(-this_vx_sign, -this_vy_sign);
        }
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
            cnt.lineTo(this.x, this.y - this.p1);
            cnt.lineTo(this.x + this.p2, this.y + this.p1);
            cnt.lineTo(this.x - this.p2, this.y + this.p1);
            cnt.fillStyle = this.clr[this.touched];
            cnt.fill();
            cnt.closePath();
        }
    }
}