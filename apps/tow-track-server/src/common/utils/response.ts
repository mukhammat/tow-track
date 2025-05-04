export const successResponse = (data: unknown, message = "Success", status = 200) => ({
    status,
    success: true,
    message,
    data,
});
  
export const errorResponse = (message = "Something went wrong", status = 500) => ({
    status,
    success: false,
    message,
});
  