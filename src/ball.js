import Triangle from "./triangle";
import Hex from "./hex";

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

    /*get left()
    {
        return this.k
    }

    get right()
    {
        return this.k
    }

    get top()
    {
        return this.k
    }

    get bottom()
    {
        return this.k
    }

    contains(point)
    {
        return (   point.x >= this.x - this.k
                && point.x <= this.x + this.k
                && point.y >= this.y - this.k
                && point.y <= this.y + this.k);
    }*/

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
                if(dist < this.k + obj.p3 / 2) {
                    is_intersected = true; // ball touches inside radius
                    //console.log("d = ", dist, " this.k = ", this.k, "r_ins = ", obj.p3 / 2);
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
                    let byf1 = (A_line * this.x + B_line * this.y + C_line) / (Math.sqrt(A_line * A_line + B_line * B_line));
                    if (byf1 > -this.k) {
                        // line B --- C

                        A_line = b_y - c_y;
                        B_line = c_x - b_x;
                        C_line = b_x * c_y - c_x * b_y;
                        let byf2 = (A_line * this.x + B_line * this.y + C_line) / (Math.sqrt(A_line * A_line + B_line * B_line));
                        if (byf2 > -this.k) {
                            // line C --- A

                            A_line = c_y - a_y;
                            B_line = a_x - c_x;
                            C_line = c_x * a_y - a_x * c_y;

                            let byf3 = (A_line * this.x + B_line * this.y + C_line) / (Math.sqrt(A_line * A_line + B_line * B_line));
                            //console.log("byf1 = ", byf1, "  byf2 = ", byf2, "  byf3 = ", byf3, "  this.k = ", this.k);
                            if (byf3 > -this.k)
                            {
                                let min_dist = this.k + obj.p1 * 2;
                                if (Math.abs(byf1) < min_dist && Math.abs(byf2) < min_dist && Math.abs(byf3) < min_dist) {
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
                if(dist < this.k + obj.p3)
                    is_intersected = true; // ball touches inside radius
                /*else
                {
                    let a_x = obj.x - obj.p2;
                    let a_y = obj.y + obj.p1;
                    let b_x = obj.x - obj.k;
                    let b_y = obj.y;
                    // line A --- B
                    let A_line = a_y - b_y;
                    let B_line = b_x - a_x;
                    let C_line = a_x * b_y - b_x * a_y;
                    if ((A_line * this.x + B_line * this.y + C_line) / (Math.sqrt(A_line * A_line + B_line * B_line)) < this.k)
                    {
                        let c_x = obj.x - obj.p2;
                        let c_y = obj.y - obj.p1;
                        // line B --- C
                        A_line = b_y - c_y;
                        B_line = c_x - b_x;
                        C_line = b_x * c_y - c_x * b_y;
                        if ((A_line * this.x + B_line * this.y + C_line) / (Math.sqrt(A_line * A_line + B_line * B_line)) < this.k)
                        {
                            let d_x = obj.x + obj.p2;
                            let d_y = obj.y - obj.p1;
                            // line C --- D
                            A_line = c_y - d_y;
                            B_line = d_x - c_x;
                            C_line = c_x * d_y - d_x * c_y;
                            if ((A_line * this.x + B_line * this.y + C_line) / (Math.sqrt(A_line * A_line + B_line * B_line)) < this.k)
                            {
                                let e_x = obj.x + obj.k;
                                let e_y = obj.y;
                                // line D --- E
                                A_line = d_y - e_y;
                                B_line = e_x - d_x;
                                C_line = d_x * e_y - e_x * d_y;
                                if ((A_line * this.x + B_line * this.y + C_line) / (Math.sqrt(A_line * A_line + B_line * B_line)) < this.k)
                                {
                                    // line E --- F
                                    A_line = e_y - f_y;
                                    B_line = f_x - e_x;
                                    C_line = e_x * f_y - f_x * e_y;
                                    if ((A_line * this.x + B_line * this.y + C_line) / (Math.sqrt(A_line * A_line + B_line * B_line)) < this.k)
                                    {
                                        let f_x = obj.x + obj.p2;
                                        let f_y = obj.y + obj.p1;
                                        // line F --- A
                                        A_line = f_y - a_y;
                                        B_line = a_x - f_x;
                                        C_line = f_x * a_y - a_x * f_y;
                                        if ((A_line * this.x + B_line * this.y + C_line) / (Math.sqrt(A_line * A_line + B_line * B_line)) < this.k)
                                        {
                                            is_intersected = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }*/
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