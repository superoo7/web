import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import api from 'utils/api';
import { Icon } from 'antd';

class Referral extends Component {

  constructor(props) {
    super(props);
    this.state = {
      reported: false
    };
  }

  componentDidMount() {
    window.document.getElementById('panel-left').addEventListener('scroll', (e) => this.scrollDetector(e));
    window.document.getElementById('panel-right').addEventListener('scroll', (e) => this.scrollDetector(e));
  }

  componentWillUnmount() {
    window.document.getElementById('panel-left').removeEventListener('scroll', (e) => this.scrollDetector(e));
    window.document.getElementById('panel-right').removeEventListener('scroll', (e) => this.scrollDetector(e));
  }

  scrollDetector(e) {
    if ((e.srcElement.scrollTop > 100) && !this.state.reported) {
      this.postReferral()
    }
  }

  postReferral() {
    this.setState({ reported: true }, () => {
      api.post('/referrals.json', {
        ref: this.props.params.get('ref'),
        path: this.props.pathname,
        referrer: document.referrer
      }, false);
    })
  }

  render() {
    return (
      <div className="top-banner-bar">
        <Link to="/about">
          Welcome to Steemhunt <Icon type="right-circle-o" />
        </Link>
        <a onClick={() => this.props.setBannerState(false)}>
          <Icon type="close-circle-o" />
        </a>
      </div>
    )
  }
}

export default Referral;