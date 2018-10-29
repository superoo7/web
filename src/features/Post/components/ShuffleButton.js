import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, notification } from 'antd';
import api from 'utils/api';
import coinSound from 'assets/sounds/coin.mp3';
import jackpotSound from 'assets/sounds/jackpot.mp3';

class ShuffleButton extends PureComponent {
  static propTypes = {
    handleSortOption: PropTypes.func.isRequired,
    me: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      amount: false,
      claimed: false,
      fireworks: false,
    }
  }

  componentDidMount() {
    this.array = [ 10, 70, 50, 20, 40, 80, 100 ];
    this.index = 0;
  }

  tick = () => {
    this.setState({ amount: this.array[this.index++] });
    if (this.index >= this.array.length) {
      this.index = 0;
    }
  }

  shuffle = (el) => {
    this.tickInterval = setInterval(this.tick, 100);

    const $button = document.getElementById('shuffle-button');
    $button.style.top = '-8px';
    setTimeout(function(){
      $button.style.top = '0';
    }, 150);

    if (this.state.claimed || !this.props.me) {
      return this.props.handleSortOption('random');
    }

    document.getElementById("coin-sound").play();

    const $coin = document.getElementById('coin');
    $coin.classList.add('play');

    const $coinContainer = document.getElementById('coin-container');
    $coinContainer.classList.add('play');

    this.shuffleTimeout = setTimeout(() => {
      api.post('/hunt_transactions/daily_shuffle.json', null, true, (res) => {
        clearInterval(this.tickInterval);
        this.setState({ amount: res.amount, claimed: true });
        $coin.classList.remove('play');

        // Jackpot fireworks
        if (res.amount === 1000) {
          document.getElementById("jackpot-sound").play();

          this.setState({ fireworks: true });
          this.shuffleTimeout2 = setTimeout(() => {
            this.setState({ fireworks: false });
            $coinContainer.classList.remove('play');
          }, 5000);
        } else {
          this.shuffleTimeout2 = setTimeout(function() {
            $coinContainer.classList.remove('play');
          }, 3000);
        }
      }).catch(e => {
        clearInterval(this.tickInterval);
        $coin.classList.remove('play');
        notification['error']({ message: e.message });
      });

      this.props.handleSortOption('random');
    }, 3000);
  };

  componentWillUnmount() {
    clearInterval(this.tickInterval);
    clearTimeout(this.shuffleTimeout);
    clearTimeout(this.shuffleTimeout2);
    document.getElementById("coin-sound").pause();
    document.getElementById("jackpot-sound").pause();
  }

  render() {
    const { amount, fireworks } = this.state;

    return (
      <div className="shuffle-container">
        {fireworks &&
          <div className="pyro"><div className="before"></div><div className="after"></div></div>
        }
        <audio id="jackpot-sound" className="hidden">
          <source src={jackpotSound} type="audio/mpeg" />
        </audio>
        <div className="coin-container" id="coin-container">
          <audio id="coin-sound" className="hidden">
            <source src={coinSound} type="audio/mpeg" />
          </audio>
          <div className="coin" id="coin">
            <div className="front"></div>
            <div className="back"></div>
            <div className="side">
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
          </div>
          {amount === 0 ?
            <div className="text">Already claimed</div>
          : (amount === 1000 ?
            <div className="text">Jackpot! + {amount} HUNT</div>
          :
            <div className="text">+ {amount} HUNT</div>
          )}
        </div>
        <span
          id="shuffle-button"
          className="shuffle-button"
          onClick={this.shuffle}
        >
          <Icon type="retweet" />
        </span>
      </div>
    )
  }
}

export default ShuffleButton;