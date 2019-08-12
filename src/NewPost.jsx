import React, { Component } from 'react'
class NewPost extends Component {
    constructor() {
        super()
        this.state = {
            file: "",
            description: ""
        }
    }
    descChangeHandler = e => {
        this.setState({ description: e.target.value })
    }
    imageChangeHandler = e => {
        this.setState({ imageFile: e.target.files[0] })
    }
    soundChangeHandler = e => {
        this.setState({ soundFile: e.target.files[0] })
    }
    submitHandler = evt => {
        evt.preventDefault()
        let data = new FormData()
        data.append("img", this.state.imageFile)
        data.append("snd", this.state.soundFile)
        data.append("description", this.state.description)
        fetch('/new-post', { method: "POST", body: data })
    }
    render = () => {
        return (<form onSubmit={this.submitHandler}>
            <input type="file" onChange={this.imageChangeHandler} />
            <input type="file" onChange={this.soundChangeHandler} />

            <input type="text" value={this.state.description} onChange={this.descChangeHandler} />
            <input type="submit" value="create new" />
        </form>)
    }
}
export default NewPost 