import React from "react";
import Switch from "react-switch";
import {Navbar} from "react-bootstrap";
 
class SourceSwitch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { checked: props.checked };
    // this.handleChange = this.handleChange.bind(this);
  }
 
  handleChange(checked) {
    this.setState({ checked });
    this.props.onSourceSwitch(checked);
  }
 
  render() {
    return (
      <label>
        <Switch onChange={(checked) => this.handleChange(checked)} checked={this.state.checked}
        onColor="#86d3ff"
        onHandleColor="#2693e6"
        handleDiameter={20}
        uncheckedIcon={false}
        checkedIcon={false}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
        height={20}
        width={40}
        className="react-switch" />
      </label>
    );
  }
}

export default SourceSwitch;