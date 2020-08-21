import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import CancelIcon from "@material-ui/icons/Cancel";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import React from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DraggingStyle,
  NotDraggingStyle
} from "react-beautiful-dnd";
import { IStep } from "./droppable";

const getItemStyle = (
  isDragging: boolean,
  draggableStyle?: DraggingStyle | NotDraggingStyle
): React.CSSProperties => {
  return {
    background: isDragging ? "lightgreen" : "#fefefe",
    marginBottom: 8,
    userSelect: "none",
    ...draggableStyle
  };
};

interface IProps {
  index: number;
  step: IStep;
  removeStep(index: number): () => void;
}

const isDragDisabled = (step: IStep) => {
  const disabledSteps = ["Apply", "Pre-Screen", "Hired"];
  return disabledSteps.indexOf(step.label) !== -1;
};

const draggable: React.FC<IProps> = props => {
  return (
    <Draggable
      isDragDisabled={isDragDisabled(props.step)}
      draggableId={props.step.id}
      index={props.index}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
        const draggableStyle = getItemStyle(snapshot.isDragging, provided.draggableProps.style);
        return (
          <ListItem
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={draggableStyle}
            divider={true}
            id={`${props.step.label}-drag`}
          >
            <ListItemAvatar>
              <DragIndicatorIcon color={isDragDisabled(props.step) ? "disabled" : "inherit"} />
            </ListItemAvatar>
            <ListItemText primary={props.step.label} />
            <ListItemSecondaryAction id={`${props.step.label}-remove`} onClick={props.removeStep(props.index)}>
              {!isDragDisabled(props.step) && <CancelIcon color="disabled" />}
            </ListItemSecondaryAction>
          </ListItem>
        );
      }}
    </Draggable>
  );
};

export default draggable;
