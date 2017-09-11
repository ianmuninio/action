import {GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString} from 'graphql';
import InvitationResult from 'server/graphql/types/InvitationResult';

const InviteTeamMembersPayload = new GraphQLObjectType({
  name: 'InviteTeamMembersPayload',
  description: 'A list of all the possible outcomes when trying to invite a team member',
  fields: () => ({
    results: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(InvitationResult))),
      description: 'a list of the emails invited & the results from the invitation'
    },
    //teamName: {
    //  type: GraphQLString,
    //  description: 'The name of the team'
    //}
  })
});

export default InviteTeamMembersPayload;
