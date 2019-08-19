class Noodle {
    constructor(x, y, length, minRadius, maxRadius, width = 6, color = "white") {
        this.x = x;
        this.y = y;
        this.linewidth = width;
        this.angle = 0;
        this.color = color;
        this.arcs = [];
        this.maxRadius = maxRadius;
        this.minRadius = minRadius;
        this.length = length;
    }

    createInside(context, Bowl) {
        let i = 0,
            _radius = 0,
            radius = 0,
            pos = {x: 0, y: 0},
            angle,
            start,
            end;

        let points = [];
        for (let i = 0; i < _.random(3, 5, false); i++) {
            if (i === 0) {
                pos = Utils.getRandomPosition(Bowl);
                // select a random radius
                radius = _.random(this.minRadius, this.maxRadius, true);
                angle = 0;
            } else {
                _radius = _.random(this.minRadius, this.maxRadius, true);
                // find a random point over the circumference of the previous circle,
                // and move it away a 'radius' distance.
                angle = _.random(0.25, 0.75, true) * TWO_PI;
                let _pos = {
                    x: radius * Math.cos(angle) + pos.x,
                    y: radius * Math.sin(angle) + pos.y
                };

                _pos.x += Math.cos(angle) * (_radius + this.linewidth);
                _pos.y += Math.sin(angle) * (_radius + this.linewidth);

                pos = _pos;
                radius = _radius;
            }

            points.push({pos: pos, radius: radius, angle: angle});
        }

        while (i < points.length) {
            let point = points[i];
            radius = point.radius;

            start = (i === 0 ? 0 : (i % 2 === 0 ? PI - point.angle : PI + point.angle)) * (i % 2 === 0 ? -1 : 1);
            end = (i < points.length - 1 ? points[i + 1].angle : PI);

            // create the arc and add it to the arcs array
            let arc = new Arc(point.pos.x, point.pos.y, radius, start, end, i % 2 === 1);
            this.arcs.push(arc);

            i++;
        }

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

    moveTo(x, y) {
        let x_diff = x - this.x;
        let y_diff = y - this.y;

        this.arcs.forEach(a => {
            let x_ = a.x + x_diff;
            let y_ = a.y + y_diff;
            // apply transformation for each arc
            a.moveTo(x_, y_);
        });
    }

    translateTo(x, y) {
        this.translate.x = x;
        this.translate.y = y;
    }

    rotate(angle) {
        this.angle = angle;
    }

    draw(context) {
        context.translate(this.translate.x, this.translate.y);
        context.rotate(this.angle);

        this.arcs.forEach(a => {
            context.lineCap = "butt";

            // fill in with a color
            context.beginPath();
            context.arc(a.x, a.y, a.radius + (this.linewidth / 2), a.sa, a.ea, a.cw);
            context.lineWidth = this.linewidth;
            context.strokeStyle = this.color;
            context.stroke();

            // outer border
            context.beginPath();
            context.arc(a.x, a.y, a.radius + this.linewidth, a.sa, a.ea, a.cw);
            context.lineWidth = 1;
            context.strokeStyle = "black";
            context.stroke();

            // inner border
            context.beginPath();
            context.arc(a.x, a.y, a.radius, a.sa, a.ea, a.cw);
            context.lineWidth = 1;
            context.strokeStyle = "black";
            context.stroke();
        });

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.restore();
    }

}