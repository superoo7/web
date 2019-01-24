export function isPrerenderer() {
  return navigator.userAgent && !!navigator.userAgent.match(/Prerender/);
}
