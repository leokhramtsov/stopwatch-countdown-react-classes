import React, { Component } from "react";
import Display from "../display";
import Controls from "../controls";
import TimeAdjuster from "./timeAdjuster";

class Countdown extends Component {
  state = {
    watch: { m: 0, s: 0, ms: 0 },
    started: false,
    active: false,
    startTime: 0
  };

  componentWillUnmount() {
    clearInterval(this.tInterval);
  }

  onChange = e => {
    const name = e.target.name;
    const value = e.target.value || 0;
    this.setState(prevState => ({
      watch: { ...prevState.watch, [name]: value }
    }));
  };

  updateTime = () => {
    const remaining = this.state.startTime - Date.now();
    const currentTimerTime = this.getTime(remaining);
    if (remaining > 0) {
      this.setState({ watch: { ...currentTimerTime } });
    } else {
      this.reset();
    }
  };

  getTime = timeInMiliseconds => {
    const timeLapsed = new Date(timeInMiliseconds);
    const m = timeLapsed.getUTCMinutes();
    const s = timeLapsed.getUTCSeconds();
    const ms = Math.floor(timeLapsed.getUTCMilliseconds() / 10);
    return { m, s, ms };
  };

  start = () => {
    const { watch } = this.state;
    if (!watch.m && !watch.s && !watch.ms) return;

    const mInMilliseconds = watch.m * 60000;
    const sInMilliseconds = watch.s * 1000;
    const milliseconds = watch.ms * 10;
    const totalTimeChosen = mInMilliseconds + sInMilliseconds + milliseconds;
    this.setState(
      {
        started: true,
        active: true,
        startTime: Date.now() + totalTimeChosen
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
      watch: {
        m: 0,
        s: 0,
        ms: 0
      }
    });
  };

  render() {
    const { watch, started, active } = this.state;
    return (
      <>
        <h2 className="component__title">Countdown</h2>
        <Display {...watch} />
        <Controls
          start={this.start}
          reset={this.reset}
          stop={this.stop}
          started={started}
          active={active}
        />
        <TimeAdjuster
          started={started}
          onChange={this.onChange}
          m={watch.m}
          s={watch.s}
        />
      </>
    );
  }
}

export default Countdown;
