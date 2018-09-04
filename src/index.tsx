import React from 'react';


export interface ImgProps {
  src: string;
  id: string | number;
  defaultSrc?:  string;
}

export interface QueueProps {
  imgs: ImgProps[];
  defaultSrc?: string;
}

class Index extends React.Component<QueueProps, {}> {
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
    imgs.forEach(img => {
      let { id } = img;
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
    index = index || 0;
    if (index >= this.imgs.length) {
      this.preloading = false;
      return false;
    }
    this.preloading = true;
    let { id } = this.imgs[index];
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
    oImg.src = this.imgs[index].src;
  };
  render() {
    let { imgs = [], defaultSrc = '' } = this.props;
    imgs = imgs.map(item => ({ ...item, src: this.state.loaded[item.id] ? item.src : (item.defaultSrc || defaultSrc) }))
    return this.props.children(imgs)
  }
}
export default Index;
