# PIXI Effects Camera

Pixi Effects Camera, (formerly [Pixi Game Camera](https://github.com/robertcorponoi/pixi-game-camera)), is a non-opinionated way to add a camera with effects to your [Pixi](https://pixijs.com/) application using [Pixi containers](https://pixijs.download/release/docs/PIXI.Container.html).

**Table of Contents**

-   [Installation](#installation)
-   [Basic Usage](#basic-usage)
-   [Camera](#camera)
    -   [addEffect](#addeffecteffect-effect-void)
    -   [removeEffect](#removeeffecteffect-effect-void)
    -   [update](#updatedelta-number-void)
-   [Effects](#effects)
    -   [Shake](#shake)
    -   [Zoom](#zoom)
    -   [Pan](#pan)
    -   [Rotate](#rotate)
    -   [Fade](#fade)
-   [Creating Your Own Effects](#creating-your-own-effects)
    -   [CameraEffect Abstract Class](#cameraeffect-abstract-class)
    -   [Re-creating the Shake Effect](#re-creating-the-shake-effect)
-   [License](#license)

## Installation

To install Pixi Effects Camera, use:

```sh
npm install pixi-effects-camera
```

## Basic Usage

There's two main components to the effects camera: the `Camera` and the `CameraEffect`. The `Camera` is what keeps track of and runs the effects. Each individual effect inherits from the `CameraEffect` abstract class which outlines the properties and methods needed by each effect. You can read more about this in the [creating your own effects section](#creating-your-own-effects).

To start, you always need to create a `Camera` instance:

```ts
import { Camera } from "pixi-effects-camera";

const camera = new Camera();
```

The camera is simple and doesn't take any initialization options, it is just used to add the effects to so that it can update them.

Next, let's choose an effect to add to the camera. We'll just use the simple [shake](#shake) effect which you can find documentation of below. Let's create a new instance of the shake effect that'll run on the Pixi app's main container for a duration of 5 seconds:

```ts
// Update the import to include the shake effect.
import { Camera, CameraShakeEffect } from "pixi-effects-camera";

const shakeEffect = new CameraShakeEffect(app.stage, { duration: 5000 }, 5);
```

Let's go over the parameters that were passed to `CameraShakeEffect`. The first parameter to any effect will be the [Pixi container](https://pixijs.download/release/docs/PIXI.Container.html) to apply the effect to. In this case, we're applying it to the entire application by providing the root `app.stage` container. Next, every effect has an options object which can either be passed a duration to run for or an end condition to check for. Lastly, the shake effect takes a value from 1-10 which is the intensity of the shake. Each effect will have unique parameters after the options parameter.

The duration to run for should be a value in milliseconds and it will start counting from when the effect first started. The end condition is a function that should evaluate to a boolean that indicates whether the effect should stop running or not. This is helpful in cases where you don't want to run it for a specific duration. An example would be the effect running until the player picks up an item or reaches a certain point in the level, etc.

Now that we've created the shake effect, we have to add it to the camera:

```ts
camera.addEffect(shakeEffect);
```

Now the camera is aware of the effect and will start running it on the next update tick.

To actually apply the effect, the camera needs to have its `update` function run every frame. This should be passed to the [Pixi ticker](https://pixijs.download/release/docs/PIXI.Ticker.html) function or whatever game loop you have like so:

```ts
app.ticker.add((delta) => {
    camera.update(delta);
});
```

As your game runs the camera will run the shake effect for 5 seconds and then remove it.

## Camera

The camera is the core component of the library that is used to manage effects and run them. A camera is always needed to use an effect.

### Methods

The camera has the following methods:

### **addEffect(effect: Effect): void**

The `addEffect` method is used to add an instance of an effect to the camera so it can be run. Any effect added to the camera must inhert the `CameraEffect` abstract class so that it has all of the properties and methods that the camera expects.

**Example**

Adding a shake effect instance to the camera:

```ts
const shakeEffect = new CameraShakeEffect(app.stage, { duration: 5000 }, 5);
camera.addEffect(shakeEffect);
```

### **removeEffect(effect: Effect): void**

The `removeEffect` method is used to remove an instance of an effect previously added to the camera. This should be used sparingly as the camera already handles removing effects that no longer need to be run automatically.

**Example**

Removing a shake effect instance from the camera:

```ts
const shakeEffect = new CameraShakeEffect(app.stage, { duration: 5000 }, 5);
camera.addEffect(shakeEffect);

camera.removeEffect(shakeEffect);
```

### **update(delta: number): void**

The `update` method needs to be passed to your [Pixi ticker](https://pixijs.download/release/docs/PIXI.Ticker.html) or custom game loop function to run the effects every frame. The `delta` time should be passed down to it so that it can be passed back to use in end conditions as you'll see in the [effects documentation](#effects) below.

**Example:**

```ts
const shakeEffect = new CameraShakeEffect(app.stage, { duration: 5000 }, 5);
camera.addEffect(shakeEffect);

app.ticker.add((delta) => {
    camera.update(delta);
});
```

## Effects

This package comes with some standard effects that can be imported.

Each standard effect takes a variable number of initialization parameters with the first parameter being the container to apply the event and the second being the options.

The container is any [Pixi container](https://pixijs.download/release/docs/PIXI.Container.html). In the examples throughout the documentation we use the `app.stage` root container to apply the effect to the entire game but you can use any container within your application.

The second parameter is an object that takes the duration and optionally the end condition for the effect. The duration is a number, in milliseconds, that indicates how long the effect should run for. The end condition is a function that evaluates to a boolean that indicates whether the effect should stop running or not. The options look like:

```ts
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
```

Since the end condition is a bit more complicated let's go over that a bit. The end condition has to be a function that evaluates to a boolean and if provided, will be run on every update call to check if true. An example of using an end condition could be to check whether the player has acquired an item or reached a certain point of the level.

A basic example of an end condition is shown below with the effect ending once `i` reaches 250.

```ts
let i = 0;

const shakeEffect = new CameraShakeEffect(
    app.stage,
    {
        // Note that the end condition also passes the `delta` time so that can
        // be used in your function if needed.
        endCondition: (delta: number) => i === 250,
    },
    5,
);

app.ticker.add((delta) => {
    camera.update(delta);
    i++;
});
```

**Note:** If you pass an end condition, it will override the `duration`.

### Shake

The shake effect is one of the default effects from the library that causes the screen to shake with an intensity from 1-10.

This effect is achieved by setting the pivot on the container to a random value determined by the intensity. When the effect is done, the pivot is reset to the initial pivot from before the shake effect was used.

The shake effect takes the following parameters:

| Name      | Type                | Description                                                         | Default |
| --------- | ------------------- | ------------------------------------------------------------------- | ------- |
| container | PIXI.Container      | The container to apply the effect to.                               |         |
| options   | CameraEffectOptions | The options to specify the duration or end condition of the effect. |         |
| intensity | number              | The intensity of the shake effect.                                  | 5       |

An example of creating a new shake effect that operates on the app's main container with an intensity of 5 for 5 seconds looks like:

```ts
const shakeEffect = new ShakeEffect(app.stage, { duration: 5000 }, 5);
```

A running example of the shake effect can be found in the [examples](./examples/shake/).

### Zoom

The zoom effect is one of the default effects from the library that causes the camera to zoom in or out on the x and y axis. The zoom effect is one of the effects that accepts an easing function that can be used to zoom in a non linear way.

For the location, a number above 1 means that you want to zoom in on that axis and a number below 1 means that you want to zoom out.

The easing function that can be provided is a simple easing function that defaults to a linear ease. A good source for these easing functions is the [d3-ease](https://github.com/d3/d3-ease) package.

The zoom effect takes the following parameters:

| Name      | Type                  | Description                                                         | Default           |
| --------- | --------------------- | ------------------------------------------------------------------- | ----------------- |
| container | PIXI.Container        | The container to apply the effect to.                               |                   |
| options   | CameraEffectOptions   | The options to specify the duration or end condition of the effect. |                   |
| zoomLevel | Vector2               | The zoom level on the x and y axis.                                 |                   |
| easingFn  | (t: number) => number | The easing function to use.                                         | (t: number) => +t |

An example of creating a new zoom effect that operates on the app's main container with a zoom level of (2, 2) over the duration of 2 seconds looks like:

```ts
const zoomEffect = new ZoomEffect(
    app.stage,
    { duration: 2000 },
    { x: 2, y: 2 },
);
```

A running example of the zoom effect can be found in the [examples](./examples/zoom/).

### Pan

The pan effect is one of the default effects from the library that causes the camera to pan in on a specified (x, y) location.

| Name      | Type                | Description                                                         | Default |
| --------- | ------------------- | ------------------------------------------------------------------- | ------- |
| container | PIXI.Container      | The container to apply the effect to.                               |         |
| options   | CameraEffectOptions | The options to specify the duration or end condition of the effect. |         |
| location  | Vector2             | The location to pan to.                                             |         |

An example of creating a new pan effect that operates on the app's main container panning to the location (50, 150) over the course of 2 seconds looks like:

```ts
const panEffect = new PanEffect(
    app.stage,
    { duration: 2000 },
    { x: 50, y: 150 },
);
```

A running example of the pan effect can be found in the [examples](./examples/pan/).

### Rotate

The rotate effect is one of the default effects from the library that causes the camera to rotate the specified container to the specified angle.

The easing function that can be provided is a simple easing function that defaults to a linear ease. A good source for these easing functions is the [d3-ease](https://github.com/d3/d3-ease) package.

The rotate effect takes the following parameters:

| Name      | Type                  | Description                                                         | Default           |
| --------- | --------------------- | ------------------------------------------------------------------- | ----------------- |
| container | PIXI.Container        | The container to apply the effect to.                               |                   |
| options   | CameraEffectOptions   | The options to specify the duration or end condition of the effect. |                   |
| angle     | number                | The angle to rotate to.                                             |                   |
| easingFn  | (t: number) => number | The easing function to use.                                         | (t: number) => +t |

An example of creating a new rotate effect that rotate's the app's main container by 45 degrees over the course of 4 seconds looks like:

```ts
const rotateEffect = new RotateEffect(app.stage, { duration: 4000 }, 45);
```

A running example of the rotate effect can be found in the [examples](./examples/rotate/).

### Fade

The fade effect is one of the default effects from the library that fades the screen to a specified color and opacity.

It's also one of the trickier ones as it requires you to pass in a [`PIXI.Sprite`](https://pixijs.download/release/docs/PIXI.Sprite.html) object to use as the filter that the fade color and opacity is then applied to.

The rotate effect takes the following parameters:

| Name      | Type                | Description                                                         | Default |
| --------- | ------------------- | ------------------------------------------------------------------- | ------- |
| container | PIXI.Container      | The container to apply the effect to.                               |         |
| options   | CameraEffectOptions | The options to specify the duration or end condition of the effect. |         |
| filter    | PIXI.Sprite         | The sprite to use as the filter that the color is applied to.       |         |
| color     | number              | The color to fade to.                                               |         |
| opacity   | number              | The opacity to fade to, between 0 and 1.                            |         |

An example of creating a fade effect that fades to black looks like:

```ts
const fadeEffect = new FadeEffect(
    app.stage,
    { duration: 2000 },
    new PIXI.Sprite(PIXI.Texture.WHITE),
    0x000000,
    1,
);
```

A running example of the rotate effect can be found in the [examples](./examples/fade/).

## Creating Your Own Effects

Creating your own effect is simple and fun (at least to me it is). Before we get into how to create a custom effect, let's go over the `CameraEffect` custom class which all of the effects are based off of and which your custom effect will also need to extend.

### CameraEffect Abstract Class

The `CameraEffect` abstract class contains the bare minimum properties and methods that are needed to make an effect work with the camera.

The parameters that are required by any effect that extends from this class are:

#### Properties

-   **container** - A [`PIXI.Container`](https://pixijs.download/release/docs/PIXI.Container.html) object that specifies the container to run the effect on.
-   **options** - The effect options that include the duration and/or end condition of the effect.

The options, in more detail, look like:

```ts
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
```

**Note:** Duration has to be passed to each effect, even if it's `Infinity`. The end condition is optional and can be used to end a condition before the duration has been reached.

#### Methods

The only required method is the `update` method which is called by the `Camera` on every frame to update the effect's animation.

**update(delta: number): boolean | undefined**

The update can use the `delta` time passed down from the `Camera` and it can optionally return `false` to to stop the effect early, before the duration or end condition is met. This is helpful in situations like the pan effect which needs to stop the effect when it reaches its destination, even if the duration hasn't been fully met.

There's also an optional function that can be implemented, `onEnd`. This function will run once the effect has completed due to either:

-   Returning `false` from the update method.
-   Duration has been reached.
-   End condition has been reached.

This is useful for resetting state after an effect has run. The shake effect utilizes this to reset the pivot of the container after the effect is done.

### Re-creating the Shake Effect

Any of the existing effects can be looked at as templates as they all follow the same general principles but for the sake of better documentation, let's go through an example of creating the shake effect from scratch.

1. Create a new class for your effect. The most important part is here because you need to make sure that your effect class extends from the `CameraEffect` class provided by this package. The `CameraEffect` class is an abstract class that contains the properties and method needed to create an effect.

We also need to import the `EffectOptions` class as every effect has to have these options that define the duration and/or end condition of the effect.

For our shake effect, it would looks like this:

```ts
import { CameraEffect, EffectOptions } from "pixi-effect-camera";

/**
 * Shakes the camera with a random intensity between the specified bounds.
 *
 * This effect is achieved by setting the pivot on the container to a random
 * value determined by the intensity. When the effect is done, the pivot is
 * reset to the initial pivot from before the shake effect was used.
 *
 * @class
 */
class ShakeEffect extends CameraEffect {}
```

2. Create the constructor with the default parameters needed. By default, every effect needs to have a container which specifies the container that the effect needs to run on and an options object which specifies the run duration and/or end condition. This is the same for every effect so let's add it on to our shake effect:

```ts
import type { Container } from "@pixi/display";

import { CameraEffect, EffectOptions } from "pixi-effect-camera";

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
     * Initializes the shake effect on the specified container with the
     * specified parameters.
     *
     * @param {Container} container The container to apply the effect to.
     * @param {CameraEffectOptions} options The options to pass to the effect.
     */
    constructor(container: Container, options: CameraOptions) {
        super(container, options);
    }
}
```

Note that I also imported the `Container` type from `@pixi/display` to use here to ensure that it has correct typing.

3. Add the parameters needed for the custom effect. While a base effect just needs a container and options, chances are that your effect will need its own properties to achieve the effect.

For a shake effect, we need the intensity of the shake, which is provided by the user, and we need a property to keep track of the initial pivot point of the container that was passed to this effect. This is because when we "shake" the container we modify the pivot point so at the end of the shake we want to reset it back to the initial pivot point.

For our example, we need to add the `intensity` as a parameter for the user in the constructor and then set the initial pivot point of the container there as well.

```ts
import type { Container } from "@pixi/display";

import { CameraEffect, EffectOptions } from "pixi-effect-camera";

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
        options: CameraOptions,
        intensity: number,
    ) {
        super(container, options);

        this.intensity = intensity;
        this._initialPivotVector = {
            x: container.pivot.x,
            y: container.pivot.y,
        };
    }
}
```

One thing that might be confusing above is the `Vector2`. This is simply just an interface that's an (x, y) position. You're free to import Vector2 from this library or use your own definition.

Great so now we've defined our properties but we need to actually define what the effect is. If you're using TypeScript, you'll notice an error saying that we need to implement the `update` method of the `CameraEffect` abstract class. This `update` method is what is called by the `Camera` every frame to update the effect.

In our example, we want to choose a random point based on the intensity, and set the container's pivot to that point like so:

```tsx
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
```

**Note:** The update function can also return a boolean. This is useful if you want to stop an effect before it has reached its duration or end condition. An example is our pan effect, which returns `false` once the pan has reached the specified position. While this should happen at around the same time the duration is reached due to how the calculations work out, it won't be precise.

4. At this point the effect is runnable and if you do you'll notice that it does indeed shake the container. However, once it ends you'll notice that the container is in an odd position. This is due to what we talked about earlier with needing to reset the container once the effect is done.

This done through an optional method on the `CameraEffect` class named `onEnd`. This method will run after the effect has been ended due to:

-   Returning `false` from the update function.
-   The duration of the effect has been reached.
-   The end condition of the effect has been reached.

Let's look at how we would reset our effect in the `onEnd` method:

```ts
/**
 * When the shake effect has ended, we reset the pivot of the container to
 * the initial pivot.
 */
onEnd() {
    this.container.pivot.x = this._initialPivotVector.x;
    this.container.pivot.y = this._initialPivotVector.y;
}
```

With that, we have re-created the shake effect! Feel free to experiment with creating your own unique effects and fork/submit a PR to add them to this library.

## License

[MIT](./LICENSE)
