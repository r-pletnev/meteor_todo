import React, {Component, PropTypes} from 'react'
import ReactDom from 'react-dom'
import {createContainer} from 'meteor/react-meteor-data'
import Task from './Task'
import {Tasks} from '../api/tasks.js'
import AccountsUIWrapper from './AccountsUIWrapper'

class App extends Component {
  
  constructor(props){
    super(props)
    this.state = {hideCompleted: false}
  }

  toggleHideCompleted(){
    this.setState({hideCompleted: !this.state.hideCompleted})
  }

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
    let filteredTasks = this.props.tasks
    if(this.state.hideCompleted){
      filteredTasks = filteredTasks.filter(task => !task.checked)
    }
    return filteredTasks.map((task)=>(
      <Task key={task._id} task={task} />
    ))
  }

  render(){
    return(
      <div className="container">
        <header>
          <h1>Todo list ({this.props.incompleteCount})</h1>
          <label className='hide-completed'>
            <input
              type='checkbox'
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>
          <AccountsUIWrapper />

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
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired
}

export default createContainer(()=>{
  return {
    tasks: Tasks.find({}, {sort: {createAt: -1}}).fetch(),
    incompleteCount: Tasks.find({checked: {$ne: true}}).count()
  }
}, App)

