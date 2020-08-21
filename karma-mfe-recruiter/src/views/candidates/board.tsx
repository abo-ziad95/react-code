import { Divider } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { DragDropContext, DraggableLocation, DropResult } from "react-beautiful-dnd";
import Droppable from "../../components/candidates/droppable";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import { GET_CANDIDATES, UPDATE_CANDIDATE } from "../../graphql/candidates";
import useReactRouter from "use-react-router";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import _ from "lodash";
import { capitalize } from "@material-ui/core/utils";
import Placeholder from "@hatech/karma-core/components/placeholder";

export interface ICandidate {
  [key: string]: any;
}
interface IMove {
  [key: string]: ICandidate[];
}

interface IState {
  [key: string]: ICandidate[];
}

interface IStep {
  priority: number;
  label: string;
  id: string;
}

const Board: React.FC = () => {
  const updateCandidate = useApolloMutation(UPDATE_CANDIDATE);
  const candidates = useApolloQuery(GET_CANDIDATES);
  const { match } = useReactRouter();
  const { jobId } = match.params as { jobId: string };
  let hiringSteps = [
    { id: "applied", label: "Applied", priority: 0 },
    { id: "prescreening", label: "Pre-Screened", priority: 1 },
    { id: "interview", label: "Interview", priority: 2 },
    { id: "hired", label: "Hired", priority: 3 }
  ];

  const effect = () => {
    candidates.execute({ variables: { job: jobId } });
  };
  React.useEffect(effect, []);

  const candidatesData = () => {
    if (candidates.data && candidates.data.queryKarmaCandidatesByJobDateCreatedIndex) {
      sortCandidatesByStatus(candidates.data.queryKarmaCandidatesByJobDateCreatedIndex.items);
    }
  };
  React.useEffect(candidatesData, [candidates.data]);

  if (
    candidates.data &&
    candidates.data.queryKarmaCandidatesByJobDateCreatedIndex &&
    candidates.data.queryKarmaCandidatesByJobDateCreatedIndex.items &&
    candidates.data.queryKarmaCandidatesByJobDateCreatedIndex.items[0] &&
    candidates.data.queryKarmaCandidatesByJobDateCreatedIndex.items[0].job &&
    candidates.data.queryKarmaCandidatesByJobDateCreatedIndex.items[0].job.hiring_steps
  ) {
    hiringSteps =
      candidates.data.queryKarmaCandidatesByJobDateCreatedIndex.items[0].job.hiring_steps;
  }

  hiringSteps.sort((a: IStep, b: IStep) => a.priority - b.priority);

  let initialState: IState = {};
  hiringSteps.map((hiringStep: IStep) => (initialState[hiringStep.id] = []));

  const [state, setState] = React.useState<IState>(initialState);
  const sortCandidatesByStatus = (candidates: ICandidate[]) => {
    const values: IState = {};
    hiringSteps.map((hiringStep: IStep) => (values[hiringStep.id] = []));

    candidates.forEach((candidate: ICandidate) => {
      if (_.some(hiringSteps, { label: candidate.status })) {
        values[findIdByLabel(candidate.status)].push({
          id: candidate.id,
          full_name: candidate.applicant && candidate.applicant.full_name
        });
      } else if (candidate.status !== "Denied") {
        values[hiringSteps[0].id].push({
          id: candidate.id,
          full_name: candidate.applicant && candidate.applicant.full_name
        });
      }
    });
    setState(values);
  };
  const findLabelById = (id: string) => {
    let hiringStep = hiringSteps.find(hiringStep => hiringStep.id === id);
    if (!_.isUndefined(hiringStep)) {
      return hiringStep.label;
    } else return "";
  };
  const findIdByLabel = (label: string) => {
    let hiringStep = hiringSteps.find(hiringStep => hiringStep.label === label);
    if (!_.isUndefined(hiringStep)) {
      return hiringStep.id;
    } else return "";
  };

  const onDragEnd = (dropResult: DropResult) => {
    const { source, destination } = dropResult;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const sourceId = source.droppableId;
      const candidates = reorder(state[sourceId], source.index, destination.index);

      const destinationId = destination.droppableId;
      state[destinationId] = candidates;
      setState(state);
    } else {
      const sourceId = source.droppableId;
      const sourceCandidates = state[sourceId];
      const destinationId = destination.droppableId;
      const result: IMove = move(sourceCandidates, state[destinationId], source, destination);
      const input = {
        id: dropResult.draggableId,
        status: findLabelById(destination.droppableId)
      };
      const variables = { input };
      updateCandidate.execute({ variables });
      setState({ ...state, ...result });
    }
  };

  const move = (
    source: ICandidate[],
    destination: ICandidate[],
    droppableSource: DraggableLocation,
    droppableDestination: DraggableLocation
  ) => {
    const [removed] = source.splice(droppableSource.index, 1);
    destination.splice(droppableDestination.index, 0, removed);
    return {
      [droppableSource.droppableId]: source,
      [droppableDestination.droppableId]: destination
    };
  };

  const reorder = (candidates: ICandidate[], startIndex: number, endIndex: number) => {
    const [removed] = candidates.splice(startIndex, 1);
    candidates.splice(endIndex, 0, removed);
    return candidates;
  };

  return (
    <div>
      {candidates && candidates.loading && <Placeholder variant={"rect"} />}
      {candidates && !candidates.loading && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="wrapper">
            <Grid wrap={"nowrap"} container={true} spacing={3} justify="center">
              {Object.entries(state).map((property: any) => {
                if (property[0] === "denied") {
                  return null;
                } else {
                  return (
                    <Grid item={true} xs={12} sm={6} md={3} lg={3} xl={3} key={property}>
                      <Typography noWrap={true} variant="h6">{capitalize(findLabelById(property[0]))}</Typography>
                      <Divider style={{ margin: "12px 0px" }} />
                      <Droppable droppableId={property[0]} candidates={property[1]} />
                    </Grid>
                  );
                }
              })}
            </Grid>
          </div>
        </DragDropContext>
      )}
    </div>
  );
};

export default Board;
