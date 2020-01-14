// canvas
let canvas;
let context;

/**
 * Bootstrap the application.
 */
function bootstrap() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
}

function main() {
    // setup
    bootstrap();

    // center the bowl at the middle of the canvas
    const x = WIDTH / 2;
    const y = HEIGHT / 2;
    // define the bowl's radius
    const radius = ((HEIGHT < WIDTH) ? HEIGHT : WIDTH) / 3;

    // amount of noodles to create
    const lineWidth = 5; // line width goes from 1 to 10
    const qtyNoodles = Utils.map(lineWidth, 10, 1, 800, 10000);

    for (let i = qtyNoodles; i > 0; i--) {
        // setup the arc length and radius
        const length = _.random(MIN_LENGTH, MAX_LENGTH, true);

        const noodle = new Noodle(x, y, length, MIN_BEND_RADIUS, lineWidth, "white");

        // the noodle should be inside a circumference defined as the bowl circumference minus the noodle radius.
        // since the noodle is centered on its centroid, there is no problem to be over the perimeter of the inner circle.
        const noodleRadius = Math.sqrt(Math.pow(noodle.box.width, 2) + Math.pow(noodle.box.height, 2)) / 2;
        const innerRadius = radius - noodleRadius + 3.2;

        // omit noodles with diagonal grater than the radius, which will be outside the bowl.
        if (innerRadius < 0) {
            continue;
        }

        const randAngle = _.random(0, innerRadius, true) * TWO_PI;
        let new_x, new_y;
        // we need to cover all the bowl, so:
        //  - get a random position inside a circumference
        // - or get a random position over a circumference
        if (_.random(0, 10) % 2) {
            new_x = (innerRadius * Math.sqrt(_.random(0, 1, true))) * Math.cos(randAngle) + x;
            new_y = (innerRadius * Math.sqrt(_.random(0, 1, true))) * Math.sin(randAngle) + y;
        } else {
            new_x = innerRadius * Math.cos(randAngle) + x;
            new_y = innerRadius * Math.sin(randAngle) + y;
        }

        // translate the noodle to the new point and rotate it a random angle.
        noodle.translateTo(new_x, new_y);
        noodle.rotate(_.random(0, TWO_PI));
        noodle.draw(context);
    }

    // draw the bowl.
    Utils.drawCircle(context, x, y, radius, 8, Utils.randomColor());

}