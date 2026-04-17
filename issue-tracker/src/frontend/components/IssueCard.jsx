function IssueCard({issue, onClick, number}) {
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
            <small>
                Priority: {issue.priority} | Status: {issue.status}
            </small>
        </div>
    );
}

export default IssueCard;