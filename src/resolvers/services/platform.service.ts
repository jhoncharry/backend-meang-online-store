import { BadRequestError } from "../../common/errors/bad-request-error";

import { customResponse } from "../../common/response/custom-response";

import { Platform } from "../../models/platform.model";

class PlatformService {
  static async getPlatform(id: any) {
    // Check if the user exists with that email and remove registerDate from query and User document result
    const existingPlatform = await Platform.findOne({ id });
    if (!existingPlatform) {
      throw new BadRequestError("Platform Doesn't exist");
    }
    return customResponse(true, "Platform by ID", {
      platform: existingPlatform,
    });
  }
}

export default PlatformService;
