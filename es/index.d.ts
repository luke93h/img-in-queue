import React from 'react';
export interface ImgProps {
    src: string;
    id: string | number;
    defaultSrc?: string;
}
export interface QueueProps {
    imgs: ImgProps[];
    defaultSrc?: string;
}
declare class Index extends React.Component<QueueProps, {}> {
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    preloadImgs: (imgs: any) => void;
    preload: (index: any) => false | undefined;
    render(): any;
}
export default Index;
