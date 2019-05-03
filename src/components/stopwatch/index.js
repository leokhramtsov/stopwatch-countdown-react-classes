import React, { Component } from "react";
import Display from "../display";
import Controls from "../controls";
import Laps from "./laps";

class Stopwatch extends Component {
  state = {
    watch: { m: 0, s: 0, ms: 0 },
    started: false,
    active: false,
    startTime: 0,
    timePassed: 0,
    laps: [],
    previousLap: 0
  };

  componentWillUnmount() {
    clearInterval(this.tInterval);
  }

  updateTime = () => {
    const timePassed = Date.now() - this.state.startTime;
    this.setState({ timePassed }, () => {
      const time = this.getTime(this.state.timePassed);
      this.setState({ watch: { ...time } });
    });
  };

  getTime = timeInMiliseconds => {
    const timeLapsed = new Date(timeInMiliseconds);
    const m = timeLapsed.getUTCMinutes();
    const s = timeLapsed.getUTCSeconds();
    const ms = Math.floor(timeLapsed.getUTCMilliseconds() / 10);
    return { m, s, ms };
  };

  start = () => {
    this.setState(
      {
        started: true,
        active: true,
        startTime: Date.now() - this.state.timePassed
      },
      () => {
        this.tInterval = setInterval(this.updateTime, 10);
      }
    );
  };

  stop = () => {
    clearInterval(this.tInterval);
    this.setState({ active: false });
  };

  reset = () => {
    clearInterval(this.tInterval);
    this.setState({
      started: false,
      active: false,
      startTime: 0,
      timePassed: 0,
      watch: {
        m: 0,
        s: 0,
        ms: 0
      },
      laps: []
    });
  };

  setLap = () => {
    if (this.state.active) {
      const { timePassed, previousLap, watch } = this.state;
      this.setState({ previousLap: timePassed }, () => {
        const lapTime = this.getTime(timePassed - previousLap);
        const lap = { totalTime: { ...watch }, lapTime: { ...lapTime } };
        const updatedLaps = [...this.state.laps, lap];
        this.setState({ laps: updatedLaps });
      });
    }
  };

  render() {
    const { watch, laps, started, active } = this.state;
    return (
      <>
        <h2 className="component__title">Stopwatch</h2>
        <Display {...watch} />
        <Controls
          start={this.start}
          reset={this.reset}
          stop={this.stop}
          started={started}
          active={active}
          setLap={this.setLap}
          stopwatch={true}
        />
        <Laps laps={laps} />
      </>
    );
  }
}

export default Stopwatch;
