import React from 'react';
import {createFragmentContainer} from 'react-relay';
import styled from 'react-emotion';
import ReflectionGroupTitleEditor from 'universal/components/ReflectionGroup/ReflectionGroupTitleEditor';
import type {ReflectionGroupHeader_meeting as Meeting} from './__generated__/ReflectionGroupHeader_meeting.graphql';
import type {ReflectionGroupHeader_reflectionGroup as ReflectionGroup} from './__generated__/ReflectionGroupHeader_reflectionGroup.graphql';
import {GROUP, VOTE} from 'universal/utils/constants';
import ReflectionGroupVoting from 'universal/components/ReflectionGroupVoting';
import ui from 'universal/styles/ui';

type Props = {
  meeting: Meeting,
  reflectionGroup: ReflectionGroup
};

const GroupHeader = styled('div')(({phaseType}) => ({
  display: 'flex',
  fontSize: '.875rem',
  justifyContent: phaseType === VOTE ? 'space-between' : 'center',
  marginBottom: 8,
  width: '100%'
}));

const TitleAndCount = styled('div')({
  alignItems: 'flex-start',
  display: 'flex',
  flexShrink: 1,
  justifyContent: 'center',
  position: 'relative',
  width: 'auto'
});

const Spacer = styled('div')({width: ui.votingCheckmarksWidth});

const ReflectionGroupHeader = (props: Props) => {
  const {meeting, reflectionGroup} = props;
  const {localStage, localPhase: {phaseType}} = meeting;
  const canEdit = phaseType === GROUP && localStage.isComplete === false;
  return (
    <GroupHeader phaseType={phaseType}>
      {phaseType === VOTE && <Spacer />}
      <TitleAndCount>
        <ReflectionGroupTitleEditor reflectionGroup={reflectionGroup} meeting={meeting} readOnly={!canEdit} />
      </TitleAndCount>
      {phaseType === VOTE && <ReflectionGroupVoting reflectionGroup={reflectionGroup} meeting={meeting} />}
    </GroupHeader>
  );
};

export default createFragmentContainer(
  ReflectionGroupHeader,
  graphql`
    fragment ReflectionGroupHeader_meeting on RetrospectiveMeeting {
      localStage {
        isComplete
      }
      localPhase {
        phaseType
      }
      ...ReflectionGroupTitleEditor_meeting
      ...ReflectionGroupVoting_meeting
    }
    fragment ReflectionGroupHeader_reflectionGroup on RetroReflectionGroup {
      ...ReflectionGroupTitleEditor_reflectionGroup
      ...ReflectionGroupVoting_reflectionGroup
      reflections {
        id
      }
    }
  `
);
