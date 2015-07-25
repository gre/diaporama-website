const React = require("react");
const { RENDER_EMPTY, RENDER_PLAYING, RENDER_WAITING } = require("diaporama");
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
      padding: "0px 4px",
      verticalAlign: "top",
      cursor: "pointer",
      display: "inline-block",
      width: "24px",
      textAlign: "center"
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


const defaultProps = {
  Button: Button,
  loadingIcons: {
    [RENDER_EMPTY]: "fa fa-spinner",
    [RENDER_WAITING]: "fa fa-spinner fa-pulse",
    [RENDER_PLAYING]: "fa fa-spinner"
  },
  loadingOpacity: {
    [RENDER_EMPTY]: 0.5,
    [RENDER_WAITING]: 1,
    [RENDER_PLAYING]: 0
  },
  progressHeight: 8,
  styles: {
    style: {
      position: "relative",
      background: "#222",
      borderTop: "1px solid #222"
    },
    progressContainer: {
      position: "relative",
      background: "#000",
      cursor: "pointer",
      display: "block"
    },
    progress: {
      zIndex: 2,
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      background: "#ce7",
      pointerEvents: "none"
    },
    buffered: {
      zIndex: 1,
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      background: "#ce7",
      opacity: 0.3,
      pointerEvents: "none"
    },
    progressTime: {
      color: "#ce7",
      fontWeight: "bold"
    },
    progressDuration: {
      paddingLeft: "4px",
      color: "#aaa"
    },
    progressSlide: {
      color: "#fff",
      fontWeight: "bold"
    },
    progressSlides: {
      paddingLeft: "4px",
      color: "#aaa"
    },
    textButton: {
      textTransform: "uppercase",
      fontSize: "10px",
      verticalAlign: "top"
    },
    loading: {
      position: "absolute",
      color: "#ce7"
    },
    playbackRate: {
      color: "#999",
      fontSize: "1.2em"
    },
    buttons: {
      display: "flex",
      lineHeight: "32px",
      whiteSpace: "nowrap"
    },
    buttonsSection: {
      marginRight: "8px",
      fontSize: "12px",
      display: "block"
    },
    buttonsRight: {
      flex: 1,
      textAlign: "right",
      paddingRight: "4px"
    }
  }
};

class PlayerControls extends Component {
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
    const {
      Button,
      diaporama,
      styles,
      loadingIcons,
      loadingOpacity,
      progressHeight
    } = this.props;
    const {
      loop,
      currentTime,
      duration,
      paused,
      playbackRate,
      slide,
      data,
      timeBuffered,
      currentRenderState
    } = diaporama;
    const slides = data.timeline.length;

    const progressContainer = {
      ...styles.progressContainer,
      height: progressHeight+"px"
    };
    const loading = {
      ...styles.loading,
      opacity: loadingOpacity[currentRenderState],
      top: -(16 - progressHeight)/2,
      left: `${0.5 + 100 * currentTime / duration}%`
    };
    const buffered = {
      ...styles.buffered,
      width: `${100 * timeBuffered / duration}%`
    };
    const progress = {
      ...styles.progress,
      width: `${100 * currentTime / duration}%`
    };
    return <div style={styles.style}>
      <a style={progressContainer} onClick={this.onProgressClick}>
        <div style={progress}></div>
        <div style={buffered}></div>
        <i style={loading} className={loadingIcons[currentRenderState]}></i>
      </a>
      <div style={styles.buttons}>
        <div style={styles.buttonsSection}>
          <Button onClick={() => diaporama.paused = !paused} icon={paused ? "play" : "pause"} />
          <span style={styles.progressTime}>{this.formatDuration(currentTime)}</span> /
          <span style={styles.progressDuration}>{this.formatDuration(duration)}</span>
        </div>
        <div style={styles.buttonsSection}>
          <Button onClick={() => diaporama.prev()} icon="step-backward" />
          <span style={styles.progressSlide}>{slide+1}</span> /
          <span style={styles.progressSlides}>{slides}</span>
          <Button onClick={() => diaporama.next()} icon="step-forward" />
        </div>
        <div style={styles.buttonsSection}>
          <Button onClick={() => diaporama.playbackRate /= 2} icon="backward" />
          <span style={styles.playbackRate}>{0.001 * Math.round(playbackRate * 1000)}x</span>
          <Button onClick={() => diaporama.playbackRate *= 2} icon="forward" />
        </div>
        <div style={styles.buttonsRight}>
          <Button onClick={() => diaporama.loop = !loop} togglable active={loop}>
            <span style={styles.textButton}>loop</span>
          </Button>
        </div>
      </div>
    </div>;
  }
}

PlayerControls.defaultProps = defaultProps;

PlayerControls.init = (dom, props) => {
  React.render(<PlayerControls {...props} />, dom);
};

module.exports = PlayerControls;
