import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Upload } from 'antd';

const VideoTag = ({ href }) => {
  return (
    <video key={href} alt="Preview" playsInline autoPlay="autoplay" muted loop>
      <source src={href} />
    </video>
  )
}

export default class CustomUploadDragger extends Upload.Dragger {

  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    const nodes = document.getElementsByClassName('ant-upload-list-item-thumbnail');
    for (let i = 0; i < nodes.length; i ++) {
      if (/\.mp4/.test(nodes[i].getAttribute("href"))) {
        const noImageTag = nodes[i].querySelectorAll('i.anticon-file')[0];
        if (noImageTag) {
          const temp = document.createElement("div");
          temp.className = "thumbnail-video-container"
          const href = nodes[i].getAttribute("href");
          ReactDOM.render(<VideoTag href={href} />, temp);
          nodes[i].replaceChild(temp, noImageTag)
        }
      }
    }
  }
}
