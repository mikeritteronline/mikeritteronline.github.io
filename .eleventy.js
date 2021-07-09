const Image = require("@11ty/eleventy-img")
const path = require('path')
const output = 'docs';

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/assets/")

    // hat tip: https://www.brycewray.com/posts/2021/04/using-eleventys-official-image-plugin/
    async function imageShortcode(src, alt) {
        let sizes = "(min-width: 1024px) 100vw, 50vw"
        let srcPrefix = `./src/assets/img/`
        /* i want to import images from unsplash
        src = srcPrefix + src
         */
        console.log(`Generating image(s) from:  ${src}`)
        if(alt === undefined) {
            // Throw an error on missing alt (alt="" works okay)
            throw new Error(`Missing \`alt\` on responsive image from: ${src}`)
        }
        let metadata = await Image(src, {
            widths: [600, 900, 1500],
            formats: ['webp', 'jpeg'],
            urlPath: "/images/",
            outputDir: "./" + output + "/images/",
            /* =====
            Now we'll make sure each resulting file's name will
            make sense to you. **This** is why you need
            that `path` statement mentioned earlier.
            ===== */
            filenameFormat: function (id, src, width, format, options) {
                const extension = path.extname(src)
                const name = path.basename(src, extension)
                return `${name}-${width}w.${format}`
            }
        })
        let lowsrc = metadata.jpeg[0]
        return `<picture>
    ${Object.values(metadata).map(imageFormat => {
            return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`
        }).join("\n")}
    <img
      src="${lowsrc.url}"
      alt="${alt}"
      loading="lazy"
      decoding="async"
      class="img-fluid">
  </picture>`
    }

    eleventyConfig.addLiquidShortcode("image", imageShortcode);

    return {
        dir: {
            input: "src",
            output: output
        }
    }
}
