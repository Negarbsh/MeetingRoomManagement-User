class Response {


    constructor(status_code, is_successful, message, token) {
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

    get_json(){
        return this.json
    }
}