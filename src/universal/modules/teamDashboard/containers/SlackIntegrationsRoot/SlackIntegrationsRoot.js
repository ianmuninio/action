import PropTypes from 'prop-types';
import React from 'react';
import QueryRenderer from 'universal/components/QueryRenderer/QueryRenderer';
import SlackIntegrations from 'universal/modules/teamDashboard/components/SlackIntegrations/SlackIntegrations';
import {DEFAULT_TTL, SLACK} from 'universal/utils/constants';
import withAtmosphere from 'universal/decorators/withAtmosphere/withAtmosphere';
import ErrorComponent from 'universal/components/ErrorComponent/ErrorComponent';
import LoadingComponent from 'universal/components/LoadingComponent/LoadingComponent';
import SlackChannelAddedSubscription from 'universal/subscriptions/SlackChannelAddedSubscription';
import SlackChannelRemovedSubscription from 'universal/subscriptions/SlackChannelRemovedSubscription';
import ProviderRemovedSubscription from 'universal/subscriptions/ProviderRemovedSubscription';
import ProviderAddedSubscription from 'universal/subscriptions/ProviderAddedSubscription';
import fromTeamMemberId from 'universal/utils/relay/fromTeamMemberId';

const slackChannelQuery = graphql`
  query SlackIntegrationsRootQuery($teamId: ID!, $service: IntegrationService!) {
    viewer {
      ...SlackIntegrations_viewer
    }
  }
`;

const subscriptions = [
  SlackChannelAddedSubscription,
  SlackChannelRemovedSubscription,
  ProviderRemovedSubscription,
  ProviderAddedSubscription
];

const cacheConfig = {ttl: DEFAULT_TTL};

const SlackIntegrationsRoot = ({atmosphere, teamMemberId}) => {
  const {teamId} = fromTeamMemberId(teamMemberId);
  return (
    <QueryRenderer
      cacheConfig={cacheConfig}
      environment={atmosphere}
      query={slackChannelQuery}
      variables={{teamId, service: SLACK}}
      subscriptions={subscriptions}
      render={({error, props}) => {
        if (error) {
          return <ErrorComponent height={'14rem'} error={error} />;
        } else if (props) {
          const {viewer} = props;
          return (<SlackIntegrations
            jwt={atmosphere.authToken}
            viewer={viewer}
            teamId={teamId}
            teamMemberId={teamMemberId}
          />);
        }
        return <LoadingComponent height={'14rem'} />;
      }}

    />
  );
};


SlackIntegrationsRoot.propTypes = {
  atmosphere: PropTypes.object.isRequired,
  teamMemberId: PropTypes.string.isRequired,
  viewer: PropTypes.object
};

export default withAtmosphere(SlackIntegrationsRoot);
