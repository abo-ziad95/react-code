import Breadcrumbs from "@hatech/karma-core/components/breadcrumbs";
import Placeholder from "@hatech/karma-core/components/placeholder";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import { Divider } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import _ from 'lodash';
import * as React from "react";
import { DragDropContext, DraggableLocation, DropResult } from "react-beautiful-dnd";
import useReactRouter from "use-react-router";
import Droppable from "../../components/candidates/droppable";
import {IStep} from "../../components/jobs/droppable";
import { OrganizationContext } from "../../context/organization";
import { GET_CANDIDATES, UPDATE_CANDIDATE } from "../../graphql/candidates";
import { GET_JOB } from "../../graphql/jobs";

export interface ICandidate {
  [key: string]: any;
}
interface IMove {
  [key: string]: ICandidate[];
}

interface IState {
  [key: string]: ICandidate[];
}

/**
 * Board Component renders board with columns and cards.
 * Each column represents Candidate's status.
 * Each card represents Candidate.
 * sortCandidatesByStatus function sorts candidate by status
 * and group them in object, and set this object to state.
 * @param candidatesToSort
 */

const Board: React.FC = () => {
  const updateCandidate = useApolloMutation(UPDATE_CANDIDATE);
  const candidates = useApolloQuery(GET_CANDIDATES);
  const { match } = useReactRouter();
  const organization = React.useContext(OrganizationContext);
  const { jobId } = match.params as { jobId: string };
  const job = useApolloQuery(GET_JOB);
  let hiringSteps = [
    { id: "applied", label: "Applied", priority: 0 },
    { id: "prescreening", label: "Pre-Screened", priority: 1 },
    { id: "interview", label: "Interview", priority: 2 },
    { id: "hired", label: "Hired", priority: 3 }
  ];

  const effect = () => {
    candidates.execute({ variables: { job: jobId } });
    const options = {
      variables: { id: jobId }
    };
    job.execute(options);
  };
  React.useEffect(effect, []);

  const candidatesData = () => {
    if (candidates.data && candidates.data.queryKarmaCandidatesByJobDateCreatedIndex) {
      sortCandidatesByStatus(candidates.data.queryKarmaCandidatesByJobDateCreatedIndex.items);
    }
  };
  React.useEffect(candidatesData, [candidates.data]);

  if (job.data && job.data.getKarmaJobs && job.data.getKarmaJobs.hiring_steps) {
    hiringSteps = job.data.getKarmaJobs.hiring_steps;
  }
  hiringSteps.sort((a: IStep, b: IStep) => a.priority - b.priority);

  const initialState: any = {};
  hiringSteps.map((hiringStep) => (
    initialState[hiringStep.id] = []
  ));
  const [state, setState] = React.useState<IState>(initialState);
  const sortCandidatesByStatus = (candidatesToSort: ICandidate[]) => {
    if(
      candidatesToSort &&
      candidatesToSort.length
    ){
    const values: any = {};
    hiringSteps.map(hiringStep => (values[hiringStep.id] = []));
      candidatesToSort.forEach((candidate: ICandidate) => {
      if (_.some(hiringSteps, { label: candidate.status })) {
        values[findIdByLabel(candidate.status)].push({
          full_name: candidate.applicant.full_name,
          id: candidate.id,
        });
      } else if (candidate.status !== "Denied") {
        values[hiringSteps[0].id].push({
          full_name: candidate.applicant.full_name,
          id: candidate.id,
        });
      }
    });
    setState(values)
    } else {
      const defaultState: any = {};
      hiringSteps.map((hiringStep) => (
        defaultState[hiringStep.label] = []
      ));
      setState(defaultState)
    }
  };

  const findIdByLabel = (label: string) => {
    const hiringStep = hiringSteps.find(step => step.label === label);
    if (!_.isUndefined(hiringStep)) {
      return hiringStep.id;
    } else { return ""; }
  };

  const findLabelById = (id: string) => {
    const hiringStep = hiringSteps.find(step => step.id === id);
    if (!_.isUndefined(hiringStep)) {
      return hiringStep.label;
    }
    else { return id; }
  };

  const onDragEnd = (dropResult: DropResult) => {
    const { source, destination } = dropResult;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const sourceId = source.droppableId;
      const reorderedCandidates = reorder(state[sourceId], source.index, destination.index);

      const destinationId = destination.droppableId;
      state[destinationId] = reorderedCandidates;
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

  const reorder = (candidatesToReorder: ICandidate[], startIndex: number, endIndex: number) => {
    const [removed] = candidatesToReorder.splice(startIndex, 1);
    candidatesToReorder.splice(endIndex, 0, removed);
    return candidatesToReorder;
  };

  const breadcrumbs = [
    {
      path: "/",
      primary: organization.state ? organization.state.name : <Placeholder variant="text" />,
    },
    { primary: "Jobs", path: "/jobs" },
    {
      path: job.data ? `/jobs/${job.data.getKarmaJobs.id}` : "",
      primary: job.data ? job.data.getKarmaJobs.title : "",
    },
    { primary: "Board" }
  ];

  return (
    <div>
      {candidates && candidates.loading && <Placeholder variant={"rect"}/>}
      {candidates && !candidates.loading &&
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="wrapper">
          <Grid className="margin" item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </Grid>
          <Grid  wrap={"nowrap"}  container={true} spacing={3} justify="center">
            {Object.entries(state).map((property: any) => {
              if(property[0] === "denied"){
                return null
              }else {
                return (<Grid item={true} xs={12} sm={6} md={3} lg={3} xl={3} key={property}>
                  <Typography noWrap={true} variant="h6" style={{textTransform: 'capitalize'}}>{findLabelById(property[0])}</Typography>
                  <Divider style={{margin: "12px 0px"}}/>
                  <Droppable droppableId={property[0]} candidates={property[1]}/>
                </Grid>)
              }
            })}
          </Grid>
        </div>
      </DragDropContext>
      }
    </div>
  );
};

export default Board;
