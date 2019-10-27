class Noodle {
    constructor(x, y, length, minRadius, width = 6, color = "white") {
        this.x = x;
        this.y = y;
        this.linewidth = width;
        this.angle = 0;
        this.color = color;
        this.arcs = [];

        let i = 0,
            _radius = 0,
            radius = 0,
            pos = {x: 0, y: 0},
            maxRadius = 4 * minRadius,
            angle,
            start,
            end;

        let points = [];
        // in the worst case I would need maxQtyPoints to build the noodle.
        let maxQtyPoints = Math.ceil((length / minRadius) / HALF_PI);
        // we define the points in the following way:
        // - first, an imaginary circle centered at (0;0) with random radius
        // - then, an imaginary circle centered in a point near the previous circle, with
        //   a radius that makes it touch the previous circle, and a random angle.
        for (let i = 0; i < maxQtyPoints; i++) {
            // get a random radius
            _radius = _.random(minRadius, maxRadius, true);

            // first arc
            if (i === 0) {
                pos = {x: 0, y: 0};
                radius = _radius;
                angle = 0;
            } else {
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

            let p = {pos: pos, radius: radius, angle: angle};
            points.push(p);
        }

        // we build the noodle based on the defined points and the length.
        let remainingLength = length;
        while (remainingLength > 0) {
            let point = points[i];
            radius = point.radius;

            // if the point is the first one, it should start at 0 deg;
            // if it is an odd arc, it should start at 180 + arcAngle;
            // if it is an even arc, it should start at 180 - arcAngle.
            start = (i === 0 ? 0 : (i % 2 === 0 ? PI - point.angle : PI + point.angle)) * (i % 2 === 0 ? -1 : 1);

            // if it is not the last arc in the noodle, it should end at the next arc start angle
            // if it is the last arc, I set the end angle as PI
            end = (i < points.length - 1 ? points[i + 1].angle : PI);

            // create the arc and add it to the arcs array
            let arc = new Arc(point.pos.x, point.pos.y, radius, start, end, i % 2 === 1);

            remainingLength -= arc.length();
            // if the remaining length is less than 0, we have to update the last arc because
            // this means that it is greater than the length
            if (remainingLength < 0) {
                arc.ea = (((arc.length() + remainingLength) / radius) + start);
            }

            // this.length += arc.length();
            this.arcs.push(arc);
            i++;
        }

        // set the noodle coordinates
        this.translate = {
            x: this.x,
            y: this.y
        };

        // find the center of the figure
        this.box = this.getBoundingBox();
        this.x = this.box.centroid.x;
        this.y = this.box.centroid.y;

        // move all the arcs w.r.t the (0;0) coordinate
        this.moveTo(0, 0);
    }

    getBoundingBox() {
        // define the bounding box of the noodle. This is needed to translate the noodle into the bowl.
        let left = Infinity, right = -Infinity,
            top = -Infinity, bottom = Infinity;

        this.arcs.forEach(a => {
            top = Math.max(a.y + this.linewidth + a.radius, top);
            left = Math.min(a.x - this.linewidth - a.radius, left);
            right = Math.max(a.x + this.linewidth + a.radius, right);
            bottom = Math.min(a.y - this.linewidth - a.radius, bottom);
        });

        return {
            top: top,
            bottom: bottom,
            right: right,
            left: left,
            width: right - left,
            height: top - bottom,
            centroid: {
                x: (right + left) / 2,
                y: (top + bottom) / 2
            }
        }
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