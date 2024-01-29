const mathjaxPlugin = require("eleventy-plugin-mathjax");

// Source: https://github.com/11ty/eleventy/issues/482

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("media");
    eleventyConfig.addPlugin(mathjaxPlugin);

    return {
        dir: {
            input: "src",
            output: "www",
        }
    };
};