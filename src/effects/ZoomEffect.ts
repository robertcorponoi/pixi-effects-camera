import type { Container } from "@pixi/display";

import CameraEffect from "../CameraEffect";

import { Vector2 } from "../models/Vector2";
import { CameraEffectOptions } from "../models/CameraEffectOptions";

/**
 * Zooms the camera to a specified location on the provided container with a
 * provided zoom level.
 *
 * @class
 */
class ZoomEffect extends CameraEffect {
    /**
     * The level to zoom to on the x and y axis.
     *
     * Values larger than 1 are more zoomed in while values below one are
     * zoomed out.
     *
     * @private
     *
     * @property {Vector2}
     */
    private _zoomLevel: Vector2;

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
     * A reference to the initial zoom level of the container.
     *
     * @private
     *
     * @property {Vector2}
     */
    private _initialZoomLevel: Vector2;

    /**
     * Indicates whether the desired x zoom level is greater than the current
     * zoom level or not.
     *
     * @private
     *
     * @property {boolean}
     *
     * @default false
     */
    private _xIsGreater = false;

    /**
     * Indicates whether the desired y zoom level is greater than the current
     * zoom level or not.
     *
     * @private
     *
     * @property {boolean}
     *
     * @default false
     */
    private _yIsGreater = false;

    /**
     * Initializes the zoom effect on the specified container with the
     * specified parameters.
     *
     * @param {Container} container The container to apply the effect to.
     * @param {CameraEffectOptions} options The options to pass to the effect.
     * @param {Vector2} zoomLevel The zoom level on the x and y axis to zoom to.
     * @param {((t:number) => number)|undefined} [easingFn] An optional easing function to use for this effect.
     */
    constructor(
        container: Container,
        options: CameraEffectOptions,
        zoomLevel: Vector2,
        easingFn?: (t: number) => number,
    ) {
        super(container, options);

        this._zoomLevel = zoomLevel;
        this._easingFn = easingFn ? easingFn : (t: number) => +t;

        this._initialZoomLevel = {
            x: this.container.scale.x,
            y: this.container.scale.y,
        };

        if (this._zoomLevel.x > this._initialZoomLevel.x)
            this._xIsGreater = true;
        if (this._zoomLevel.y > this._initialZoomLevel.y)
            this._yIsGreater = true;
    }

    /**
     * When updating this effect we zoom in on the specified (x, y) value at a
     * rate depending on the duration and easing function parameters.
     */
    update() {
        const timeDiffPercentage: number =
            (this.lastRanTimeStamp - this.startedTimeStamp) /
            this.options.duration;
        const percentageThroughAnimation: number =
            this._easingFn(timeDiffPercentage);

        const xZoomAmount = this._zoomLevel.x * percentageThroughAnimation;
        const yZoomAmount = this._zoomLevel.y * percentageThroughAnimation;

        this.container.scale.x = this._xIsGreater
            ? this._initialZoomLevel.x + xZoomAmount / 2
            : this._initialZoomLevel.x - xZoomAmount;
        this.container.scale.y = this._yIsGreater
            ? this._initialZoomLevel.y + yZoomAmount / 2
            : this._initialZoomLevel.y - yZoomAmount;

        // If we've reached a zoom level within a 0.01 of the desired zoom
        // level, we return `false` to stop the effect. This should line up
        // with the duration also being met but not exactly.
        if (
            this.container.scale.x > this._zoomLevel.x - 0.01 &&
            this.container.scale.x < this._zoomLevel.x + 0.01 &&
            this.container.scale.y > this._zoomLevel.y - 0.01 &&
            this.container.scale.y < this._zoomLevel.y + 0.01
        )
            return false;
    }
}

export default ZoomEffect;
