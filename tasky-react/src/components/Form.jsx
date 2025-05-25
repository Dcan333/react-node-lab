const AddTaskForm = (props) => {
    return (
        <div>
            <form onSubmit={props.submit}>
                <label>
                    Task title:
                    <input 
                        type="text" 
                        name="title" 
                        required 
                    />
                </label>
                <br />
                <label>
                    Due date:
                    <input 
                        type="date" 
                        name="deadline" 
                        required 
                    />
                </label>
                <br />
                <label>
                    Details:
                    <input 
                        type="text" 
                        name="description" 
                    />
                </label>
                <label>
                    Priority:
                    <select 
                        name="priority" 
                        required 
                        defaultValue=""
                    >
                        <option value="">please enter a priority</option>
                        <option value="low">low</option>
                        <option value="medium">medium</option>
                        <option value="high">high</option>
                    </select>
                </label>
                <br />
                <input type="submit" value="Submit" disabled={props.disabled} />
            </form>
        </div>
    )
};

export default AddTaskForm;