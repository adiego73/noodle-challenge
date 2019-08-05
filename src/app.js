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
const MIN_LENGTH = 10;
const MAX_LENGTH = 500;
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
        width: WIDTH,
        height: HEIGHT
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
    outerCircle.fill = Utils.randomColor();

    let innerCircle = two.makeCircle(x, y, radius);
    innerCircle.linewidth = 1;
    innerCircle.stroke = "black";
    innerCircle.fill = "white";
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
    let length = Utils.randomBetween(minLength, maxLength);

    // define an angle using the min and max angles
    let angle = Utils.randomBetween(minAngle, maxAngle);
    // set a random starting point
    let startAngle = Math.random() * Math.PI * 2;
    // define the endAngle
    let endAngle = angle + startAngle;

    // calculate the radius of the arc as lenght / angle. But if the arc is less than minBlendRadius, set it up as minBlendRadius.
    // Same if it is greater than the maximum inner circle radius (Bowl.radius - minBlendRadius)
    let arcRadius = Utils.throttle((length / angle), minBlendRadius, Bowl.radius - minBlendRadius);

    // calculate the maximum radius based on the arcRadius
    let innerRadius = Bowl.radius - arcRadius;

    // I choose a random point inside the inner circle
    // (the circle in which the radius of the arc will be the minimum at the perimeter).
    let rand = innerRadius * 2 * Math.PI;
    let x = (innerRadius * Math.sqrt(Math.random())) * Math.cos(rand) + Bowl.x;
    let y = (innerRadius * Math.sqrt(Math.random())) * Math.sin(rand) + Bowl.y;

    // draw the noodle.
    __drawSegment(x, y, arcRadius - lineWidth, arcRadius, startAngle, endAngle);
}

function main() {
    // setup
    bootstrap();

    // center the bowl at the middle of the canvas
    let x = WIDTH / 2;
    let y = HEIGHT / 2;
    // define the bowl's radius
    let radius = ((HEIGHT < WIDTH) ? HEIGHT : WIDTH) / 3;

    // draw the bowl.
    createBowl(x, y, radius, 8);

    // amount of noodles to create
    let qtyNoodles = Utils.map(LINE_WIDTH, 10, 1, 800, 3000);

    for (let i = qtyNoodles; i > 0; i--)
        createNoodle({x: x, y: y, radius: radius}, MIN_LENGTH, MAX_LENGTH, MIN_ANGLE, MAX_ANGLE, MIN_BLEND_RADIUS, LINE_WIDTH);

}