/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    setupFiles: ["jest-canvas-mock"],
};
