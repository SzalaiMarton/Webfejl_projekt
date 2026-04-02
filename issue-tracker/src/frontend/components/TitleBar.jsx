import RequiredFieldText from "../components/RequiredFieldText";

function TitleBar({title, isRequired}) {
    return (
        <div className="titlebar">
              <label>{title}</label>
              {isRequired && (<RequiredFieldText/>)}
        </div>
    );
}

export default TitleBar;