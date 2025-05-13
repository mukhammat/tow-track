type SuccessResponseType = {
    success: true;
    message: string;
    data: unknown;
};

type ErrorResponseType = {
    success: false;
    message: string;
    code?: string | null;
};

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

    public success({ data = null, message = "Success" }: ResponseDto): SuccessResponseType {
        return {
            success: true,
            message,
            data,
        };
    }

    public error({message = "Internal Server Error", code = null}):ErrorResponseType {
        return {
            success: false,
            message,
            code,
        }
    }
}

export const httpResponse = new HttpResponse();