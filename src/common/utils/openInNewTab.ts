export const openInNewTab = (event, handler, url?:string) => {
  //if ctrl key or cmd key bypass click handler and delegation open in the background new tab
  if (url && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    event.nativeEvent.stopImmediatePropagation();
    event.stopPropagation();
    window.open(url, "_blank");
  } else {
    handler(event);
  }
};
