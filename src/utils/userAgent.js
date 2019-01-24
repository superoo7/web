export function isPrerenderer() {
  return navigator && navigator.userAgent && !!navigator.userAgent.match(/Prerender/);
}
