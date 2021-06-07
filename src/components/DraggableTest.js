import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  HeaderWidget,
  ImageWidget,
  ButtonWidget,
  VideoWidget,
} from "./Widgets";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const grid = 10;

const getItemStyle = (isDragging, draggableStyle) => {
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

const getLis2tStyle = (isDragging) => ({
  background: isDragging ? "red" : "lightblue",
  padding: grid,
  margin: "0px 0px",
  width: "100%",
  minHeight: "200px",
  transition: "all .4s ease-in-out",
});

const getListStyle = (isDragging) => ({
  background: isDragging ? "red" : "purple",
  padding: grid,
  margin: "0px 0px",
  width: "100%",
  minHeight: "100px",
  transition: "all .4s ease-in-out",
});

const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}`,
    content: `item ${k + offset}`,
  }));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const widget_uid = function () {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Move item from one list to other
const move = (
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
  //   console.log(destClone);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;
  return result;
};

// class MultipleDragList extends Component {
function MultipleDragList1(props) {
  // function MultipleDragList(props) {
  const [widgets, setWidgets] = useState();
  // [
  // { id: "widget_id_1", widgetId: 0, widget: <HeaderWidget /> },
  // { id: "widget_id_2", widgetId: 1, widget: <ImageWidget /> },
  // { id: "widget_id_3", widgetId: 2, widget: <VideoWidget /> },
  // { id: "widget_id_4", widgetId: 3, widget: <ButtonWidget /> },
  // ]

  const [selectedWidgets, setSelectedWidgets] = useState();
  // [
  // { id: "widget_id_21", widgetId: 1, widget: <ImageWidget /> },
  // ]

  const [ready, setReady] = useState(false);

  // Editor state
  const [editorState, setEditorState] = useState({
    value: EditorState.createEmpty(),
  });
  const [readMode, setReadMode] = useState(false);

  const onEditorStateChange = (editorState) => {
    setEditorState({
      value: editorState,
    });

    localStorage.setItem(
      "editorState",
      JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    );
  };

  useEffect(() => {
    let editorStateFound = localStorage.getItem("editorState");

    if (editorStateFound) {
      setEditorState({
        value: EditorState.createWithContent(
          convertFromRaw(JSON.parse(editorStateFound))
        ),
      });
    } else {
      setEditorState({
        value: EditorState.createEmpty(),
      });
    }

    setWidgets(props.widgets);
    setSelectedWidgets(props.selectedWidgets);
    setReady(true);
    return () => {
      // cleanup
    };
  }, [props.selectedWidgets, props.widgets]);
  // Defining unique ID for multiple lists
  const id2List = {
    droppable: widgets,
    droppable2: selectedWidgets,
  };

  const getList = (id) => id2List[id];

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    // Sorting in same list
    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      );
      // let state = { items };

      // if (source.droppableId === "droppable2") {
      //   state = { selectedWidgets: items };
      // }
      setSelectedWidgets(items);
    }
    // Moving between columns
    else {
      const result = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        draggableId,
        source,
        destination
      );

      setWidgets(result.droppable);
      setSelectedWidgets(result.droppable2);
    }
  };

  return (
    <div className="row py-2 mx-auto smoothTransition">
      {ready && (
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="col-md-4 smoothTransition">
              <Droppable droppableId="droppable" isDropDisabled={true}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    //   isDraggingOver={snapshot.isDraggingOver}
                    style={getListStyle()}
                    className="col-12"
                  >
                    {widgets.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index + 1}
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
                              <div>{item.widget}</div>
                            </div>
                            {snapshot.isDragging && (
                              <div
                                style={getItemStyle(
                                  provided.draggableProps.style
                                )}
                                className="popupWidget"
                              >
                                <div className="popupWidget">{item.widget}</div>
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

            <div className="col-md-4 smoothTransition ">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={(e) => setReadMode(false)}
              >
                content edit
              </button>
              <p>Pointless column</p>
              <Editor
                readOnly={readMode}
                toolbarHidden={readMode}
                editorState={editorState.value}
                toolbarClassName="smoothTransition bg-info"
                wrapperClassName="smoothTransition demo-wrapper"
                editorClassName="smoothTransition bg-light demo-editor-custom"
                onEditorStateChange={onEditorStateChange}
                toolbar={{
                  options: ["inline", "blockType", "textAlign", "link"],
                  inline: {
                    inDropdown: false,
                    className: "smoothTransition bg-info text-white rounded-0",
                    component: undefined,
                    dropdownClassName: "undefined",
                    options: ["bold", "italic", "underline"],
                  },
                  //
                  blockType: {
                    inDropdown: false,
                    options: ["Normal", "H1", "H2", "H3", "H4", "Blockquote"],
                    className: undefined,
                    component: undefined,
                    dropdownClassName: undefined,
                  },
                  textAlign: {
                    inDropdown: false,
                    className: undefined,
                    component: undefined,
                    dropdownClassName: undefined,
                    options: ["left", "center", "right"],
                  },
                  link: {
                    inDropdown: false,
                    className: undefined,
                    component: undefined,
                    popupClassName: undefined,
                    dropdownClassName: undefined,
                    showOpenOptionOnHover: true,
                    defaultTargetOption: "_self",
                    options: ["link", "unlink"],
                    linkCallback: undefined,
                  },
                }}
              />

              <textarea
                disabled
                value={draftToHtml(
                  convertToRaw(editorState.value.getCurrentContent())
                )}
              />
            </div>

            <div className="col-md-4 smoothTransition ">
              <Droppable droppableId="droppable2">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getLis2tStyle(snapshot.isDraggingOver)}
                  >
                    {selectedWidgets.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            {item.widget}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
        </>
      )}
    </div>
  );
}
function MultipleDragList(props) {
  const [buttonState, SetbuttonState] = useState("notclicked");
  const [editorState, setEditorState] = useState({
    value: EditorState.createEmpty(),
  });

  const onEditorStateChange = (editorState) => {
    // console(editorState);
    setEditorState({
      value: editorState,
    });

    localStorage.setItem(
      "buttonState_Paragraph",
      JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    );
  };

  useEffect(() => {
    var defaultText = {
      blocks: [
        {
          key: "7pjmv",
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, assumenda illo, vitae maiores itaque aliquid ad voluptates sit hic beatae, non tempora rerum ipsa? Maxime?",
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: { "text-align": "left" },
        },
      ],
      entityMap: {},
    };
    let editorStateFound = localStorage.getItem("editorState_Header");

    if (editorStateFound) {
      setEditorState({
        value: EditorState.createWithContent(
          convertFromRaw(JSON.parse(editorStateFound))
        ),
      });
    } else {
      setEditorState({
        value: EditorState.createWithContent(convertFromRaw(defaultText)),
      });
    }
  }, []);
  return (
    <div className="text-dark">
      <Editor
        readOnly={false}
        toolbarHidden={true}
        handlePastedText={() => false}
        editorState={editorState.value}
        toolbarClassName="bg-info"
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor-custom"
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          options: [],
          inline: {
            inDropdown: false,
            className: "bg-info rounded-0",
            component: undefined,
            dropdownClassName: "undefined",
            options: ["bold", "italic", "underline"],
          },
          textAlign: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ["left", "center", "right"],
          },
        }}
      />
      <button
        onClick={(e) => {
          SetbuttonState("clicked");
          // props.setSomeUselessProp(30 * props.id);
          // setPopupEditModeSelected(true);
        }}
      >
        {buttonState}
      </button>
    </div>
  );
}
export default MultipleDragList;
