import sinon from "sinon";
import * as PIXI from "pixi.js-legacy";

import {
    Camera,
    ShakeEffect,
    FadeEffect,
    PanEffect,
    RotateEffect,
    ZoomEffect,
} from "../src/index";

let clock: sinon.SinonFakeTimers;

describe("Running effects", () => {
    test("creating the camera with no effects", () => {
        const camera = new Camera();
        expect(camera.effects.length).toBe(0);
    });
});

describe("Running effects", () => {
    beforeEach(() => (clock = sinon.useFakeTimers()));
    afterEach(() => clock.restore());

    it("should set the started and last ran timestamps on the effect once the effect is run", () => {
        const app = new PIXI.Application();

        const camera = new Camera();
        const shakeEffect = new ShakeEffect(app.stage, { duration: 10000 }, 5);
        camera.addEffect(shakeEffect);

        app.ticker.add((delta) => camera.update(delta));

        clock.tick(2000);

        expect(shakeEffect.startedTimeStamp).toBeGreaterThan(0);
        expect(shakeEffect.lastRanTimeStamp).toBe(2000);
    });

    it("should have a `lastRanTimestamp` of 2000 after ticking 2 seconds", () => {
        const app = new PIXI.Application();

        const camera = new Camera();
        const shakeEffect = new ShakeEffect(app.stage, { duration: 10000 }, 5);
        camera.addEffect(shakeEffect);

        app.ticker.add((delta) => camera.update(delta));

        clock.tick(2000);

        expect(shakeEffect.lastRanTimeStamp).toBe(2000);
    });

    it("should remove the effect after its duration has been reached", () => {
        const app = new PIXI.Application();

        const camera = new Camera();
        const shakeEffect = new ShakeEffect(app.stage, { duration: 2000 }, 5);
        camera.addEffect(shakeEffect);

        app.ticker.add((delta) => camera.update(delta));

        clock.tick(3000);

        expect(camera.effects.length).toBe(0);
    });

    it("should remove the effect when its end condition has been reached.", () => {
        const app = new PIXI.Application();

        let i = 0;

        const camera = new Camera();
        const shakeEffect = new ShakeEffect(
            app.stage,
            { duration: 10000, endCondition: () => i === 100 },
            5,
        );
        camera.addEffect(shakeEffect);

        app.ticker.add((delta) => {
            camera.update(delta);
            i++;
        });

        clock.tick(3000);

        expect(camera.effects.length).toBe(0);
    });
});

describe("Shake effect", () => {
    beforeEach(() => (clock = sinon.useFakeTimers()));
    afterEach(() => clock.restore());

    it("should reset the pivot of the container when the shake effect ends", () => {
        const app = new PIXI.Application();

        const appStageInitialPivotX = app.stage.pivot.x;
        const appStageInitialPivotY = app.stage.pivot.y;

        const camera = new Camera();
        const shakeEffect = new ShakeEffect(app.stage, { duration: 2000 }, 5);
        camera.addEffect(shakeEffect);

        app.ticker.add((delta) => camera.update(delta));

        clock.tick(3000);

        expect(app.stage.pivot.x).toBe(appStageInitialPivotX);
        expect(app.stage.pivot.y).toBe(appStageInitialPivotY);
    });
});

describe("Fade effect", () => {
    beforeEach(() => (clock = sinon.useFakeTimers()));
    afterEach(() => clock.restore());

    it("should fade the camera to black over the duration of the effect", () => {
        const app = new PIXI.Application();
        const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);

        const camera = new Camera();
        const fadeEffect = new FadeEffect(
            app.stage,
            { duration: 2000 },
            sprite,
            0x000000,
            1,
        );
        camera.addEffect(fadeEffect);

        app.ticker.add((delta) => camera.update(delta));

        clock.tick(1000);
        expect(sprite.alpha).toBeGreaterThan(0.4);
        expect(sprite.tint).toBe(0x000000);

        clock.tick(2000);
        expect(sprite.alpha).toBeGreaterThan(0.9);
        expect(sprite.tint).toBe(0x000000);
    });
});

describe("Pan effect", () => {
    beforeEach(() => (clock = sinon.useFakeTimers()));
    afterEach(() => clock.restore());

    it("should pan the camera to the specified location", () => {
        const app = new PIXI.Application();

        const camera = new Camera();
        const panEffect = new PanEffect(
            app.stage,
            { duration: 2000 },
            { x: 50, y: 150 },
        );
        camera.addEffect(panEffect);

        app.ticker.add((delta) => camera.update(delta));

        clock.tick(3000);

        expect(app.stage.pivot.x).toBeGreaterThan(45);
        expect(app.stage.pivot.y).toBeGreaterThan(145);
    });
});

describe("Rotate effect", () => {
    beforeEach(() => (clock = sinon.useFakeTimers()));
    afterEach(() => clock.restore());

    it("should rotate the camera by 45 degrees", () => {
        const app = new PIXI.Application();

        const camera = new Camera();
        const rotateEffect = new RotateEffect(
            app.stage,
            { duration: 2000 },
            45,
        );
        camera.addEffect(rotateEffect);

        app.ticker.add((delta) => camera.update(delta));

        clock.tick(3000);

        expect(app.stage.angle).toBeGreaterThan(40);
        expect(app.stage.angle).toBeLessThan(50);
    });
});

describe("Zoom effect", () => {
    beforeEach(() => (clock = sinon.useFakeTimers()));
    afterEach(() => clock.restore());

    it("should zoom in on the specified location", () => {
        const app = new PIXI.Application();

        const camera = new Camera();
        const zoomEffect = new ZoomEffect(
            app.stage,
            { duration: 2000 },
            { x: 2, y: 2 },
        );
        camera.addEffect(zoomEffect);

        app.ticker.add((delta) => camera.update(delta));

        clock.tick(3000);

        expect(app.stage.scale.x).toBeGreaterThan(1.9);
        expect(app.stage.scale.y).toBeLessThan(2.1);
    });
});

export {};
