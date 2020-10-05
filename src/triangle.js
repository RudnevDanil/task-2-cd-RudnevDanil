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
        this.p5 = this.p1 * 2; // height
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
            obj.check_intersects(this);
            return;
        }
        else if (obj instanceof Triangle)
        {
            let dist = Math.sqrt((obj.x - this.x)*(obj.x - this.x)+(obj.y + obj.p4 - this.y - this.p4)*(obj.y + obj.p4 - this.y - this.p4));
            if(dist < this.p3 + obj.p3) // ball touches outside radius
            {
                if (dist < (this.p3 + obj.p3) / 2)
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
                    let AB_A = a_y - b_y;
                    let AB_B = b_x - a_x;
                    let AB_C = a_x * b_y - b_x * a_y;
                    // line B --- C
                    let BC_A  = b_y - c_y;
                    let BC_B  = c_x - b_x;
                    let BC_C  = b_x * c_y - c_x * b_y;
                    // line C --- A
                    let CA_A  = c_y - a_y;
                    let CA_B  = a_x - c_x;
                    let CA_C  = c_x * a_y - a_x * c_y;

                    let a_x_t = this.x - this.p2;
                    let a_y_t = this.y + this.p1;
                    let b_x_t = this.x;
                    let b_y_t = this.y - this.p1;
                    let c_x_t= this.x + this.p2;
                    let c_y_t = this.y + this.p1;

                    let dlp_1 = this._dist_lp(AB_A,AB_B,AB_C, a_x_t,a_y_t);
                    let dlp_2 = this._dist_lp(BC_A,BC_B,BC_C, a_x_t,a_y_t);
                    let dlp_3 = this._dist_lp(CA_A,CA_B,CA_C, a_x_t,a_y_t);
                    if(dlp_1 > 0 && dlp_2 > 0 && dlp_3 > 0)
                    {
                        is_intersected = true;
                    }
                    else
                    {
                        dlp_1 = this._dist_lp(AB_A,AB_B,AB_C, c_x_t,c_y_t);
                        dlp_2 = this._dist_lp(BC_A,BC_B,BC_C, c_x_t,c_y_t);
                        dlp_3 = this._dist_lp(CA_A,CA_B,CA_C, c_x_t,c_y_t);
                        if(dlp_1 > 0 && dlp_2 > 0 && dlp_3 > 0)
                        {
                            is_intersected = true;
                        }
                        else
                        {
                            // line A --- B
                            let AB_A_2 = a_y_t - b_y_t;
                            let AB_B_2 = b_x_t - a_x_t;
                            let AB_C_2 = a_x_t * b_y_t - b_x_t * a_y_t;
                            dlp_1 = this._dist_lp(AB_A_2,AB_B_2,AB_C_2, b_x,b_y);

                            if(dlp_1 > 0)
                            {
                                // line B --- C
                                let BC_A_2  = b_y_t - c_y_t;
                                let BC_B_2  = c_x_t - b_x_t;
                                let BC_C_2  = b_x_t * c_y_t - c_x_t * b_y_t;
                                dlp_2 = this._dist_lp(BC_A_2,BC_B_2,BC_C_2, b_x,b_y);
                                if(dlp_2 > 0)
                                {
                                    // line C --- A
                                    let CA_A_2  = c_y_t - a_y_t;
                                    let CA_B_2  = a_x_t - c_x_t;
                                    let CA_C_2  = c_x_t * a_y_t - a_x_t * c_y_t;
                                    dlp_3 = this._dist_lp(CA_A_2,CA_B_2,CA_C_2, b_x,b_y);
                                    if(dlp_3 > 0)
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