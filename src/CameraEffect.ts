import type { Container } from "@pixi/display";

import { CameraEffectOptions } from "./models/CameraEffectOptions";

/**
 * Defines the structure of the `CameraEffect` abstract class.
 */
interface CameraEffect {
    /**
     * The function to run when the effect has finished. By finished, it means
     * that the effect has reached its duration or end condition.
     *
     * @abstract
     */
    onEnd?(): void;
}

/**
 * The base object used by all of the other effects.
 *
 * @abstract
 * @class
 */
abstract class CameraEffect {
    /**
     * The container to apply the effect to.
     *
     * This can be any individual container or the root `app.stage` container
     * to apply it to all of the containers of the game.
     *
     * @private
     * @property {Container}
     */
    private _container: Container;

    /**
     * The options passed to the effect.
     *
     * @private
     * @property {CameraEffectOptions}
     */
    private _options: CameraEffectOptions;

    /**
     * A timestamp of when this effect started running.
     *
     * @property {DOMHighResTimeStamp}
     */
    startedTimeStamp: DOMHighResTimeStamp = 0;

    /**
     * A timestamp of when this effect last ran.
     *
     * @property {DOMHighResTimeStamp}
     */
    lastRanTimeStamp: DOMHighResTimeStamp = 0;

    /**
     * Initializes the effect on the provided container.
     *
     * @param {Container} container The container to apply the effect to.
     * @param {CameraEffectOptions} options The options to use for this effect.
     */
    constructor(container: Container, options?: CameraEffectOptions) {
        this._container = container;

        this._options = {
            duration: (options && options.duration) || 0,
            endCondition: (options && options.endCondition) || undefined,
        };
    }

    /**
     * Returns the container to run the effect on.
     *
     * @returns {Container} The container to run the effect on.
     */
    get container(): Container {
        return this._container;
    }

    /**
     * Returns the effect's options.
     *
     * @returns {CameraEffectOptions} The effect's options.
     */
    get options(): CameraEffectOptions {
        return this._options;
    }

    /**
     * Indicates what the effect should do when updated by the PIXI ticker or
     * other update function.
     *
     * This is run before the criteria is checked to be met.
     *
     * This function can also return `true` to end the effect before the
     * duration or end condition has been met. This is helpful for situations
     * like panning where you might need to end when you get to a specified
     * location before the duration might be up.
     *
     * @abstract
     *
     * @param {number} [delta] The delta value passed from the function updating the effect.
     *
     * @returns {boolean} If true, it will end the effect.
     */
    abstract update(delta?: number): boolean | void;
}

export default CameraEffect;
