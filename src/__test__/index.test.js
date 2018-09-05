import React from 'react';
import { render, mount } from 'enzyme';
import ImgQueue from '..';

describe('load imgs in queue', () => {
  let src1 = 
  function createQueue(num) {
    let imgs = [];
    for (let i = 0; i < num; i++) {
      let name = i % 2 === 0 ? 1 : 2;
      imgs.push({
        id: i,
        src: `https://github.com/luke93h/img-in-queue/blob/master/assets/${name}.jpg?raw=true&timestamp=${i}${Date.now()}`,
        defaultSrc: `https://github.com/luke93h/img-in-queue/blob/master/assets/${name}-default.jpg?raw=true`,
      });
    }
    return (
      <ImgQueue
        imgs={imgs}
      >
        {imgs =>
          imgs.map(img => (
            <img
              alt=""
              style={{ width: "100px" }}
              src={img.src}
              key={img.id}
              id={img.id}
            />
          ))
        }
      </ImgQueue>
    );
  }
  it('should have the right numbers', () => {
    const wrapper = mount(createQueue(20));
    expect(wrapper.find('img')).toHaveProperty(src, );
    expect(wrapper.find('#0')).toHaveProperty(20);
    expect(wrapper.find('#1')).toHaveProperty(20);
  });
})
