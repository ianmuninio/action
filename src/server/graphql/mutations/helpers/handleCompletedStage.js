import {GROUP, REFLECT, RETROSPECTIVE, VOTE} from 'universal/utils/constants';
import addEntitiesToReflections from 'server/graphql/mutations/helpers/addEntitiesToReflections';
import addDiscussionTopics from 'server/graphql/mutations/helpers/addDiscussionTopics';
import addDefaultGroupTitles from 'server/graphql/mutations/helpers/addDefaultGroupTitles';

/*
 * handle side effects when a stage is completed
 * returns an object if the side effect is necessary before the navigation is complete
 * otherwise, returns an empty object
 */
const handleCompletedRetrospectiveStage = async (stage, meeting, dataLoader) => {
  if (stage.phaseType === REFLECT) {
    // don't wait for the response from google
    addEntitiesToReflections(meeting.id);
    return {};
  } else if (stage.phaseType === GROUP) {
    const data = await addDefaultGroupTitles(meeting);
    return {[GROUP]: data};
  } else if (stage.phaseType === VOTE) {
    // mutates the meeting discuss phase.stages array
    const data = await addDiscussionTopics(meeting, dataLoader);
    return {[VOTE]: data};
  }
  return {};
};


const handleCompletedStage = async (stage, meeting, dataLoader) => {
  if (meeting.meetingType === RETROSPECTIVE) {
    return handleCompletedRetrospectiveStage(stage, meeting, dataLoader);
  }
  return {};
};

export default handleCompletedStage;
