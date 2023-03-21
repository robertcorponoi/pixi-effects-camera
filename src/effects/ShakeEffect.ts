import type { Container } from "@pixi/display";

import CameraEffect from "../CameraEffect";

import { Vector2 } from "../models/Vector2";
import { CameraEffectOptions } from "../models/CameraEffectOptions";

/**
 * Shakes the camera with a random intensity between the specified bounds.
 *
 * This effect is achieved by setting the pivot on the container to a random
 * value determined by the intensity. When the effect is done, the pivot is
 * reset to the initial pivot from before the shake effect was used.
 *
 * @class
 */
class ShakeEffect extends CameraEffect {
    /**
     * The intensity of the shake, a value from 1-10.
     *
     * @property {number}
     *
     * @default 5
     */
    intensity = 5;

    /**
     * A reference to the initial pivot of the container to apply the effect
     * to.
     *
     * @private
     * @property {Vector2}
     */
    private _initialPivotVector: Vector2;

    /**
     * Initializes the shake effect on the specified container with the
     * specified parameters.
     *
     * @param {Container} container The container to apply the effect to.
     * @param {CameraEffectOptions} options The options to pass to the effect.
     * @param {number} intensity The intensity of the shake effect.
     */
    constructor(
        container: Container,
        options: CameraEffectOptions,
        intensity: number,
    ) {
        super(container, options);

        this.intensity = intensity;
        this._initialPivotVector = {
            x: container.pivot.x,
            y: container.pivot.y,
        };
    }

    /**
     * When updating this effect we choose a random point to pivot the
     * container to depending on the intensity.
     */
    update() {
        const dx = Math.random() * this.intensity;
        const dy = Math.random() * this.intensity;

        this.container.pivot.x = dx;
        this.container.pivot.y = dy;
    }

    /**
     * When the shake effect has ended, we reset the pivot of the container to
     * the initial pivot.
     */
    onEnd() {
        this.container.pivot.x = this._initialPivotVector.x;
        this.container.pivot.y = this._initialPivotVector.y;
    }
}

export default ShakeEffect;
