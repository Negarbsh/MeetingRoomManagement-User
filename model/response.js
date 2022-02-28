class Response {

    static get_empty_response() {
        return new Response()
    }

    static get_invalid_token_response() {
        const response_obj = this.get_empty_response()
        response_obj.edit(403, 'access denied') //todo response status could be enum
        return response_obj
    }

    static get_bad_request_response(message) {
        const response_obj = this.get_empty_response()
        if (!message)
            response_obj.edit(400, 'Invalid request.')
        else response_obj.edit(400, 'Invalid request. ' + message)
        return response_obj
    }

    constructor(status_code, message, token) {
        if (!status_code)
            this.status_code = status_code
        this.message = message
        this.token = token
        this.json = this.generate_json()
    }

    generate_json() {
        return {'message': this.message}
    }

    get_json() {
        if (!this.json)
            this.json = this.generate_json()
        return this.json
    }

    edit(status_code, message, token) {
        this.status_code = status_code || this.status_code
        this.message = message || this.message
        this.token = token || this.token
        this.json = this.generate_json()
    }

    set_redirecting(redirect_link, redirect_message) {
        this.should_redirect = true
        this.redirecting_link = redirect_link
        this.message = redirect_message
    }

    send_response(res) {
        res.header('token', this.token)
        res.status(this.status_code).send(this.get_json())
    }
}

module.exports = Response