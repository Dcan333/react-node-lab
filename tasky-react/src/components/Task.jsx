import React from 'react';

const Task = (props) => {

    return (
        <div className="card" style={{
            backgroundColor: props.done ? 'lightgrey' :
                props.priority === 'high' ? '#ff8080' :
                props.priority === 'medium' ? '#ffcc80' :
                props.priority === 'low' ? 'lightgreen' : '#5bb4c4'
        }}>
            <p className="title">{props.title}</p>
            <p>Due: {props.deadline}</p>
            <p className="description">{props.description}</p>
            <p className="priority" style={{
                color: props.priority === 'high' ? 'red' :
                    props.priority === 'medium' ? 'orange' :
                        props.priority === 'low' ? 'green' : 'black',
                fontWeight: props.priority ? 'bold' : 'normal'
            }}>
                {props.priority}
            </p>
            <button onClick={props.markDone} className='doneButton'>Done</button>
            <button className='deleteButton' onClick={props.deleteTask}>Delete</button>

        </div>
    )


}

export default Task;
