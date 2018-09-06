import React from 'react';
import { render, mount } from 'enzyme';
import ImgQueue from '..';

describe('load imgs in queue', () => {
  function getSrc (i, isDefault){
    if(isDefault){
      return  `https://test.com/${i}-default.jpg`
    }
    return `https://test.com/${i}.jpg`
  }
  function getWrapperSrc(wrapper) {
    return wrapper.prop('src')
  } 
  function createQueue(num, defaultSrc, cancelDefault) {
    let _imgs = [];
    for (let i = 0; i < num; i++) {
      let name = i % 2 === 0 ? 1 : 2;
      _imgs.push({
        id: i,
        src: `https://test.com/${i}.jpg`,
        defaultSrc: cancelDefault ? undefined :  `https://test.com/${i}-default.jpg`,
      });
    }
    return (
      <div>
        <ImgQueue
          imgs={_imgs}
          defaultSrc={defaultSrc}
        >
          {imgs =>{
            return imgs.map(img => (
              <img
                alt=""
                style={{ width: "100px" }}
                src={img.src}
                key={img.id}
                id={`id${img.id}`}
              />
            ))
          }
          }
        </ImgQueue>
      </div>
    );
  }
  beforeAll(() => {
    // Mocking Image.prototype.src to call the onload
    // callbacks depending on the src passed to it
    Object.defineProperty(global.Image.prototype, 'src', {
      set(src) {
        this._internalSrc = src
        setTimeout(() => {
          if(typeof this.onload === 'function'){
            this.onload()
          }
        }, 1000);
      },
      get() {
        return this._internalSrc
      }
    });
  })
  it('should have the right numbers', () => {
    const wrapper = mount(createQueue(20));
    expect(wrapper.find('img')).toHaveLength(20);
  });
  it('test imgs defaultSrc', () => {
    const wrapper = mount(createQueue(2));
    expect(getWrapperSrc(wrapper.find('#id0'))).toEqual(getSrc(0, true))
    expect(getWrapperSrc(wrapper.find('#id1'))).toEqual(getSrc(1, true))
  });
  it('test global defaultSrc', () => {
    const wrapper = mount(createQueue(2, 'https://test.com/default.jpg', true));
    expect(getWrapperSrc(wrapper.find('#id0'))).toEqual('https://test.com/default.jpg')
    expect(getWrapperSrc(wrapper.find('#id1'))).toEqual('https://test.com/default.jpg')
  });
  
  it('img defaultSrc has higher priority', () => {
    const wrapper = mount(createQueue(2, 'https://test.com/default.jpg', false));
    expect(getWrapperSrc(wrapper.find('#id0'))).toEqual(getSrc(0, true))
    expect(getWrapperSrc(wrapper.find('#id1'))).toEqual(getSrc(1, true))
  });
  it('load imgs later', () => {
    const wrapper = mount(createQueue(1));
    expect(wrapper.find('img')).toHaveLength(1);
    expect(wrapper.find('#id0').prop('src')).toEqual(getSrc(0, true))
    return new Promise(resolve => {
      setTimeout(() => {
        wrapper.update()
        expect(wrapper.find('#id0').prop('src')).toEqual(getSrc(0, false))
        resolve()
      }, 2000)
    })
  });

})
