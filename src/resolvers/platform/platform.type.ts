import { IResolvers } from "@graphql-tools/utils";

const platform_type: IResolvers = {
  Platform: {
    active: (parent) => (parent !== false ? true : false),
  },
};

export default platform_type;
