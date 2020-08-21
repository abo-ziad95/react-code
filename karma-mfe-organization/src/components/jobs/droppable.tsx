import List from "@material-ui/core/List";
import React from "react";
import { Droppable, DroppableProvided, DroppableStateSnapshot } from "react-beautiful-dnd";
import Draggable from "./draggable";

export interface IStep {
  priority: number;
  id: string;
  label: string;
  __typename?: string
}

interface IProps {
  droppableId: string;
  steps: IStep[];
  removeStep(index: number): () => void;
}

const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
  background: isDraggingOver ? "lightblue" : "none",
  height: "100%",
  width: "100%"
});

const DroppableColumn = (props: IProps) => {
  return (
    <Droppable droppableId={props.droppableId}>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <List ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
          {props.steps.map((step, index) => (
            <Draggable index={index} key={step.id} step={step} removeStep={props.removeStep} />
          ))}
          {provided.placeholder}
        </List>
      )}
    </Droppable>
  );
};

export default DroppableColumn;
