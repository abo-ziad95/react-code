import {NotificationContext} from "@hatech/karma-core/context/notifications";
import useApolloMutation from "@hatech/karma-core/hooks/useApolloMutation";
import React from "react";
import useReactRouter from "use-react-router";
import {Switch} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import {GET_ORGANIZATION_MEMBERS, UPDATE_ORGANIZATION_MEMBER} from "../../../graphql/organization";

interface IMember {
  [key: string]: any;
}

interface IProps {
  member: IMember;
}

/**
 * MemberStatus component returns Member status info
 * with switch to change status
 */
const MemberStatus: React.FC <IProps> = props => {
  const notification = React.useContext(NotificationContext);
  const { match } = useReactRouter();
  const params = match.params as { organizationId: string; jobId: string };
  const organizationId = params.organizationId;
  const variables = {
    organization: organizationId
  };
  const refetchQuery = () => [{query: GET_ORGANIZATION_MEMBERS, variables: variables}];
  const updateMember = useApolloMutation(UPDATE_ORGANIZATION_MEMBER, {refetchQueries: refetchQuery()});

  const updateMemberEffect = () => {
    if (updateMember.data) {
      notification.dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          message: "Member has been updated"
        }
      });
    }
  };
  React.useEffect(updateMemberEffect, [updateMember.data]);

  function handleChange(
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
    id: string,
    status: string
  ) {
    const variables = {
      input: {
        id: id,
        status: status === "active" ? "inactive" : "active"
      }
    };
    updateMember.execute({ variables });
  }

  return (
    <React.Fragment>
      <Tooltip title={props.member.status === "active" ? "Deactivate Member" : "Activate Member"}>
        <Switch
          checked={props.member.status === "active"}
          onChange={event => handleChange(event, props.member.id, props.member.status)}
          id={`member-status-change-${props.member.id}`}
        />
      </Tooltip>
    </React.Fragment>
  );
};

export default MemberStatus;
