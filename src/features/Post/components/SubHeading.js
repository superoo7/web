import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { timeUntilMidnightSeoul } from 'utils/date';
import { formatAmount } from "utils/helpers/steemitHelpers";

export class SubHeading extends PureComponent {
  static propTypes = {
    huntsCount: PropTypes.number,
    dailyTotalReward: PropTypes.number,
    daysAgo: PropTypes.number.isRequired,
  };

  constructor() {
    super();
    this.state = {
      timer: null,
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick = () => {
    const timeLeft = timeUntilMidnightSeoul(true)

    if (timeLeft === '00:00:00') {
      this.setState({ timer: (<div>Today&#39;s ranking competition is finished. Please <span onClick={() => window.location.reload()} className="fake-link">refresh your page.</span></div>) });
      clearInterval(this.interval);
    } else {
      this.setState({ timer: (<div><b>{timeLeft}</b> left till midnight (KST)</div>) });
    }
  }

  render() {
    const { huntsCount, dailyTotalReward, daysAgo } = this.props;

    return (
      <div className="heading-sub">
        {daysAgo === -1 ?
          <div>{this.state.timer}</div>
        :
          <div><b>{huntsCount}</b> product{huntsCount === 1 ? '' : 's'}, <b>{formatAmount(dailyTotalReward)}</b> SBD hunter’s rewards were generated.</div>
        }
      </div>
    );
  }
}
