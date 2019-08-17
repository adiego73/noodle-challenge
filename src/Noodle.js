class Noodle {
    constructor(x, y, length, width = 6, color = "white"){
        this.x = x;
        this.y = y;
        this.linewidth = width;
        this.angle = 0;
        this.color = color;
        // this.center = {'x': x, 'y': y};
        this.arcs = [];

        let i = 0,
            _radius = 0,
            _length = length,
            arcLength,
            start,
            end,
            radius,
            amountOfArcs,
            integerAmountOfArcs,
            decimalAmountOfArcs;

        do{
            // select a random radius
            radius = _.random(MIN_BEND_RADIUS, 4 * MIN_BEND_RADIUS, true);
            // calculate the amount of complete arcs
            amountOfArcs = (_length / radius) / PI;
            integerAmountOfArcs = Math.floor(amountOfArcs);
            decimalAmountOfArcs = amountOfArcs % 1;

            // setup the x position of the arc. the y coordinate stays the same.
            x += radius + _radius + this.linewidth;
            // define the end angle:
            //  - if the amount of complete arcs is > 0, the arc should end on 0 or PI
            //  - if we have to build a less-than-a-half arc, it should end on PI or -PI
            end = (integerAmountOfArcs > 0) ? (i % 2 === 1 ? PI : 0) : PI * (i % 2 === 1 ? 1 : -1);
            // define the start angle:
            //  - if the amount of complete arcs is > 0, the arc should start on 0 or -PI
            //  - if we have to build a less-than-a-half arc, it should start on < (+/-) PI
            //      ==> if we need to build a half arc (0.5 * PI = 90 deg.), we should start on 90deg and end on 180
            start = ((integerAmountOfArcs > 0) ? (i % 2 === 1 ? 0 : -PI) : ((decimalAmountOfArcs * PI - PI) * ((i % 2 === 1) ? -1 : 1)));

            // create the arc and add it to the arcs array
            let arc = new Arc(x, y, radius, start, end);
            this.arcs.push(arc);

            // calculate and subtract the new length
            arcLength = radius * (end - start);
            _length -= (arcLength < 0 ? -1 : 1) * arcLength;
            _radius = radius;

            i++;
        } while(_length > 0.01);

        // find the center of the figure
        this.translate = {
            x: this.x,
            y: this.y
        };

        this.box = {
            width: (this.arcs[this.arcs.length - 1].x - this.arcs[0].x),
            height: (this.arcs[this.arcs.length - 1].y - this.arcs[0].y)
        };

        this.x = (this.arcs[0].x + this.arcs[this.arcs.length - 1].x) / 2;
        this.y = (this.arcs[0].y + this.arcs[this.arcs.length - 1].y) / 2;

        this.moveTo(0, 0);
    }

    moveTo(x, y){
        let x_diff = x - this.x;
        let y_diff = y - this.y;

        this.arcs.forEach(a => {
            let x_ = a.x + x_diff;
            let y_ = a.y + y_diff;
            // apply transformation for each arc
            a.moveTo(x_, y_);
        });
    }

    translateTo(x, y){
        this.translate.x = x;
        this.translate.y = y;
    }

    rotate(angle){
        this.angle = angle;
    }

    draw(context){
        context.translate(this.translate.x, this.translate.y);
        context.rotate(this.angle);

        this.arcs.forEach(a => {
            let cw = a.ea < a.sa;
            context.lineCap = "butt";

            // fill in with a color
            context.beginPath();
            context.arc(a.x, a.y, a.radius + (this.linewidth / 2), a.sa, a.ea, cw);
            context.lineWidth = this.linewidth;
            context.strokeStyle = this.color;
            context.stroke();

            // outer border
            context.beginPath();
            context.arc(a.x, a.y, a.radius + this.linewidth, a.sa, a.ea, cw);
            context.lineWidth = 1;
            context.strokeStyle = "black";
            context.stroke();

            // inner border
            context.beginPath();
            context.arc(a.x, a.y, a.radius, a.sa, a.ea, cw);
            context.lineWidth = 1;
            context.strokeStyle = "black";
            context.stroke();
        });

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.restore();
    }

}