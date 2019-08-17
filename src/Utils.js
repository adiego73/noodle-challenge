// constants
const WIDTH = 800;
const HEIGHT = 600;
const MIN_BEND_RADIUS = 5;
const MIN_LENGTH = 200;
const MAX_LENGTH = 300;

const PI = Math.PI;
const TWO_PI = 2 * PI;

class Utils {
    /**
     * returns a string representing a color
     * @returns {string}
     */
    static randomColor(){
        return '#'
            + Math.floor(Math.random() * 255).toString(16)
            + Math.floor(Math.random() * 255).toString(16)
            + Math.floor(Math.random() * 255).toString(16);
    }

    static map(value, in_min, in_max, out_min, out_max){
        // ((value−in_min) * (out_max−out_min) / (in_max−in_min))+out_min
        return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
}