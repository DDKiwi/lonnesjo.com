import CleanCSS from "clean-css";
import responsiveImage from "./src/_shortcodes/image.js";
import breadcrumbs from "./src/_shortcodes/breadcrumbs.js";

const config = (eleventy) => {
  // Collection for posts
  eleventy.addCollection("posts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/posts/*.liquid")
      .sort((a, b) => b.date - a.date); // newest first
  });

  // Minify CSS
  eleventy.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Passthrough copy
  eleventy.addPassthroughCopy("CNAME");
  eleventy.addPassthroughCopy("src/assets/favicon/");
  eleventy.addPassthroughCopy("src/assets/js/");
  eleventy.addPassthroughCopy("src/assets/images/source");
  eleventy.addPassthroughCopy("src/robots.txt");

  // Shortcodes
  eleventy.addAsyncShortcode("image", responsiveImage);
  eleventy.addShortcode("breadcrumbs", breadcrumbs);

  // Options
  return {
    dir: { input: "src" },
  };
};

export default config;

/*

Re-run Eleventy when you save

# Add a web server to apply changes and
# refresh automatically. We’ll also --watch for you.
npx @11ty/eleventy --serve

# Change the web server’s port—use localhost:8081
npx @11ty/eleventy --serve --port=8081

# Watch and re-run when files change, without the web server.
npx @11ty/eleventy --watch

*/
