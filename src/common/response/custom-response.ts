export function customResponse(status: boolean, message: string, data: any) {
    return {
      status,
      message,
      ...data,
    };
  }