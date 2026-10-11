// Maps each source Pug file to the HTML file it builds. Register every page and demo here; _-prefixed partials are included, never routed.

export interface RouteMap {
  [key: string]: string;
}

export const routes: RouteMap = {
  // Main presentation
  "pug/index.pug": "index.html",

  // Demos
  "demos/pug/sample-demo.pug": "demos/sample-demo.html",
};

export default routes;
