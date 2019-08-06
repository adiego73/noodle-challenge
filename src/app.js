// global variables

// two library object
let two;

// canvas
let canvas;
const WIDTH = 800;
const HEIGHT = 600;

// constants
const LINE_WIDTH = 5; // line width goes from 1 to 10
const MIN_BLEND_RADIUS = 10;
const MIN_LENGTH = 100;
const MAX_LENGTH = 300;
const MIN_ANGLE = Utils.degToRad(20);
const MAX_ANGLE = Utils.degToRad(180);

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
 * Draws an arc segment
 * @param x coordinate of the arc's center
 * @param y coordinate of the arc's center
 * @param inRadius inner radius of the arc
 * @param outRadius outer radius of the arc
 * @param startAngle starting angle
 * @param endAngle ending angle.
 * @param strokeColor
 * @param fillColor
 * @private
 */
function __drawSegment(x, y, inRadius, outRadius, startAngle, endAngle, strokeColor = "black", fillColor = "white") {
    let arc = two.makeArcSegment(x, y, inRadius, outRadius, startAngle, endAngle);
    arc.stroke = strokeColor;
    arc.fill = fillColor;
    arc.linewidth = 1;
}

/**
 * Draws the bowl.
 * @param x coordinate of the bowl's center
 * @param y coordinate of the bowl's center
 * @param radius
 * @param width
 */
function createBowl(x, y, radius, width = 6) {
    let outerCircle = two.makeCircle(x, y, radius + width);
    outerCircle.linewidth = 1;
    outerCircle.stroke = "black";
    outerCircle.noFill();

    let innerCircle = two.makeCircle(x, y, radius);
    innerCircle.linewidth = 1;
    innerCircle.stroke = "black";
    innerCircle.noFill();
}

/**
 * Draws a noodle.
 * @param Bowl object with the bowl properties: {x, pos_x, y: pos_y, radius: radius }
 * @param minLength minimum arc's length
 * @param maxLength maximum arc's length
 * @param minAngle
 * @param maxAngle
 * @param minBlendRadius minimum blend radius
 * @param lineWidth noodle width
 */
function createNoodle(Bowl, minLength, maxLength, minAngle, maxAngle, minBlendRadius, lineWidth) {
    // setup the arc length.
    let length = _.random(minLength, maxLength, true);
    let radius = _.random(minBlendRadius, minBlendRadius * 4, true);

    // amount of complete arcs
    let amountOfArcs = length / (radius * Utils.degToRad(180));
    let integerAmountOfArcs = Math.floor(amountOfArcs);

    let arcs = _.map(_.range(integerAmountOfArcs), (i) => {
        length -= length / integerAmountOfArcs;
        let arc_x = Bowl.x + (2 * i * radius) - (i * lineWidth);
        let arc_y = Bowl.y;

        let start = (i % 2 === 1) ? Utils.degToRad(180) : Utils.degToRad(-180);
        let end = Utils.degToRad(0);
        return new Two.ArcSegment(arc_x, arc_y, radius - lineWidth, radius, start, end);
    });

    if (length > 0) {
        let arc_x = Bowl.x + (2 * integerAmountOfArcs * radius) - (integerAmountOfArcs * lineWidth);
        let arc_y = Bowl.y;

        let angle = (length / radius) - Utils.degToRad(180);
        let start = (integerAmountOfArcs % 2 === 1) ? Utils.degToRad(180) : Utils.degToRad(-180);
        let end = angle * -1;
        let arc = new Two.ArcSegment(arc_x, arc_y, radius - lineWidth, radius, start, end);
        arcs.push(arc);
    }

    let noodleRadius = _.reduce(arcs, (sum, e2) => {
        return sum + e2.outerRadius;
    }, 0);

    let group = two.makeGroup(arcs);

    let innerRadius = Bowl.radius - noodleRadius;
    let rand = _.random(0, innerRadius, true) * 2 * Math.PI;
    let x = (innerRadius * Math.sqrt(_.random(0, 1, true))) * Math.cos(rand) + Bowl.x;
    let y = (innerRadius * Math.sqrt(_.random(0, 1, true))) * Math.sin(rand) + Bowl.y;

    // console.log(x + "   " + y);

    // two.makeCircle(Bowl.x, Bowl.y, innerRadius).noFill();
    // two.makeCircle(x, y, 2).fill = "red";

    group.center();
    group.translation = new Two.Vector(x, y);
    group.rotation = _.random(0, 2 * Math.PI);
    group.fill = "white"; // Utils.randomColor();
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
    let qtyNoodles = Utils.map(LINE_WIDTH, 10, 1, 800, 5000);

    for (let i = qtyNoodles; i > 0; i--)
        createNoodle({
            x: x,
            y: y,
            radius: radius
        }, MIN_LENGTH, MAX_LENGTH, MIN_ANGLE, MAX_ANGLE, MIN_BLEND_RADIUS, LINE_WIDTH);

    // draw the bowl.
    createBowl(x, y, radius, 8);
}