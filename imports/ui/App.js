import React, {Component, PropTypes} from 'react'
import ReactDom from 'react-dom'
import {createContainer} from 'meteor/react-meteor-data'
import Task from './Task'
import {Tasks} from '../api/tasks.js'

class App extends Component {

  handleSubmit(e){
    e.preventDefault()

    const text = ReactDom.findDOMNode(this.refs.textInput).value.trim()

    Tasks.insert({
      text,
      createAt: new Date()
    })

    ReactDom.findDOMNode(this.refs.textInput).value = ''
  }

  renderTasks(){
    return this.props.tasks.map((task)=>(
      <Task key={task._id} task={task} />
    ))
  }

  render(){
    return(
      <div className="container">
        <header>
          <h1>Todo list</h1>

          <form className='new-task' onSubmit={this.handleSubmit.bind(this)}>
            <input
              type='text'
              ref='textInput'
              placeholder='Type to add new tasks'
            />
          </form>
        </header>

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    )
  }
}

App.PropTypes = {
  tasks: PropTypes.array.isRequired
}

export default createContainer(()=>{
  return {
    tasks: Tasks.find({}, {sort: {createAt: -1}}).fetch()
  }
}, App)

