import React from "react";
import { Droppable, DroppableProvided, DroppableStateSnapshot } from "react-beautiful-dnd";
import { ICandidate } from "../../context/candidate";
import Draggable from "./draggable";

interface IProps {
  droppableId: string;
  candidates: ICandidate[];
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
        <div  id={props.droppableId} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
          {props.candidates.map((candidate, index) => (
            <Draggable index={index} key={candidate.id} candidate={candidate} />
          ))}
        </div>
      )}
    </Droppable>
  );
};

export default DroppableColumn;
