import React, { Component } from 'react';
import { Icon, Modal, Progress } from 'antd';
import { formatNumber } from 'utils/helpers/steemitHelpers';

const ModalContent = () => {
  return (
    <div className="level-help">
      <p>
        Steemhunt user score is a measurable index that demonstrates how a hunter is contributing to the value of Steemhunt platform.
      </p>

      <h4 className="pink">User Score = (1) HUNT Power Score X (2) Contribution Score</h4>
      <ol>
        <li><b>HUNT Power Score (HPS)</b> indicates how much of a stake in the HUNT token you have compared to other users at this moment.</li>
        <li><b>Contribution Score (CS)</b> shows your activity-wide contributions in the community compared to other users. It calculates the user’s activities over the last 30 days based on 4 subcategories - credibility (trustworthiness of the account), activity (how active in Steemhunt), curation (upvoting in an adding-value way), and hunter (valuable hunts/comments the user has posted).</li>
      </ol>

      <p>Since both scores are determined based on the performance of other users, <b>your user score may vary everyday</b>. In other words, your user score may be decreased when other users achieve a higher performance than you, even if you have maintained the same amount of HUNT power and contribution activities.  The max score is 10.</p>
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
    const { scores } = this.props;

    return (
      <div>
        {scores === 0 ?
          <h2>User Score: 0 (Blacklisted)</h2>
        :
          <h2>
            User Score
            <span onClick={this.toggleModal} className="fake-link" alt="about level">
              <Icon type="question-circle-o" />
            </span>
          </h2>
        }
        <Progress
          type="dashboard"
          format={percent => (
            <div>
              <div className="score">{formatNumber(scores.score)}</div>
              <div className="score-sub">(= {formatNumber(scores.base)} x {formatNumber(scores.boost)})</div>
            </div>
          )}
          percent={10 * scores.score}
          successPercent={10 * scores.base}
          strokeColor="#fc6f6f"
          width={160}
          className="level-bar"/>
        <Modal
            title="What is User Score?"
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