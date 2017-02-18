import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectPulse } from '../actions';
import _ from 'lodash';
import faker from 'faker';

import { Layout, Main, SidePanel } from '../components/layout'

import PulseUpdates from '../components/pulse-updates'
import Board from '../components/board'

import './app.css';


class App extends Component {
  state = {
    updatesOpen : false,
    pulses: pulses,
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

  closeUpdates = () => this.setState({ updatesOpen: false }) // action

  render() {
    // selection from state / 'data loader' :
    const { selectedPulseId } = this.props;
    const updates = udpatesByPulseId[selectedPulseId] || [];

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
              pulses={this.state.pulses}
              pulseActions={this.pulseActions}
            />
          </Main>
        </Layout>
      </div>
    );
  }
}

function mapStateToProps(state) { // ,ownProps
  const { selectedPulseId } = state;
  console.log(state);

  return {
    selectedPulseId,
  };
}

export default connect(mapStateToProps, {
  selectPulse,
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
