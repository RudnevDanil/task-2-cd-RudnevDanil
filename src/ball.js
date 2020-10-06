import Triangle from "./triangle";
import Hex from "./hex";
import Point from "./Point";

export default class Ball
{
    constructor(x, y, k, base_obj_speed, canv_w, canv_h)
    {
        this.x = x;
        this.y = y;
        this.k = k;
        this.touched = 0;
        this.clr = ["green", "yellow", "red"];
        this.vx = (Math.random()-0.5) * base_obj_speed;
        this.vy = (Math.random()-0.5) * base_obj_speed;
        this.canv_w = canv_w;
        this.canv_h = canv_h;
    }

    center()
    {
        return new Point(this.x,this.y,this)
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
        else if (this.y < this.k) // top wall
            this.vy *= -1;
        else if (this.x + this.k > this.canv_w) // right wall
            this.vx *= -1;
        else if (this.y + this.k > this.canv_h) // bottom wall
            this.vy *= -1;
    }

    _dist_lp(A,B,C,x,y)
    {
        return (A * x + B * y + C) / Math.sqrt(A * A + B * B);
    }

    check_intersects(obj)
    {
        if(this.touched >= 3 || obj.touched >= 3)
            return;

        let is_intersected = false;
        if (obj instanceof Ball)
        {

            if(Math.sqrt((obj.x - this.x)*(obj.x - this.x)+(obj.y - this.y)*(obj.y - this.y)) < this.k + obj.k)
            {
                is_intersected = true;
            }
        }
        else if (obj instanceof Triangle)
        {
            let dist = Math.sqrt((obj.x - this.x)*(obj.x - this.x)+(obj.y + obj.p4 - this.y)*(obj.y + obj.p4 - this.y));
            if(dist < this.k + obj.p3) // ball touches outside radius
            {
                if(dist < this.k + obj.p3 / 2)
                {
                    is_intersected = true; // ball touches inside radius
                }
                else
                {
                    let a_x = obj.x - obj.p2;
                    let a_y = obj.y + obj.p1;
                    let b_x = obj.x;
                    let b_y = obj.y - obj.p1;
                    let c_x = obj.x + obj.p2;
                    let c_y = obj.y + obj.p1;

                    // line A --- B
                    let A_line = a_y - b_y;
                    let B_line = b_x - a_x;
                    let C_line = a_x * b_y - b_x * a_y;
                    let byf1 = this._dist_lp(A_line, B_line, C_line, this.x, this.y);
                    if (byf1 > -this.k)
                    {
                        // line B --- C
                        A_line = b_y - c_y;
                        B_line = c_x - b_x;
                        C_line = b_x * c_y - c_x * b_y;
                        let byf2 = this._dist_lp(A_line, B_line, C_line, this.x, this.y);
                        if (byf2 > -this.k) {
                            // line C --- A
                            A_line = c_y - a_y;
                            B_line = a_x - c_x;
                            C_line = c_x * a_y - a_x * c_y;
                            let byf3 = this._dist_lp(A_line, B_line, C_line, this.x, this.y);
                            if (byf3 > -this.k)
                            {
                                let max_touch_dist = this.k + obj.p1 * 2;
                                if (Math.abs(byf1) < max_touch_dist && Math.abs(byf2) < max_touch_dist && Math.abs(byf3) < max_touch_dist)
                                {
                                    is_intersected = true;
                                }
                            }
                        }
                    }
                }
            }
        }
        else if (obj instanceof Hex)
        {
            let dist = Math.sqrt((obj.x - this.x)*(obj.x - this.x)+(obj.y - this.y)*(obj.y - this.y));
            if(dist < this.k + obj.k) // ball touches outside radius
            {
                if(dist < this.k + obj.p1)
                    is_intersected = true; // ball touches inside radius
                else
                {
                    let a_x = obj.x - obj.p2;
                    let a_y = obj.y + obj.p1;
                    let b_x = obj.x - obj.k;
                    let b_y = obj.y;
                    // line A --- B
                    let A_line = a_y - b_y;
                    let B_line = b_x - a_x;
                    let C_line = a_x * b_y - b_x * a_y;
                    if (this._dist_lp(A_line, B_line, C_line, this.x, this.y) > -this.k)
                    {
                        let c_x = obj.x - obj.p2;
                        let c_y = obj.y - obj.p1;
                        // line B --- C
                        A_line = b_y - c_y;
                        B_line = c_x - b_x;
                        C_line = b_x * c_y - c_x * b_y;
                        if (this._dist_lp(A_line, B_line, C_line, this.x, this.y) > -this.k)
                        {
                            let d_x = obj.x + obj.p2;
                            let d_y = obj.y - obj.p1;
                            // line C --- D
                            A_line = c_y - d_y;
                            B_line = d_x - c_x;
                            C_line = c_x * d_y - d_x * c_y;
                            if (this._dist_lp(A_line, B_line, C_line, this.x, this.y) > -this.k)
                            {
                                let e_x = obj.x + obj.k;
                                let e_y = obj.y;
                                // line D --- E
                                A_line = d_y - e_y;
                                B_line = e_x - d_x;
                                C_line = d_x * e_y - e_x * d_y;
                                if (this._dist_lp(A_line, B_line, C_line, this.x, this.y) > -this.k)
                                {
                                    let f_x = obj.x + obj.p2;
                                    let f_y = obj.y + obj.p1;
                                    // line E --- F
                                    A_line = e_y - f_y;
                                    B_line = f_x - e_x;
                                    C_line = e_x * f_y - f_x * e_y;
                                    if (this._dist_lp(A_line, B_line, C_line, this.x, this.y) > -this.k)
                                    {
                                        // line F --- A
                                        A_line = f_y - a_y;
                                        B_line = a_x - f_x;
                                        C_line = f_x * a_y - a_x * f_y;
                                        if (this._dist_lp(A_line, B_line, C_line, this.x, this.y) > -this.k)
                                        {
                                            is_intersected = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
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
        // отражение без учета специфики объектов
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
            cnt.arc(this.x, this.y, this.k, 0, 2 * Math.PI);
            cnt.fillStyle = this.clr[this.touched];
            cnt.fill();
            cnt.closePath();
        }
    }
}