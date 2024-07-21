class ErrorResponse extends Error {
    constructor(public response: { message?: string, data?: any }, public statusCode?: number) {
        super(response.message)
    }
}

export default ErrorResponse
