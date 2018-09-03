import React from 'react';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {expect} from 'chai';
import {init} from '..';

configure({adapter: new Adapter()});

describe('test for rectx', () => {
  it('renders without crashing', () => {
    const {Ctx} = init({
      value: 1,
      dummy: 1,
    });

    const TestComponent = () => Ctx(s => <div id="test-div">{s.value}</div>);
    const wrapper = mount(<TestComponent />);
    const node = wrapper.find('#test-div');
    expect(node.getDOMNode().textContent).equal('1');
  });

  it('should mutate when calling `Put`', async () => {
    const {Put, Ctx} = init({
      value: 1,
      dummy: 1,
    });

    const TestComponent = () => Ctx(s => <div id="test-div">{s.value}</div>);
    const wrapper = mount(<TestComponent />);
    const node = wrapper.find('#test-div');
    expect(node.getDOMNode().textContent).equal('1');

    Put(s => (s.value = 2));

    expect(node.getDOMNode().textContent).equal('2');
  });

  it('should mutate when use `mutatable api`', async () => {
    const {Put, Ctx} = init({
      value: 1,
      dummy: 1,
    });
    const TestComponent = () => Ctx(s => <div id="test-div">{s.value}</div>);
    const wrapper = mount(<TestComponent />);
    const node = wrapper.find('#test-div');
    expect(node.getDOMNode().textContent).equal('1');

    Put(s => (s.value = 2));

    expect(node.getDOMNode().textContent).equal('2');
  });

  it('should unListen when component is unmounted && without getting wrong', async () => {
    const Store = init({
      value: 1,
      dummy: 1,
    });
    const TestComponent = () =>
      Store.Ctx(s => <div id="test-div">{s.value}</div>);

    const wrapper = mount(<TestComponent />);
    const node = wrapper.find('#test-div');
    expect(node.getDOMNode().textContent).equal('1');

    wrapper.unmount();
    Store.Put(s => (s.value = 2));

    // expect(node.getDOMNode().textContent).equal('2');
    expect(Store.Store().value).equal(2);
    Store.Put(s => (s.value = 10));
    expect(Store.Store().value).equal(10);
  });

  test('`Ctx` can be a render-props funtion', async () => {
    const {Put, Ctx} = init({
      value: 1,
      dummy: 1,
    });
    const App = () => (
      <Ctx>{s => <div id="test-div-render-props">{s.value}</div>}</Ctx>
    );

    const wrapper = mount(<App />);
    const node = wrapper.find('#test-div-render-props');
    expect(node.getDOMNode().textContent).equal('1');

    Put(s => (s.value = 2));

    expect(node.getDOMNode().textContent).equal('2');
  });

  test('`Put` without function call will not update', async () => {
    const {Put, Ctx} = init({
      value: 1,
      dummy: 1,
    });
    const App = () => (
      <Ctx>{s => <div id="test-div-render-props">{s.value}</div>}</Ctx>
    );

    const wrapper = mount(<App />);
    const node = wrapper.find('#test-div-render-props');
    expect(node.getDOMNode().textContent).equal('1');

    Put({value: 10});

    expect(node.getDOMNode().textContent).equal('1');
  });

  test('`Put` without function call will not update, and no component', async () => {
    const {Put, Ctx, Store} = init({
      value: 1,
      dummy: 1,
    });

    Put({value: 10});

    expect(Store().value).equal(1);
  });

  test('if everthing is equal, then will not update, and no component', async () => {
    const {Put, Ctx, Store} = init({
      value: 1,
      dummy: 1,
    });

    Put(s => (s.value = 1));

    expect(Store().value).equal(1);
  });

  test('if everthing is equal, then will not update', async () => {
    const {Put, Ctx} = init({
      value: 1,
      dummy: 1,
    });
    let render = 0;
    const App = () => {
      render = render + 1;
      return <Ctx>{s => <div id="test-div-render-props">{s.value}</div>}</Ctx>;
    };

    const wrapper = mount(<App />);
    const node = wrapper.find('#test-div-render-props');
    expect(node.getDOMNode().textContent).equal('1');

    Put(s => (s.value = 1));

    expect(node.getDOMNode().textContent).equal('1');
    expect(render).equal(1);
  });

  test('`Auto` and `Ctx` testting ', async () => {
    const {Put, Ctx, Auto} = init({
      value: 1,
      dummy: 1,
    });

    let renderTimes = 0;
    const Dumb = Auto(s => s.dummy);
    const Dummy = ({data}) => {
      renderTimes = renderTimes + 1;
      return <div id="dummy">{data}</div>;
    };

    const App = () => (
      <div>
        <div>
          {Dumb(dummy => (
            <Dummy data={dummy} />
          ))}
        </div>
        <Ctx>{s => <div id="test-div-render-props">{s.value}</div>}</Ctx>
      </div>
    );

    const wrapper = mount(<App />);
    const node = wrapper.find('#test-div-render-props');
    const id_dummy = wrapper.find('#dummy');
    expect(node.getDOMNode().textContent).equal('1');
    expect(renderTimes).equal(1);

    Put(s => (s.value = 2));

    expect(renderTimes).equal(1);
    expect(node.getDOMNode().textContent).equal('2');
    Put(s => (s.dummy = 10));

    expect(renderTimes).equal(2);
    expect(node.getDOMNode().textContent).equal('2');
    expect(id_dummy.getDOMNode().textContent).equal('10');
  });
});
