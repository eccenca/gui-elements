import { HandleProps } from "react-flow-renderer";

const partitionHandles = (
  handles: HandleProps[]
): [HandleProps[], HandleProps[], HandleProps[]] => {
  const leftHandles: HandleProps[] = [],
    rightHandles: HandleProps[] = [],
    topHandles: HandleProps[] = [];
  handles.forEach((handle) =>
    handle.position === "left"
      ? leftHandles.push(handle)
      : handle.position === "right"
      ? rightHandles.push(handle)
      : topHandles.push(handle)
  );
  return [leftHandles, rightHandles, topHandles];
};


export default {
   partitionHandles
}