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

            if(this instanceof Ball && obj instanceof Ball)
            {
                let a0x = obj.x, a0y = obj.y, a2x = this.x, a2y = this.y, r1 = obj.k, r2 = this.k, a1vx = obj.vx, a1vy = obj.vy, a2vx = this.vx, a2vy = this.vy;
                this.intersected_by_angle(a0x, a0y, a2x, a2y, r1, r2, a2vx, a2vy);
                obj.intersected_by_angle(a2x, a2y, a0x, a0y, r2, r1, a1vx, a1vy);
            }
            else
            {
                this.intersected(this_vx_sign, this_vy_sign);
                obj.intersected(-this_vx_sign, -this_vy_sign);
            }
        }
    }

    intersected_by_angle(a0x, a0y, a2x, a2y, r1, r2, a2vx, a2vy)
    {
        // find A0A2
        let a0a2 = {};
        a0a2.par_a = a0y - a2y;
        a0a2.par_b = a2x - a0x;
        a0a2.par_c = a0x * a2y - a2x * a0y;

        // find a4
        let a4 = {};
        if(a0x < a2x)
            a4.x = a2x + 15//r2/2;
        else
            a4.x = a2x - 15//r2/2;
        if(a0a2.par_b == 0) // balls under each other 90 deg
            a4.y = a0y;
        else
            a4.y = (- a0a2.par_c - a0a2.par_a * a4.x) / a0a2.par_b;

        // find vectors
        let a1 = {x: a2x - a2vx, y: a2y - a2vy};
        let a1a2vec = {x: a2x - a1.x, y: a2y - a1.y};
        if(a1a2vec.x == 0)
            a1a2vec.x = a1a2vec.x + 0.01;
        if(a1a2vec.y == 0)
            a1a2vec.y = a1a2vec.y + 0.01;

        let a2a4vec = {x: a4.x - a2x, y: a4.y - a2y};
        let phi = (a1a2vec.x * a2a4vec.x + a1a2vec.y * a2a4vec.y)/(Math.sqrt(a1a2vec.x * a1a2vec.x + a1a2vec.y * a1a2vec.y)*Math.sqrt(a2a4vec.x * a2a4vec.x + a2a4vec.y * a2a4vec.y))
        if(isNaN(phi))
        {
            console.log("phi is NAN")
        }

        // find a3
        let a3 = {};
        a3.x = a2x + (a4.x - a2x) * Math.cos(phi) - (a4.y - a2y) * Math.sin(phi);
        a3.y = a2y + (a4.x - a2x) * Math.sin(phi) + (a4.y - a2y) * Math.cos(phi);

        let a2a3vect = {x: a3.x - a2x, y: a3.y - a2y};
        let max_a2a3vect = Math.max(Math.abs(a2a3vect.x), Math.abs(a2a3vect.y));
        a2a3vect.x = a2a3vect.x / max_a2a3vect;
        a2a3vect.y = a2a3vect.y / max_a2a3vect;

        let old_speed = Math.sqrt(a2vx * a2vx + a2vy * a2vy);
        let new_speed = Math.sqrt(a3.x * a3.x + a3.y * a3.y);

        this.vx = a2a3vect.x// * old_speed * 0.5;
        this.vy = a2a3vect.y// * old_speed * 0.5;

        this.touched += 1;
        this.move();
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