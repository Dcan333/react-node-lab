import React from "react";

const AddTaskForm = (props) => {

    return (
        <div>
            <form onSubmit={props.submit}>
                <label>
                    Task title:
                    <input type="text" name="title" required onChange={(event) => props.change(event)} />
                </label>
                <br />
                <label>
                    Due date:
                    <input type="date" name="deadline" required onChange={(event) => props.change(event)} />
                </label>
                <br />
                <label>
                    Details:
                    <input type="text" name="description" onChange={(event) => props.change(event)} />
                </label>
                <label>
                    Priority:
                    <select name="priority" required onChange={(event) => props.change(event)} >
                        <option value="">please enter a priority</option>
                        <option value="low">low</option>
                        <option value="medium">medium</option>
                        <option value="high">high</option>
                    </select>
                </label>
                <br />
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
};

export default AddTaskForm;