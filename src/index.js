import React from 'react';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: {},
    };
    this.imgs = [];
    this.preloadImgs(props.imgs);
  }
  componentWillReceiveProps(nextProps) {
    let { imgs } = nextProps;
    this.preloadImgs(imgs);
  }
  preloadImgs = imgs => {
    let { srcName = 'src', keyName = 'id' } = this.props;
    imgs.forEach(img => {
      let { [keyName]: id } = img;
      if (this.state.loaded[id]) {
        return;
      }
      if (this.imgs.some(item => item.id === img.id)) {
        return;
      }
      this.imgs.push(img);
      if (this.preloading) {
        return;
      }
      this.preload(this.imgs.length - 1);
    });
  };
  preload = index => {
    let { srcName = 'src', keyName = 'id' } = this.props;
    index = index || 0;
    if (index >= this.imgs.length) {
      this.preloading = false;
      return false;
    }
    this.preloading = true;
    let { [keyName]: id } = this.imgs[index];
    let oImg = new Image();
    oImg.onload = () => {
      this.setState({
        loaded: {
          ...this.state.loaded,
          [id]: true,
        },
      });
      this.preload(index + 1);
    };
    oImg.onerror = () => {
      this.preload(index + 1);
    };
    oImg.src = this.imgs[index][srcName];
  };
  render() {
    let { imgs, defaultSrc = '', srcName = 'src', keyName = 'id' } = this.props;
    let imgs=imgs.map(item => ({ ...item, src: this.state.loaded[item[keyName]] ? item[srcName] : defaultSrc }));
    return this.props.children(imgs);
  }
}
export default Index;