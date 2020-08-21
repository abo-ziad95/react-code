import React from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import DroppableColumn, { IStep } from "./droppable";

interface IProps {
  hiringSteps: IStep[];
  setHiringSteps: React.Dispatch<React.SetStateAction<IStep[]>>;
}

const reorder = (list: IStep[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  result.forEach((item: IStep, index: number) => {
    item.priority = index;
  });
  return result;
};

const HiringSteps: React.FC<IProps> = props => {
  const onDragEnd = (dropResult: DropResult) => {
    const { source, destination } = dropResult;

    if (!destination) {
      return;
    }

    const steps = reorder(props.hiringSteps, source.index, destination.index);
    props.setHiringSteps(steps);
  };

  const removeStep = (index: number) => () => {
    const steps = props.hiringSteps;
    steps.splice(index, 1);
    props.setHiringSteps([...steps]);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <DroppableColumn droppableId="droppable" steps={props.hiringSteps} removeStep={removeStep} />
    </DragDropContext>
  );
};

export default HiringSteps;
