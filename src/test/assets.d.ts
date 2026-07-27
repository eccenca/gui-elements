// Ambient module declarations for static asset imports used by stories/tests.
// The production build (`tsconfig.json` / build configs) only type-checks `src/index.ts`,
// which never imports assets, so these live here for the story/test type-check
// (`tsconfig.test.json`). At runtime Jest maps these to `src/test/fileMock.js` (a string stub)
// and Webpack/Storybook to a URL string — both a `string` default export, mirrored here.
declare module "*.png" {
    const src: string;
    export default src;
}
declare module "*.jpg" {
    const src: string;
    export default src;
}
declare module "*.jpeg" {
    const src: string;
    export default src;
}
declare module "*.gif" {
    const src: string;
    export default src;
}
declare module "*.svg" {
    const src: string;
    export default src;
}
declare module "*.ico" {
    const src: string;
    export default src;
}
declare module "*.webp" {
    const src: string;
    export default src;
}
declare module "*.avif" {
    const src: string;
    export default src;
}
