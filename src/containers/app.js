import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  selectPulse,
  loadEntities,
} from '../actions';

import _ from 'lodash';
import faker from 'faker';

import { Layout, Main, SidePanel } from '../components/layout'

import PulseUpdates from '../components/pulse-updates'
import Board from '../components/board'

import './app.css';


class App extends Component {
  state = {
    updatesOpen : false,
    // pulses: pulses,
    // selectedPulseId: 0,
  }; // move to props

  pulseActions = {
    showUpdates: selectedPulseId => {
      this.props.selectPulse(selectedPulseId);

      this.setState({
        updatesOpen: true,
      })
    } // action
  }

  componentWillMount() {
    this.props.loadEntities('pulses')
  }

  closeUpdates = () => this.setState({ updatesOpen: false }) // action

  render() {
    const { selectedPulseId, pulseArray, pulses } = this.props;
    const updates = pulses[selectedPulseId] && pulses[selectedPulseId].updates || [];

    return (
      <div>
        <Layout>
          <SidePanel
            title={`UPDATES (${updates.length})`}
            open={this.state.updatesOpen}
            onClose={this.closeUpdates}
          >
            <PulseUpdates updates={updates}/>
          </SidePanel>
          <Main>
            <Board
              pulses={pulseArray}
              pulseActions={this.pulseActions}
            />
          </Main>
        </Layout>
      </div>
    );
  }
}

function mapStateToProps(state) { // ,ownProps
  const {
    entities: { pulses },
    selectedPulseId
  } = state;
  console.log({state});
  const pulseArray = _.keys(pulses).map(id => {
    const pulse = pulses[id];
    return _.assign({} , pulse, { updatesCount: pulse.updates.length });
    // return _.assign({} , pulse, { updatesCount: pulse.updates ? pulse.updates.length : 0 });
  })

  return {
    selectedPulseId,
    pulseArray,
    pulses,
  };
}

export default connect(mapStateToProps, {
  selectPulse,
  loadEntities,
})(App);


// Data Generation:
const pulses = _.times(12000, id => ({
  id,
  content: faker.hacker.phrase(),
  updatesCount: Math.random().toString().slice(2,4),
}))

const udpatesByPulseId = _.assign(...pulses.map(pulse => ({
  [pulse.id]: _.times(pulse.updatesCount, () => ({
    content: faker.hacker.phrase() || [],
  }))
})))
