<p align="center">
  <img width="230" src="https://github.com/luke93h/img-in-queue/blob/master/docs/logo.png?raw=true">
</p>

# img-in-queue

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![David deps][david-image]][david-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/img-in-queue.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/img-in-queue
[travis-image]: https://img.shields.io/travis/luke93h/img-in-queue.svg?style=flat-square
[travis-url]: https://travis-ci.org/luke93h/img-in-queue
[coveralls-image]: https://img.shields.io/coveralls/luke93h/img-in-queue.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/luke93h/img-in-queue?branch=master
[david-image]: https://img.shields.io/david/luke93h/img-in-queue.svg?style=flat-square
[david-url]: https://david-dm.org/luke93h/img-in-queue
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/img-in-queue.svg?style=flat-square
[download-url]: https://github.com/luke93h/img-in-queue

串行预加载图片的中间件组件

## 背景

有些页面需要加载高清图，如果此时并发的请求过多，会造成网络请求缓慢。

> chrome浏览器中，http1并发数限制为6，http2则没有并发数限制，[了解更多](https://www.zhihu.com/question/34074946)

![http1](https://github.com/luke93h/img-in-queue/blob/master/assets/http1.jpg?raw=true) 

![http2](https://github.com/luke93h/img-in-queue/blob/master/assets/http2.png?raw=true) 

并行加载所有请求对网页的整体加载有很大的优化，但是如果我们如果需要快速展示第一张图片，那这样的请求速度肯定是满足不了需求的。

## 解决思路

1. 串行加载图片，避免因网络分流而导致首张图片加载缓慢
2. 在后台预加载后面的图片，加载完毕后替换img的src属性

![queue](https://github.com/luke93h/img-in-queue/blob/master/assets/queue.png?raw=true) 

第一次加载为后台用new Img()的方式进行请求，第二次则为改变真实dom的src属性时发起的请求，由于存在缓存，请求时间几乎为0。

## 使用方法

```jsx
import React from 'react';
import ReactDOM from 'react-dom'
import ImgQueue from 'img-in-queue'

let imgs = []
for(let i = 0; i < 20; i++){
  imgs.push({
    id: i,
    src: `https://github.com/luke93h/img-in-queue/blob/master/assets/1.jpg?raw=true&timestamp=${i}${Date.now()}`
  })
}

class Index extends React.PureComponent {
  render() {
    return (
      <ImgQueue
        imgs={imgs}
        defaultSrc='https://github.com/luke93h/img-in-queue/blob/master/assets/2.jpg?raw=true'
      >
        {imgs => (
          imgs.map(img => (
            <img src={img.src} key={img.id}></img>
          ))
        )}
      </ImgQueue>
    );
  }
}
ReactDOM.render(
  <Index />,
  mountNode)

```

## API

### ImgInQueue

| 属性        | 说明    |  类型  |  默认值  |
| :--------:    | :-----:  | :----: |  :----: |
| imgs        | 图片数组    |  ImgProps[ ]  |  [ ]  |
| defaultSrc        | 加载未完成时显示的url    |  string  |  ''  |

### Img


| 属性        | 说明    |  类型  |  默认值  |
| :--------:    | :-----:  | :----: |  :----: |
| src        | 图片src    |  string  |  -  |
| id        |   图片唯一id    |  string  |  -  |
| defaultSrc        | 加载未完成时显示的url，优先级比ImgInQueue中的高    |  string  |  -  |

## 开源协议 

MIT
