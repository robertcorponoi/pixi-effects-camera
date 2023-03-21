/**
 * The options that can be passed when creating a camera effect.
 */
export interface CameraEffectOptions {
    /** 
     * The duration that the effect should run for. Set to `Infinity` for an 
     * infinite duration.
     */
    duration: number;

    /**
     * A function that evaluates to a condition that, when met, stops the 
     * effect before the effect run time reaches its duration.
     * 
     * This function can accept the current delta time as a parameter.
     * 
     * @param {(delta: number) => boolean}
     */
    endCondition?: (delta: number) => boolean;
}