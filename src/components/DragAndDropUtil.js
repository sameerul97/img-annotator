const grid = 10;

export const getItemStyle = (isDragging, draggableStyle) => {
  if (isDragging.isDropAnimating) {
    return draggableStyle;
  }
  return {
    userSelect: "none",
    margin: `0 0 ${grid}px 0`,
    color: "white",
    background: isDragging ? "lightgreen" : "blue",

    ...draggableStyle,
  };
};

export const getLis2tStyle = (isDragging) => ({
  background: isDragging ? "red" : "lightblue",
  padding: grid,
  margin: "0px 0px",
  width: "100%",
  minHeight: "200px",
  transition: "all .4s ease-in-out",
  // paddingTop: "40px",
});

export const getListStyle = (isDragging) => ({
  background: isDragging ? "red" : "purple",
  padding: grid,
  margin: "0px 0px",
  width: "100%",
  minHeight: "100px",
  transition: "all .4s ease-in-out",
});

export const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}`,
    content: `item ${k + offset}`,
  }));

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const widget_uid = function () {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Move item from one list to other
export const move = (
  source,
  destination,
  draggableId,
  droppableSource,
  droppableDestination
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  var draggedEl = sourceClone.find((el) => el.id === draggableId);

  draggedEl = {
    ...draggedEl,
    id: draggedEl.id + "_" + widget_uid(),
  };

  destClone.splice(droppableDestination.index, 0, draggedEl);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;
  return result;
};
