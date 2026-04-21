function IssueCard({issue, onClick, number}) {
    const getPriorityColor = () => {
        if (issue.priority === "low") {
            setPriorityColor("text-green");
        } else if (issue.priority === "medium") {
            setPriorityColor("text-orange");
        } else if (issue.priority === "high") {
            setPriorityColor("text-red");
        } else {
            setPriorityColor("text-red");
        }
    }

    return (
        <div
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => onClick(issue.id)}
        >
            <h3>#{number} {issue.title}</h3>
            <div className="util-desc">
                <p>{issue.description}</p>
            </div>
            <div className="issue-card-data">
                <small style={{display: "flex", gap:"5px"}}>
                    Priority: <span
                        style={{fontWeight:"bold"}}
                        className={
                            (
                                (issue.priority === "low") ? "text-green" :
                                (issue.priority === "medium") ? "text-orange" :
                                "text-red"
                            )
                        }
                    >{issue.priority}</span>
                    | Status: 
                    <span
                        style={{fontWeight:"bold"}}
                        className={(issue.status === "open" ? "text-green" : "text-red")}
                    >{issue.status}</span>
                </small>
            </div>
        </div>
    );
}

export default IssueCard;