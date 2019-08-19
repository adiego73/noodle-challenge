// canvas
let canvas;
let context;

/**
 * Bootstrap the application.
 */
function bootstrap() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    context.canvas.width  = window.innerWidth;
    context.canvas.height = window.innerHeight;

}

function __drawArc(x, y, radius, startAngle, endAngle, width, color = "white"){
    let cw = endAngle < startAngle;


}

function main() {
    // setup
    bootstrap();

    // center the bowl at the middle of the canvas
    let x = WIDTH / 2;
    let y = HEIGHT / 2;
    // define the bowl's radius
    let radius = ((HEIGHT < WIDTH) ? HEIGHT : WIDTH) / 3;

    // amount of noodles to create
    let lineWidth = 5; // line width goes from 1 to 10
    let qtyNoodles = Utils.map(lineWidth, 10, 1, 800, 3000);

    // for (let i = qtyNoodles; i > 0; i--)
    {
        // setup the arc length and radius
        let length = _.random(MIN_LENGTH, MAX_LENGTH, true);

        let noodle = new Noodle(x, y, length,  MIN_BEND_RADIUS, 10 * MIN_BEND_RADIUS, 6, "white");
        noodle.createInside(context, {x: x, y: y, radius: radius});

        // the noodle should be inside a circumference defined as the bowl circumference minus the noodle radius.
        // since the noodle is centered on its centroid, there is no problem to be over the perimeter of the inner circle.
        console.log(noodle.box.width);
        let noodleRadius = noodle.box.width / 2;
        let innerRadius = radius - noodleRadius - 25;

        let rand = _.random(0, innerRadius, true) * TWO_PI;
        let new_x, new_y;
        // we need to cover all the bowl, so:
        //  - get a random position inside a circumference
        // - or get a random position over a circumference
        // if(_.random(0, 10) % 2) {
            new_x = (innerRadius * Math.sqrt(_.random(0, 1, true))) * Math.cos(rand) + x;
            new_y = (innerRadius * Math.sqrt(_.random(0, 1, true))) * Math.sin(rand) + y;
        // }else{
        //     new_x = innerRadius * Math.cos(rand) + x;
        //     new_y = innerRadius * Math.sin(rand) + y;
        // }

        noodle.translateTo(new_x,new_y);
        noodle.rotate(_.random(0, TWO_PI));
        noodle.draw(context);

        Utils.drawCircle(context, noodle.translate.x, noodle.translate.y, 1, 2, "red");
    }

    // draw the bowl.
    Utils.drawCircle(context, x, y, radius, 8, Utils.randomColor());

}