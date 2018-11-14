import React, { Component } from 'react';
import { Icon, Modal, Progress } from 'antd';
import { formatNumber } from 'utils/helpers/steemitHelpers';

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
    const { scores } = this.props;

    return (
      <div>
        <Progress
          format={percent => ''}
          percent={10 * scores.score}
          successPercent={10 * scores.hunt_balance_score}
          className="level-bar"/>
        {scores === 0 ?
          <h2>User Score: 0 (Blacklisted)</h2>
        :
          <h2>
            User Score: {formatNumber(scores.hunt_balance_score)} <span className="boost-score">+ {formatNumber(scores.good_user_score)}</span> = {formatNumber(scores.score)}
            &nbsp;<span onClick={this.toggleModal} className="fake-link" alt="about level">
              <Icon type="question-circle-o" />
            </span>
          </h2>
        }
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