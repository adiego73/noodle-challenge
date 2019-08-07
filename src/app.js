// global variables

// two library object
let two;

// canvas
let canvas;
const WIDTH = 800;
const HEIGHT = 600;

// constants
const MIN_BLEND_RADIUS = 10;
const MIN_LENGTH = 60;
const MAX_LENGTH = 150;

/**
 * Bootstrap the application.
 */
function bootstrap() {
    canvas = document.body;

    two = new Two({
        type: Two.Types.canvas,
        autostart: true,
        fullscreen: true
        // width: WIDTH,
        // height: HEIGHT
    }).appendTo(canvas);

}

/**
 * Draws the bowl.
 * @param x coordinate of the bowl's center
 * @param y coordinate of the bowl's center
 * @param radius
 * @param width
 */
function createBowl(x, y, radius, width = 6) {
    let bowl = two.makeArcSegment(x, y, radius, radius + width, 0, 2 * Math.PI);
    bowl.fill = Utils.randomColor();
    bowl.stroke = "black";
    bowl.linewidth = 1;
}

/**
 * Draws a noodle.
 * @param Bowl object with the bowl properties: {x, pos_x, y: pos_y, radius: radius }
 * @param length arc's length
 * @param radius 
 * @param lineWidth noodle width
 */
function createNoodle(Bowl, length, radius, lineWidth) {
        // amount arcs based on the length (ex. 1.75)
    let amountOfArcs = (length / radius) / Utils.degToRad(180);
    // amount of half-circle arcs (ex. 1)
    let integerAmountOfArcs = Math.floor(amountOfArcs);
    // less-than-an-arc arcs (ex. 0.75 --> means, 0.75 * 180deg arc)
    let decimalAmountOfArcs = amountOfArcs % 1;

    let arcs = _.map(_.range(integerAmountOfArcs), (i) => {
        let arc_x = Bowl.x + (2 * i * radius) - (i * lineWidth);
        let arc_y = Bowl.y;

        let start = (i % 2 === 1) ? Utils.degToRad(180) : Utils.degToRad(-180);
        return new Two.ArcSegment(arc_x, arc_y, radius - lineWidth, radius, start, Utils.degToRad(0));
    });

    if (decimalAmountOfArcs > 0) {
        let arc_x = Bowl.x + (2 * integerAmountOfArcs * radius) - (integerAmountOfArcs * lineWidth);
        let arc_y = Bowl.y;

        // define the start and angle of the less-than-an-arc arc
        let angle = (decimalAmountOfArcs * Math.PI - Utils.degToRad(180)) * ((integerAmountOfArcs % 2 === 1) ? -1: 1);
        let start = (integerAmountOfArcs % 2 === 1) ? Utils.degToRad(180) : Utils.degToRad(-180);
        let arc = new Two.ArcSegment(arc_x, arc_y, radius - lineWidth, radius, start, angle);
        arcs.push(arc);
    }

    // get the noodle radius
    let noodleRadius = _.reduce(arcs, (sum, e) => {
         return sum + (e.outerRadius);
    }, 0);

    // the noodle should be inside a circumference defined as the bowl circumference minus the noodle radius.
    // since the noodle is centered on its centroid, there is no problem to be over the perimeter of the inner circle.
    let innerRadius = Bowl.radius - noodleRadius;

    let rand = _.random(0, innerRadius, true) * 2 * Math.PI;
    let x, y;
    // we need to cover all the bowl, so:
    //  - get a random position inside a circumference
    // - or get a random position over a circumference
    if(_.random(0, 10) % 2) {
        x = (innerRadius * Math.sqrt(_.random(0, 1, true))) * Math.cos(rand) + Bowl.x;
        y = (innerRadius * Math.sqrt(_.random(0, 1, true))) * Math.sin(rand) + Bowl.y;
    }else{
        x = innerRadius * Math.cos(rand) + Bowl.x;
        y = innerRadius * Math.sin(rand) + Bowl.y;
    }

    // two.makeCircle(x,y,2).fill = "red";

    // define the noodle as the concatenation of the N arcs.
    let color = "white";
    let group = two.makeGroup(arcs);
    group.center();
    group.translation = new Two.Vector(x, y);
    group.rotation = _.random(0, 2 * Math.PI);
    group.fill = color;
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

    for (let i = qtyNoodles; i > 0; i--)
    {
        // setup the arc length and radius
        let length = _.random(MIN_LENGTH, MAX_LENGTH, true);
        let arcRadius = _.random(MIN_BLEND_RADIUS, 4 * MIN_BLEND_RADIUS, true);

        createNoodle({x: x, y: y, radius: radius}, length, arcRadius, lineWidth);
    }
    // draw the bowl.
    createBowl(x, y, radius, 8);
}