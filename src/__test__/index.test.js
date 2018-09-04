import React from 'react';
import { render, mount } from 'enzyme';
import Table from '..';

describe('load imgs in queue', () => {
  let imgs = [];
  for (let i = 0; i < 20; i++) {
    let name = i % 2 === 0 ? 1 : 2;
    imgs.push({
      id: i,
      src: `https://github.com/luke93h/img-in-queue/blob/master/assets/name.jpg?raw=true&timestamp=${i}${Date.now()}`,
      defaultSrc:
        "https://github.com/luke93h/img-in-queue/blob/master/assets/${name-default}.jpg?raw=true"
    });
  }
  function createQueue(props) {
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
            />
          ))
        }
      </ImgQueue>
    );
  }
  
  it('should have the right numbers', () => {
    const wrapper = mount(createQueue());
    expect(wrapper.find('img')).toHaveLength(20);
  });

})
