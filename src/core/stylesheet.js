// components/core/stylesheet.js
export function loadStylesheet(shadow, url) {
  const styleLink = document.createElement("link");
  styleLink.setAttribute("rel", "stylesheet");
  styleLink.setAttribute("href", url);
  shadow.appendChild(styleLink);
}
