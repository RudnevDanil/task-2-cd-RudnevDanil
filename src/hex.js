import Ball from "./ball";
import Triangle from "./triangle";

export default class Hex
{
    constructor(x, y, k, base_obj_speed, canv_w, canv_h)
    {
        this.x = x;
        this.y = y;
        this.k = k;
        this.p1 = 0.866 * k;  // 1/2 height
        this.p2 = 0.5 * k;// 1/2 side
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

        }
        else if (obj instanceof Hex)
        {
            let dist = Math.sqrt((obj.x - this.x)*(obj.x - this.x)+(obj.y - this.y)*(obj.y - this.y));
            if(dist < this.k + obj.k) // ball touches outside radius
            {
                if (dist < this.p1 + obj.p1)
                {

                    is_intersected = true; // ball touches inside radius
                }
                else
                {
                    // obj points
                    let a_x = obj.x - obj.p2;
                    let a_y = obj.y + obj.p1;
                    let b_x = obj.x - obj.k;
                    let b_y = obj.y;
                    let c_x = obj.x - obj.p2;
                    let c_y = obj.y - obj.p1;
                    let d_x = obj.x + obj.p2;
                    let d_y = obj.y - obj.p1;
                    let e_x = obj.x + obj.k;
                    let e_y = obj.y;
                    let f_x = obj.x + obj.p2;
                    let f_y = obj.y + obj.p1;

                    // line A --- B
                    let AB_A = a_y - b_y;
                    let AB_B = b_x - a_x;
                    let AB_C = a_x * b_y - b_x * a_y;
                    // line B --- C
                    let BC_A = b_y - c_y;
                    let BC_B = c_x - b_x;
                    let BC_C = b_x * c_y - c_x * b_y;
                    // line C --- D
                    let CD_A = c_y - d_y;
                    let CD_B = d_x - c_x;
                    let CD_C = c_x * d_y - d_x * c_y;
                    // line D --- E
                    let DE_A = d_y - e_y;
                    let DE_B = e_x - d_x;
                    let DE_C = d_x * e_y - e_x * d_y;
                    // line E --- F
                    let EF_A = e_y - f_y;
                    let EF_B = f_x - e_x;
                    let EF_C = e_x * f_y - f_x * e_y;
                    // line F --- A
                    let FA_A = f_y - a_y;
                    let FA_B = a_x - f_x;
                    let FA_C = f_x * a_y - a_x * f_y;

                    // this points
                    a_x = this.x - this.p2;
                    a_y = this.y + this.p1;
                    b_x = this.x - this.k;
                    b_y = this.y;
                    c_x = this.x - this.p2;
                    c_y = this.y - this.p1;
                    d_x = this.x + this.p2;
                    d_y = this.y - this.p1;
                    e_x = this.x + this.k;
                    e_y = this.y;
                    f_x = this.x + this.p2;
                    f_y = this.y + this.p1;

                    let dlp_1 = this._dist_lp(CD_A,CD_B,CD_C,a_x,a_y);
                    let dlp_2 = this._dist_lp(DE_A,DE_B,DE_C,a_x,a_y);
                    if(dlp_1 < this.k && dlp_1 > 0 && dlp_2 < this.k && dlp_2 > 0)
                        is_intersected = true;
                    else
                    {
                        dlp_1 = this._dist_lp(DE_A,DE_B,DE_C,b_x,b_y);
                        dlp_2 = this._dist_lp(EF_A,EF_B,EF_C,b_x,b_y);

                        if(dlp_1 < this.k && dlp_1 > 0 && dlp_2 < this.k && dlp_2 > 0)
                            is_intersected = true;
                        else
                        {
                            dlp_1 = this._dist_lp(EF_A,EF_B,EF_C,c_x,c_y);
                            dlp_2 = this._dist_lp(FA_A,FA_B,FA_C,c_x,c_y);

                            if(dlp_1 < this.k && dlp_1 > 0 && dlp_2 < this.k && dlp_2 > 0)
                                is_intersected = true;
                            else
                            {
                                dlp_1 = this._dist_lp(FA_A,FA_B,FA_C,d_x,d_y);
                                dlp_2 = this._dist_lp(AB_A,AB_B,AB_C,d_x,d_y);

                                if(dlp_1 < this.k && dlp_1 > 0 && dlp_2 < this.k && dlp_2 > 0)
                                    is_intersected = true;
                                else
                                {
                                    dlp_1 = this._dist_lp(AB_A,AB_B,AB_C,e_x,e_y);
                                    dlp_2 = this._dist_lp(BC_A,BC_B,BC_C,e_x,e_y);

                                    if(dlp_1 < this.k && dlp_1 > 0 && dlp_2 < this.k && dlp_2 > 0)
                                        is_intersected = true;
                                    else
                                    {
                                        dlp_1 = this._dist_lp(BC_A,BC_B,BC_C,f_x,f_y);
                                        dlp_2 = this._dist_lp(CD_A,CD_B,CD_C,f_x,f_y);

                                        if(dlp_1 < this.k && dlp_1 > 0 && dlp_2 < this.k && dlp_2 > 0)
                                            is_intersected = true;
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