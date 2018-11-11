import React, { Component } from 'react';
import { Row, Col, Icon, Modal } from 'antd';
import { LEVEL_TIER } from 'features/User/utils';

const ColoredCol = ({ userScore }) => {
  const bars = Array(LEVEL_TIER[LEVEL_TIER.length - 1] + 1).fill().map((_, i) => i);
  bars.shift();

  return bars.map((i) => {
    let weight = 0;
    if (i <= userScore) {
      weight = 1;
    } else if (i - 1 < userScore < i) {
      weight = (userScore - (i - 1));
    }

    let width = (weight > 0) ? `${weight * 100 || 0}%` : 0

    return (
      <Col className="level-col" key={`colored-${i}`} span={3}>
        <div style={{
          backgroundColor: '#ff9c99',
          height: '100%',
          width: width,
        }}>
        </div>
      </Col>
    );
  });
}

const LevelLabels = () => {
  const levels = Array(LEVEL_TIER.length + 1).fill().map((_, i) => i);

  return [0].concat(LEVEL_TIER).map(Number).map((tier, i) => {
    const left = `calc(${(tier / 8) * 100}% - 15px)`;

    return (
      <span key={i} className="bar-label" style={{ left: left }}>{`LV. ${levels[i]}`}</span>
    )
  });
}

const ModalContent = () => {
  return (
    <div className="pop-content">
      <p>
        A hunter’s level is decided based on their overall hunter contribution within Steemhunt based on four criteria: Account credibility, Activity score, Curation score, and Hunt score.
        Please check out <a href="https://steemit.com/steemhunt/@steemhunt/steemhunt-abv-2-0-introducing-hunter-level-based-steemhunt-upvotes-or-new-category-search-feature" target="_blank" rel="noopener noreferrer" alt="Go to announcement">this announcement</a> for more details.
      </p>

      <h4>The hunter level will increase when:</h4>
      <ul>
        <li>your Steemit reputation is higher, your account age is older, or you’ve visited Steemhunt more frequently.</li>
        <li>your curations (upvoting hunt posts) are highly active with higher diversity scores.</li>
        <li>you have more approved hunts, and they rank higher.</li>
      </ul>

      <p>The hunter level will decrease when the activities mentioned above run in the opposite way, or you are blacklisted.</p>
    </div>
  )
}

class LevelBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false
    }
  }

  toggleModal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  }

  render() {
    const { account } = this.props;

    return (
      <div className="level-bar">
        <Row className="level-row">
          <LevelLabels />
          <ColoredCol userScore={account.user_score} />
        </Row>
        <h2>
          Hunter Level : {account.level}
          &nbsp;<span onClick={this.toggleModal} className="fake-link" alt="about level">
            <Icon className="level-question" type="question-circle-o" />
          </span>
        </h2>
        <Modal
            title="What is Hunter Level?"
            visible={this.state.modalVisible}
            onOk={this.toggleModal}
            onCancel={this.toggleModal}
            footer={null}
            bodyStyle={{
              overflow: 'scroll',
              maxHeight: '50vh',
              WebkitOverflowScrolling: "touch",
            }}
          >
            <ModalContent />
          </Modal>
      </div>
    )
  }
}

export default LevelBar;