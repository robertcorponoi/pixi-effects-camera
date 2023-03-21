import type { Container } from "@pixi/display";

import CameraEffect from "../CameraEffect";

import { Vector2 } from "../models/Vector2";
import { CameraEffectOptions } from "../models/CameraEffectOptions";

/**
 * Pans the camera to a specified point in the provided container.
 *
 * @class
 */
class PanEffect extends CameraEffect {
    /**
     * The (x, y) coordinates to pan to in the container.
     *
     * @private
     *
     * @property {Vector2}
     */
    private _coordinates: Vector2;

    /**
     * Keeps track of the difference in coordinates from the current
     * coordinates and the desired coordinates.
     *
     * @private
     *
     * @property {Vector2}
     */
    private _difference: Vector2;

    /**
     * Indicates whether the desired x coordinate is greater than the current
     * x coordinate or not.
     *
     * @private
     *
     * @property {boolean}
     *
     * @default false
     */
    private _xIsGreater = false;

    /**
     * Indicates whether the desired y coordinate is greater than the current
     * y coordinate or not.
     *
     * @private
     *
     * @property {boolean}
     *
     * @default false
     */
    private _yIsGreater = false;

    /**
     * Initializes the pan effect on the specified container with the
     * specified parameters.
     *
     * @param {Container} container The container to apply the effect to.
     * @param {CameraEffectOptions} options The options to pass to the effect.
     * @param {Vector2} location The (x, y) coordinates of the location to pan the camera to.
     */
    constructor(
        container: Container,
        options: CameraEffectOptions,
        location: Vector2,
    ) {
        super(container, options);

        this._coordinates = location;

        if (this._coordinates.x > this.container.pivot.x)
            this._xIsGreater = true;
        if (this._coordinates.y > this.container.pivot.y)
            this._yIsGreater = true;

        this._difference = {
            x: Math.abs(this._coordinates.x - this.container.pivot.x),
            y: Math.abs(this._coordinates.y - this.container.pivot.y),
        };
    }

    /**
     * When updating this effect we pan on the x and y coordinates of the
     * container an amount calculated by how far we currently are from the
     * desired location.
     */
    update() {
        const timeDiffPercentage =
            (this.lastRanTimeStamp - this.startedTimeStamp) /
            this.options.duration;
        const timeDiffPercentageNegative =
            (this.options.duration - this.lastRanTimeStamp) /
            this.options.duration;

        const xPanAmount = this._xIsGreater
            ? this._difference.x * timeDiffPercentage
            : this._difference.x * timeDiffPercentageNegative;
        const yPanAmount = this._yIsGreater
            ? this._difference.y * timeDiffPercentage
            : this._difference.y * timeDiffPercentageNegative;

        this.container.pivot.x = xPanAmount;
        this.container.pivot.y = yPanAmount;

        // If the container's pivot has reached the desired location, we
        // return `false` to end the effect before the duration or end
        // condition is met.
        if (
            this.container.pivot.x > this._coordinates.x - 5 &&
            this.container.pivot.x < this._coordinates.x + 5 &&
            this.container.pivot.y > this._coordinates.y - 5 &&
            this.container.pivot.y < this._coordinates.y + 5
        )
            return false;
    }
}

export default PanEffect;
