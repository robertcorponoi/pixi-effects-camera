import type { Container } from "@pixi/display";

import CameraEffect from "../CameraEffect";

import { Vector2 } from "../models/Vector2";
import { CameraEffectOptions } from "../models/CameraEffectOptions";

/**
 * Rotates the container to a specified angle, in degrees, over a specified
 * duration of time.
 *
 * @class
 */
class RotateEffect extends CameraEffect {
    /**
     * The angle to rotate to.
     *
     * @private
     *
     * @property {number}
     */
    private _angle: number;

    /**
     * The initial angle of the container.
     *
     * @private
     *
     * @property {number}
     */
    private _initialAngle: number;

    /**
     * The initial pivot of the container.
     *
     * @private
     *
     * @property {Vector2}
     */
    private _initialPivot: Vector2;

    /**
     * A reference to the easing function to use, if any.
     *
     * Defaults to a linear ease if no easing function is provided.
     *
     * @private
     *
     * @property {(t: number) => number}
     *
     * @default (t:number)=>+t
     */
    private _easingFn: (t: number) => number;

    /**
     * Initializes the rotate effect on the specified container with the
     * specified parameters.
     *
     * @param {Container} container The container to apply the effect to.
     * @param {CameraEffectOptions} options The options to pass to the effect.
     * @param {number} angle The angle to rotate the container to.
     * @param {((t:number) => number)|undefined} [easingFn] An optional easing function to use for this effect.
     */
    constructor(
        container: Container,
        options: CameraEffectOptions,
        angle: number,
        easingFn?: (t: number) => number,
    ) {
        super(container, options);

        this._initialPivot = {
            x: this.container.pivot.x,
            y: this.container.pivot.y,
        };
        this._initialAngle = this.container.angle;
        this._angle = angle;

        this._easingFn = easingFn ? easingFn : (t: number) => +t;

        // If the initial pivot is 0, we can assume that the user wants to
        // pivot around the middle of the container and not at the corner so
        // we set the pivot point to center of the container.
        if (this._initialPivot.x == 0)
            this.container.pivot.x = this.container.width / 2;
        if (this._initialPivot.y == 0)
            this.container.pivot.y = this.container.height / 2;
    }

    /**
     * When updating this effect, we increase the angle of the provided
     * container by an amount calculated using the duration and the amount
     * left to pivot.
     */
    update() {
        const timeDiffPercentage =
            (this.lastRanTimeStamp - this.startedTimeStamp) /
            this.options.duration;
        const percentageThroughAnimation = this._easingFn(timeDiffPercentage);

        const angleAmount = this._angle * percentageThroughAnimation;
        this.container.angle = this._initialAngle + angleAmount;

        // Stop once container's angle has reached at least the desired angle.
        if (this.container.angle > this._angle) return false;
    }
}

export default RotateEffect;
