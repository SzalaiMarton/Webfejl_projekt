import RequiredFieldText from "../components/RequiredFieldText";

function TitleBar({id = "", title, isRequired}) {
    return (
        <div className="titlebar">
              <label id={id}>{title}</label>
              {isRequired && (<RequiredFieldText/>)}
        </div>
    );
}

export default TitleBar;