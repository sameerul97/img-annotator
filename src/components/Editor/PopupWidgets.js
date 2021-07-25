import React, { useState, useEffect } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Widgets } from "../Widgets";
import { motion } from "framer-motion";

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => {
  if (isDragging.isDropAnimating) {
    return draggableStyle;
  }
  return {
    userSelect: "none",
    margin: `0 0 ${grid}px 0`,
    ...draggableStyle,
  };
};

const getListStyle = (isDraggingOver) => ({
  width: isDraggingOver ? "400px" : "200px",
  margin: "8px 0px",
});

function PopupWidgets(props) {
  const [showWidgetPanel, setShowWidgetPanel] = useState(false);
  const [widgets, setWidgets] = useState();

  useEffect(() => {
    setWidgets(Widgets);

    setTimeout(() => setShowWidgetPanel(true), 100);
  }, []);

  return (
    <>
      {showWidgetPanel && (
        <div className="row py-2 mx-auto">
          <Droppable droppableId="droppable" isDropDisabled={true}>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle()}
                className="col-12"
              >
                {widgets.map((widget, widgetIndex) => (
                  <Draggable
                    key={widget.id}
                    draggableId={widget.id}
                    index={widgetIndex}
                    isDragDisabled={props.newWidgetBeingAdded}
                  >
                    {(provided, snapshot) => (
                      <React.Fragment>
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.1 }}
                          >
                            {widget.widget}
                          </motion.div>
                        </div>
                        {snapshot.isDragging && (
                          <div
                            style={getItemStyle(provided.draggableProps.style)}
                            className="popupWidget"
                          >
                            {widget.widget}
                          </div>
                        )}
                      </React.Fragment>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </>
  );
}

export default PopupWidgets;
