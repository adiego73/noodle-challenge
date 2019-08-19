// constants
const WIDTH = 800;
const HEIGHT = 600;
const MIN_BEND_RADIUS = 5;
const MIN_LENGTH = 200;
const MAX_LENGTH = 400;

const PI = Math.PI;
const TWO_PI = 2 * PI;
const HALF_PI = 0.5 * PI;

class Utils {
    /**
     * returns a string representing a color
     * @returns {string}
     */
    static randomColor() {
        return '#'
            + Math.floor(Math.random() * 255).toString(16)
            + Math.floor(Math.random() * 255).toString(16)
            + Math.floor(Math.random() * 255).toString(16);
    }

    static map(value, in_min, in_max, out_min, out_max) {
        // ((value−in_min) * (out_max−out_min) / (in_max−in_min))+out_min
        return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    /**
     * Draw a circle.
     * @param context
     * @param x coordinate of the bowl's center
     * @param y coordinate of the bowl's center
     * @param radius
     * @param width
     * @param color
     */
    static drawCircle(context, x, y, radius, width = 6, color = "white") {
        if (color !== "transparent") {
            context.beginPath();
            context.arc(x, y, radius + (width / 2), 0, TWO_PI);
            context.lineWidth = width;
            context.lineCap = "butt";
            context.strokeStyle = color;
            context.stroke();
        }

        context.beginPath();
        context.arc(x, y, radius + width, 0, TWO_PI);
        context.lineWidth = 1;
        context.strokeStyle = "black";
        context.stroke();

        context.beginPath();
        context.arc(x, y, radius, 0, TWO_PI);
        context.lineWidth = 1;
        context.strokeStyle = "black";
        context.stroke();
    }
}