type SuccessResponseType = [{
    success: true;
    message: string;
    data: unknown;
}, status: number ];

type ResponseDto = {
    data?: unknown;
    message?: string,
    status?: number
}

export interface IHttpResponse {
    success(data: ResponseDto): SuccessResponseType;
}

// Нужно доработать
export class HttpResponse implements IHttpResponse {
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