import type { Sprite } from "@pixi/sprite";
import type { Container } from "@pixi/display";

import CameraEffect from "../CameraEffect";
import { CameraEffectOptions } from "../models/CameraEffectOptions";

/**
 * Fades the camera to the specified color.
 *
 * @class
 */
class FadeEffect extends CameraEffect {
    /**
     * A reference to the sprite used to apply a color to for the fade effect.
     *
     * @private
     *
     * @property {Sprite}
     */
    private _filter: Sprite;

    /**
     * The color to fade to.
     *
     * @private
     *
     * @property {number}
     */
    private _color: number;

    /**
     * The opacity to set the filter to.
     *
     * @private
     *
     * @property {number}
     */
    private _opacity: number;

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
     * Indicates whether it is a fade out or not.
     *
     * @private
     *
     * @property {boolean}
     */
    private _isFadeOut: boolean;

    /**
     * The initial opacity of the container before the effect was added.
     *
     * @private
     *
     * @property {number}
     */
    private _initialOpacity: number;

    /**
     * Initializes the fade effect on the specified container with the
     * specified parameters.
     *
     * @param {Container} container The container to apply the effect to.
     * @param {CameraEffectOptions} options The options to pass to the effect.
     * @param {Sprite} filter The sprite used as the filter to pass the color to.
     * @param {number} color The color to fade to.
     * @param {number} opacity The opacity to fade to.
     * @param {((t:number) => number)|undefined} [easingFn] An optional easing function to use for this effect.
     */
    constructor(
        container: Container,
        options: CameraEffectOptions,
        filter: Sprite,
        color: number,
        opacity: number,
        easingFn?: (t: number) => number,
    ) {
        super(container, options);

        this._color = color;
        this._opacity = opacity;
        this._easingFn = easingFn ? easingFn : (t: number) => +t;

        // Set up the sprite filter to be used for the fade out effect by
        // settings its dimensions to be the container's dimensions and its
        // tint to be the color we want to fade out to. Lastly we add it to
        // the container so that it's visible.
        this._filter = filter;
        this._filter.width = this.container.width;
        this._filter.height = this.container.height;
        this._filter.alpha = 0;
        this._filter.tint = this._color;
        this.container.addChild(this._filter);

        this._initialOpacity = this._filter.alpha;

        // If the alpha value of the container is greater than the current
        // opacity, we are fading in instead of out.
        if (this._filter.alpha > this._opacity) this._isFadeOut = false;
        else this._isFadeOut = true;
    }

    /**
     * When updating this effect we fade in or out to the specified color
     * using the provided easing function.
     */
    update() {
        const timeDiffPercentage =
            (this.lastRanTimeStamp - this.startedTimeStamp) /
            this.options.duration;
        const percentageThroughAnimation = this._easingFn(timeDiffPercentage);

        const fadeAmount = 1 * percentageThroughAnimation;
        this._filter.alpha = this._isFadeOut
            ? fadeAmount
            : this._initialOpacity - fadeAmount;

        // If we've reached an opacity level within 0.01 of the desired
        // opacity level, we return `false` to stop the effect. This should
        // line up with the duration also being met but not exactly.
        if (
            (this._isFadeOut && this._filter.alpha >= this._opacity - 0.01) ||
            (!this._isFadeOut && this._filter.alpha <= this._opacity + 0.01)
        )
            return false;
    }
}

export default FadeEffect;
