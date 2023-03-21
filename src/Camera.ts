import Effect from "./CameraEffect";

/**
 * A camera that keeps track of the effects added to it.
 *
 * @class
 */
class Camera {
    /**
     * The effects that have been added to the camera.
     *
     * Once the effects have reached their duration or the `endCondition` has
     * been met, the effect is removed from the camera.
     *
     * @private
     * @property {Effect[]}
     */
    private _effects: Effect[] = [];

    /**
     * Returns the current list of effects.
     *
     * @returns {Effect[]} The current list of effects.
     */
    get effects(): Effect[] {
        return this._effects;
    }

    /**
     * Adds an effect to the list of effects that need to be tracked.
     *
     * @param {Effect} effect The effect to add.
     */
    addEffect(effect: Effect) {
        this._effects = [...this.effects, effect];
    }

    /**
     * Removes an effect from the list of effects that need to be tracked.
     *
     * This should be used sparingly if at all. Effects will automatically be
     * removed when their duration is up or their end condition is achieved.
     *
     * @param {Effect} effect The effect to remove.
     */
    removeEffect(effect: Effect) {
        this._effects = this._effects.filter((e) => e !== effect);
    }

    /**
     * The function that should be passed to PIXI's ticker or another update
     * function.
     *
     * This will handle running the `update` function for each active effect
     * and then checking to see whether it needs to be removed or not.
     *
     * @param {number} delta The delta value passed from the function updating the effect.
     */
    update(delta: number) {
        this._effects = this._effects.filter((effect) => {
            // If this is the first time that the effect has run, set the
            // started time to now.
            if (effect.startedTimeStamp === 0)
                effect.startedTimeStamp = performance.now();

            // First we run the effect and update the timestamp of when it
            // last ran.
            // If the effect returned `false` from its update, then we need
            // to stop it and remove it from being processed again.
            const continueEffect = effect.update(delta);
            if (continueEffect === false) {
                if (effect.onEnd) effect.onEnd();
                return false;
            }
            effect.lastRanTimeStamp = performance.now();

            // Store whether the duration of the effect has been reached to
            // make it easier to check.
            const currentTimestamp = performance.now();
            const durationReached =
                currentTimestamp - effect.startedTimeStamp >=
                effect.options.duration;

            // Also if an end condition was passed, we evaluate it here to
            // check if it has been met.
            const endConditionReached =
                effect.options.endCondition &&
                effect.options.endCondition(delta) === true;

            // If either the duration has been reached or the end condition
            // has been met, we remove the effect from the camera.
            if (durationReached || endConditionReached) {
                if (effect.onEnd) effect.onEnd();
                return false;
            }

            // The effect has ran, the duration has not been reached, and the
            // end condition doesn't exist or hasn't been met so we keep the
            // effect.
            return true;
        });
    }
}

export default Camera;
