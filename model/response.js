class Response {

    static create_with_json(json, status_code) {
        if (!json) return null
        const is_successful = json.status
        const message = json.message
        const token = json.token
        return new Response(status_code, is_successful, message, token)

    }

    static get_empty_response() {
        return new Response()
    }

    constructor(status_code, is_successful, message, token) {

        if (!status_code) status_code = 200
        this.status_code = status_code
        this.message = message
        this.token = token
        this.is_successful = is_successful
        this.json = this.generate_json()
    }

    generate_json() {
        let success
        if (this.is_successful)
            success = 'success'
        else success = 'failure'
        if (this.token) {
            return {'status': success, 'message': this.message, 'token': this.token}
        }
        return {'status': success, 'message': this.message}
    }

    get_json() {
        if (!this.json)
            this.generate_json()
        return this.json
    }

    edit(status_code, is_successful , message, token){
        this.status_code = status_code || this.status_code
        this.message = message || this.message
        this.token = token || this.token
        this.is_successful = is_successful || this.is_successful
        this.json = this.generate_json()
    }
}