type SuccessResponseType = [{
    success: true;
    message: string;
    data: unknown;
}, status: number ];

type ErrorResponseType = [{
    success: false;
    message: string;
    code?: string | null;
}, status: number ];

type ResponseDto = {
    data?: unknown;
    message?: string,
    status?: number
}

export interface IHttpResponse {
    success(data: ResponseDto): SuccessResponseType;
}

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

    public error({message = "Internal Server Error", status = 500, code = null}):ErrorResponseType {
        return [{
            success: false,
            message,
            code,
        }, status]
    }
}