import sanitizeHtml from "sanitize-html";

const ROUTES = {
  4005: "/comic/character/",
  4050: "/comic/",
  4000: "/comic/issue/",
  4040: "/comic/person/",
};

function rewriteHref(href = "") {
  const m = href.match(/\/(40\d\d)-(\d+)\/?/);
  return m && ROUTES[m[1]] ? `${ROUTES[m[1]]}${m[2]}` : null;
}

export function cleanComicHtml(html) {
  return sanitizeHtml(html || "", {
    allowedTags: [
      "p", "br", "b", "strong", "i", "em", "u", "ul", "ol", "li",
      "h2", "h3", "h4", "a", "img", "figure", "figcaption", "blockquote",
    ],
    allowedAttributes: {
      a: ["href"],
      img: ["src", "alt"],
      // keep ALL classes and the data-* attributes on figures
      figure: ["class", "data-align", "data-size"],
    },
    // no allowedClasses here, so every class on the figure is kept
    transformTags: {
      img: (tagName, attribs) => ({
        tagName,
        attribs: {
          src:
            attribs["data-src"] ||
            attribs["data-original"] ||
            attribs["data-img-src"] ||
            attribs.src ||
            "",
          alt: attribs.alt || "",
        },
      }),
      a: (tagName, attribs) => {
        const href = rewriteHref(attribs.href);
        return href
          ? { tagName: "a", attribs: { href } }
          : { tagName: "span", attribs: {} };
      },
    },
  });
}