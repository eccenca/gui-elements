/** Wrapper for an onClick handler on link-like components, i.e. that navigate to a different URL on click.
 * Opens a link (url) in a new tab when CMD or CTRL key is pressed at click time. */
export const openInNewTab = (
    event: React.MouseEvent<HTMLAnchorElement>,
    handler?: (e: React.MouseEvent<HTMLAnchorElement>) => void,
    url?: string
) => {
  //if ctrl key or cmd key bypass click handler and delegation open in the background new tab
  if (url && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    event.nativeEvent.stopImmediatePropagation();
    event.stopPropagation();
    window.open(url, "_blank");
  } else if(handler) {
    handler(event);
  }
};
