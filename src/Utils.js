class Utils {
    static distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    static randomBetween(min, max){
        return (Math.random() * (max - min) ) + min;
    }

    static randomColor(){
        return 'rgb('
            + Math.floor(Math.random() * 255) + ','
            + Math.floor(Math.random() * 255) + ','
            + Math.floor(Math.random() * 255) + ')';
    }

    static throttle(value, min, max){
        if(value < min)
            return min;
        else if(value > max)
            return max;

        return value;
    }

    static map(value, in_min, in_max, out_min, out_max){

        // ((value−in_min) * (out_max−out_min) / (in_max−in_min))+out_min

        return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    static degToRad(deg){
        return (deg * Math.PI / 180);
    }
}