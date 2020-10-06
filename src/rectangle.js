import Triangle from "./triangle";
import Ball from "./ball";
import Hex from "./hex";
import Point from "./Point";

export default class Rectangle{
    constructor(x, y, w, h,color = "none",vx = 0,vy = 0,collisionCount= 0) {
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy
        this.collisionCount = collisionCount
        this.color = color
        this.w = w
        this.h = h
    }


    draw(context){
        context.beginPath();
        context.rect(this.x, this.y, this.w, this.h);
        context.fillStyle = this.color;
        context.shadowColor = this.color;
        context.shadowBlur = 10;
        context.fill();
        context.closePath();
    }



    get left() {
        return this.x
    }

    get right() {
        return this.x + this.w
    }

    get top() {
        return this.y
    }

    get bottom() {
        return this.y + this.h
    }

    contains(point)
    {
        return (point.x >= this.x &&
            point.x < this.x + this.w &&
            point.y >= this.y &&
            point.y < this.y + this.h)
    }

    center() {
        return new Point(this.x + this.w/2,this.y+this.h/2,this)
    }


    intersects(fig)
    {
        if(fig instanceof Rectangle)
        {
            return  (this.x < fig.x + fig.w)
                && (fig.x < this.x + this.w)
                && (this.y < fig.y + fig.h)
                && (fig.y < this.y + this.w)
        }
        else if (fig instanceof Ball)
        {
            let box_x_c = this.x + this.w / 2;
            let box_y_c = this.y + this.h / 2;;
            let box_r = Math.sqrt(box_x_c * box_x_c + box_y_c * box_y_c)
            if(Math.sqrt((fig.x - box_x_c)*(fig.x - box_x_c)+(fig.y - box_y_c)*(fig.y - box_y_c)) < box_r + fig.k)
                return true;
            return false;
        }
        else if(fig instanceof Triangle)
        {
            let box_x_c = this.x + this.w / 2;
            let box_y_c = this.y + this.h / 2;
            let fig_y_c = fig.y + fig.p4;
            let box_r = Math.sqrt(box_x_c * box_x_c + box_y_c * box_y_c)
            if(Math.sqrt((fig.x - box_x_c)*(fig.x - box_x_c)+(fig_y_c - box_y_c)*(fig_y_c - box_y_c)) <= box_r + fig.p3)
                return true;
            return false;
        }
        else if(fig instanceof Hex)
        {
            let box_x_c = this.x + this.w / 2;
            let box_y_c = this.y + this.h / 2;
            let box_r = Math.sqrt(box_x_c * box_x_c + box_y_c * box_y_c)
            if(Math.sqrt((fig.x - box_x_c)*(fig.x - box_x_c)+(fig.y - box_y_c)*(fig.y - box_y_c)) < box_r + fig.k)
                return true;
            return false;
        }
    }
}