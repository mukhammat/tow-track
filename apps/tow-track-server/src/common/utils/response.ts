type SuccessResponseType = [{
    success: true;
    message: string;
    data: unknown;
}, status: unknown ];

type ResponseDto = {
    data?: unknown;
    message?: string,
    status?: unknown
}

export interface ICustomResponse {
    success(data: ResponseDto): SuccessResponseType;
}

// Нужно доработать
export class CustomResponse implements ICustomResponse {
    constructor() {
    }

    public success({ data = null, message = "Success", status = 200 }: ResponseDto): SuccessResponseType {
        return [{
            success: true,
            message,
            data,
        }, status];
    }

    // On develompment
    private error(message = "Something went wrong", status = 500) {
        return {
            status,
            success: false,
            message,
        }
    }
}