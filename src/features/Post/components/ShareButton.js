import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Popover, Icon, message, Modal, Button } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getCachedImageHack } from 'features/Post/utils';

export class ShareButtonContent extends PureComponent {
  render() {
    const { post, me, url } = this.props;
    const shareUrl = (url ? url : window.location.href) + (me ? `%3Fref=${me}` : '');

    return(
      <div className="social-shares">
        <a
          className="share-button"
          href={'https://www.facebook.com/sharer.php?u=' + shareUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="icon-facebook share-icon"></i>
        </a>
        <div className="vertical-line"></div>
        <a
          className="share-button"
          href={'https://twitter.com/intent/tweet?url=' + shareUrl +
            (post ? '&text=' + encodeURI(post.title) : '') +
            '&hashtags=steemhunt'}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="icon-twitter share-icon"></i>
        </a>
        <div className="vertical-line"></div>
        <a
          className="share-button"
          href={'https://pinterest.com/pin/create/button/?url=' + shareUrl +
            (post ? '&media=' + getCachedImageHack(post.images[0]['link'], 1200, 630, true) + '&description=' + encodeURI(post.title + ' : ' + post.tagline) : '')
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="icon-pinterest-p share-icon"></i>
        </a>
        <div className="vertical-line"></div>
        <CopyToClipboard text={shareUrl.replace('%3F', '?')} onCopy={() => message.success('Successfully copied to your clipboard.')}>
          <div className="share-button">
            <i className="icon-link share-icon"></i>
          </div>
        </CopyToClipboard>
      </div>
    );
  }
}

export default class ShareButton extends PureComponent {
  static propTypes = {
    post: PropTypes.object.isRequired,
    me: PropTypes.string,
  }

  constructor(props) {
    super(props);
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
    const { post, me } = this.props;
    const content = <ShareButtonContent post={post} me={me} />;

    const ModalContent = () => {
      return (
        <div className="pop-content">
          <p>
            90,000 tokens per day are distributed to people who share hunting posts to their social media channels including Facebook, Twitter, Pinterest, etc.
          </p>
          <p>
            HUNT tokens will be assigned based on the share of the total daily traffic generated from all the shared posts via the social channels. For example, if all of today’s shared social media posts have encouraged 10,000 people to visit the hunt posts, 9 HUNT tokens will be assigned per visitor (90,000 tokens / 10,000 visitors). If your shared post has generated 100 visitors that day, you will get 900 HUNT tokens (100*9 = 900).
          </p>
          <p>
            A maximum of 100 tokens per traffic (click) can be issued.
          </p>
        </div>
      )
    }

    return (
      <div className="share-container">
        <Popover content={content} trigger="click" overlayClassName="social-popup">
          <Button icon="share-alt" className="share-button">SHARE</Button>
        </Popover>
        <div className="share-comment">Get social share airdrop!
          <a onClick={this.toggleModal}>
            &nbsp;<Icon type="question-circle-o" />
          </a>
        </div>
        <Modal
          title="Share the hunt and get free HUNT tokens!"
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

