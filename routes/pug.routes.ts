/**
 * Pug Routing Configuration
 * ===========================
 *
 * This file defines how Pug templates are compiled to HTML files.
 * It gives you complete control over your site's URL structure.
 *
 * IMPORTANT: This is a build-time configuration file. It should NOT be deployed
 * to production as it's only used during development and build processes.
 *
 *
 * How It Works
 * ------------
 * Each route maps a source Pug file to an output HTML file:
 *
 *   'pug/source.pug' => 'output.html'
 *
 *
 * Route Types
 * -----------
 *
 * 1. Root-level pages:
 *    'pug/index.pug': 'index.html'
 *    Creates: /index.html (accessible at /)
 *
 * 2. Nested pages (SEO-friendly URLs):
 *    'pug/about.pug': 'about/index.html'
 *    Creates: /about/index.html (accessible at /about/)
 *
 * 3. Deep nesting:
 *    'pug/blog/post.pug': 'blog/post/index.html'
 *    Creates: /blog/post/index.html (accessible at /blog/post/)
 *
 * 4. Custom structures:
 *    'pug/contact.pug': 'get-in-touch.html'
 *    Creates: /get-in-touch.html (accessible at /get-in-touch.html)
 *
 *
 * Partial Files
 * -------------
 * Files starting with underscore (_) are automatically treated as partials
 * and do NOT need routes. They're meant to be included in other templates.
 *
 * Examples: _head.pug, _footer.pug, _mixins.pug
 *
 *
 * Adding New Pages
 * ----------------
 * 1. Create your Pug file (e.g., pug/services.pug)
 * 2. Add a route below
 * 3. Run `npm run dev` or `npm run build`
 * 4. Your HTML will be generated automatically
 *
 *
 * Best Practices
 * --------------
 * - Use index.html for folder-based routing (/about/ instead of /about.html)
 * - Keep route keys relative to project root
 * - Keep output paths relative to project root
 * - Comment out unused routes instead of deleting them
 * - Group related routes together for clarity
 */

export interface RouteMap {
  [key: string]: string;
}

export const routes: RouteMap = {
  // Main presentation
  "pug/index.pug": "index.html",

  // CSS Demos
  "demos/pug/container-queries-1.pug": "demos/container-queries-1.html",
  "demos/pug/container-queries-2.pug": "demos/container-queries-2.html",
  "demos/pug/container-queries-3.pug": "demos/container-queries-3.html",
  "demos/pug/container-queries-4.pug": "demos/container-queries-4.html",
  "demos/pug/css-variables-1.pug": "demos/css-variables-1.html",
  "demos/pug/has-1.pug": "demos/has-1.html",
  "demos/pug/has-2.pug": "demos/has-2.html",
  "demos/pug/has-3.pug": "demos/has-3.html",
  "demos/pug/has-4.pug": "demos/has-4.html",
  "demos/pug/has-5.pug": "demos/has-5.html",
  "demos/pug/scroll-animation-1.pug": "demos/scroll-animation-1.html",
  "demos/pug/scroll-animation-2.pug": "demos/scroll-animation-2.html",
  "demos/pug/scroll-animation-3.pug": "demos/scroll-animation-3.html",
  "demos/pug/starting-style-1.pug": "demos/starting-style-1.html",
  "demos/pug/starting-style-2.pug": "demos/starting-style-2.html",
  "demos/pug/starting-style-3.pug": "demos/starting-style-3.html",
  "demos/pug/text-wrap-1.pug": "demos/text-wrap-1.html",
  "demos/pug/toggle-1.pug": "demos/toggle-1.html",
  "demos/pug/toggle-2.pug": "demos/toggle-2.html",
  "demos/pug/toggle-3.pug": "demos/toggle-3.html",
  "demos/pug/toggle-4.pug": "demos/toggle-4.html",
};

export default routes;
