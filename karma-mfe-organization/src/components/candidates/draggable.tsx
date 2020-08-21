import {Typography} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import React from "react";
import {Draggable, DraggableProvided, DraggableStateSnapshot, DraggingStyle, NotDraggingStyle} from "react-beautiful-dnd";
import {ICandidate} from "../../views/candidates/board";
import CandidateStatus from "./candidateStatus";

const getItemStyle = (
  isDragging: boolean,
  draggableStyle?: DraggingStyle | NotDraggingStyle
): React.CSSProperties => {
  return {
    background: isDragging ? "lightgreen" : "#fefefe",
    display: 'flex',
    marginBottom: 8,
    userSelect: "none",
    ...draggableStyle
  };
};

interface IProps {
  index: number;
  candidate: ICandidate;
}

const draggable: React.FC<IProps> = props => {
  return (
    <Draggable draggableId={props.candidate.id} index={props.index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
        const draggableStyle = getItemStyle(snapshot.isDragging, provided.draggableProps.style);
        return (
          <Card
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={draggableStyle}
            id={props.candidate.id}
          >
            <Divider />
            <CardContent style={{ width: "100%", display: "flex", padding: 12 }}>
              <Typography  variant="body2" style={{ flex: 1 }}>{props.candidate.full_name}</Typography>
              <CandidateStatus candidate={props.candidate}/>
            </CardContent>
          </Card>
        );
      }}
    </Draggable>
  );
};

export default draggable;
