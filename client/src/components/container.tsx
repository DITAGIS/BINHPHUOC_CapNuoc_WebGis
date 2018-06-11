import * as React from "react";
import WebMapView from "./webmapview";
import { connect } from "react-redux";
import * as reducer from '../reducers/reducers'

interface States {
}

type ConnectedStates = {
}

class Container extends React.Component<ConnectedStates, States> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <div className="container">
        <WebMapView />
      </div>
    );
  }
}
const mapStateToProps = (state: reducer.All): ConnectedStates => ({
})
export default connect(mapStateToProps)(Container);