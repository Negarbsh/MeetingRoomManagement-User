class Response {

    static get_empty_response() {
        return new Response()
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
            this.generate_json()
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
        res.status(this.status_code).send(this.get_json()).header('Authorization', this.token)
    }
}

module.exports = Response