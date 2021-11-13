import { IResolvers } from "@graphql-tools/utils";

const product_type: IResolvers = {
  Product: {
    screenshoot: (parent) => parent.shortScreenshots,
  },
};

export default product_type;
