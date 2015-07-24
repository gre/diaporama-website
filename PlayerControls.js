import React from "react";
const { Component } = React;

function lerp (min, max, x) {
  return (x-min) / (max-min);
}

class Button extends Component {
  constructor (props) {
    super(props);
    this.state = { hover: false };
    this.onClick = this.onClick.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }
  onClick (e) {
    const {onClick} = this.props;
    e.preventDefault();
    if (onClick) {
      onClick();
    }
  }
  onMouseEnter () {
    this.setState({ hover: true });
  }
  onMouseLeave () {
    this.setState({ hover: false });
  }
  render () {
    const {
      children,
      icon,
      togglable,
      active
    } = this.props;
    const {
      hover
    } = this.state;

    const style = {
      color: active ? "#ce7" : "#999",
      opacity: hover ? 1 : 0.6,
      fontSize: "24px",
      textDecoration: "none",
      padding: "2px 6px",
      cursor: "pointer"
    };
    return <a
      style={style}
      onClick={this.onClick}
      onMouseEnter={this.onMouseEnter}
      onMouseLeave={this.onMouseLeave}>
      {children || <i className={"fa fa-"+icon}></i> }
    </a>;
  }
}

export default class PlayerControls extends Component {
  constructor (props) {
    super(props);
    const { diaporama } = props;
    const refresh = () => this.forceUpdate();
    ["progress","destroy","error","play","pause","render"]
      .forEach(e => diaporama.on(e, refresh));

    this.onKeydown = this.onKeydown.bind(this);
    this.onProgressClick = this.onProgressClick.bind(this);
  }

  componentDidMount () {
    document.body.addEventListener("keydown", this.onKeydown);
  }

  componentWillUnmount () {
    document.body.removeEventListener("keydown", this.onKeydown);
  }

  formatDuration (d) {
    const secs = Math.floor(d / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return (m>9?m:"0"+m)+":"+(s>9?s:"0"+s);
  }

  onKeydown (e) {
    const { diaporama } = this.props;
    switch (e.which) {
      case 37: // Left
        e.preventDefault();
        diaporama.prev();
        break;
      case 39: // Right
        e.preventDefault();
        diaporama.next();
        break;
      case 32: // Space
        e.preventDefault();
        diaporama.paused = !diaporama.paused;
        break;
      }
  }

  onProgressClick (e) {
    e.preventDefault();
    const { diaporama } = this.props;
    const rect = e.target.getBoundingClientRect();
    diaporama.currentTime = diaporama.duration * lerp(rect.left, rect.right, e.clientX);
  }

  render () {
    const { diaporama } = this.props;
    const { loop, currentTime, duration, paused, playbackRate, slide, data } = diaporama;
    const slides = data.timeline.length;

    const style = {
      position: "relative",
      background: "#222",
      borderTop: "1px solid #222",
    };
    const progressHeight = "8px";
    const progressContainer = {
      position: "relative",
      height: progressHeight,
      background: "#000",
      cursor: "pointer"
    };
    const progress = {
      position: "absolute",
      top: 0,
      left: 0,
      height: progressHeight,
      width: `${100 * currentTime / duration}%`,
      background: "#ce7",
      pointerEvents: "none"
    };
    const progressTime = {
      color: "#fff",
      fontWeight: "bold"
    };
    const progressDuration = {
      paddingLeft: "5px",
      color: "#aaa"
    };
    const progressSlide = {
      color: "#fff",
      fontWeight: "bold"
    };
    const progressSlides = {
      paddingLeft: "5px",
      color: "#aaa"
    };
    const textButton = {
      textTransform: "uppercase",
      fontSize: "10px",
      verticalAlign: "top"
    };
    const buttons = {
      display: "flex",
      lineHeight: "32px"
    };

    const progressTimeContainer = {
      fontSize: "12px",
      paddingLeft: "8px"
    };
    const progressSlideContainer = {
      fontSize: "12px",
      paddingLeft: "8px"
    };
    const buttonsLeft = {
      flex: 1
    };
    const buttonsCenter = {
      flex: 1,
      textAlign: "center"
    };
    const buttonsRight = {
      flex: 1,
      textAlign: "right"
    };

    return <div style={style}>
      <div style={progressContainer} onClick={this.onProgressClick}>
        <div style={progress}></div>
      </div>
      <div style={buttons}>
        <div style={buttonsLeft}>
          <div style={progressTimeContainer}>
            <span style={progressTime}>{this.formatDuration(currentTime)}</span> /
            <span style={progressDuration}>{this.formatDuration(duration)}</span>
          </div>
          <div style={progressSlideContainer}>
            <span style={progressSlide}>{slide+1}</span> /
            <span style={progressSlides}>{slides}</span>
          </div>
        </div>
        <div style={buttonsCenter}>
          <Button onClick={() => diaporama.prev()} icon={"step-backward"} />
          <Button onClick={() => diaporama.paused = !paused} icon={paused ? "play" : "pause"} />
          <Button onClick={() => diaporama.next()} icon={"step-forward"} />
        </div>
        <div style={buttonsRight}>
          <Button onClick={() => diaporama.loop = !loop} togglable active={loop}>
            <span style={textButton}>loop</span>
          </Button>
        </div>
      </div>
    </div>;
  }
}

PlayerControls.init = (dom, props) => {
  React.render(<PlayerControls {...props} />, dom);
};
