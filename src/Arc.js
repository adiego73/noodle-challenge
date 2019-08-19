class Arc {
    constructor(x, y, radius, startAngle, endAngle, cw = false){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.sa = startAngle;
        this.ea = endAngle;
        this.cw = cw;
    }

    moveTo(x, y){
        this.x = x;
        this.y = y;
    }

    rotate(angle){
        this.sa += angle;
        this.ea += angle;
    }
}