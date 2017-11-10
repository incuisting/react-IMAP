import React, { Component, Children } from 'react';
import APILoader from '../utils/APILoader';


const containerStyle = {
    width: '100%',
    height: '100%'
}

const wrapperStyle = {
    width: '100%',
    height: '100%',
    position: 'relative'
}

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mapLoaded: false
        };
    }

    
    componentDidMount() { // 挂载后
        this.loadMap();
    }

    componentDidUpdate() { // 更新后
        this.loadMap();
    }

    loadMap() {  // ？加载地图的方法？？？
            this.initMapInstance();
            if (!this.state.mapLoaded) {
                this.setState({
                    mapLoaded: true
                });
            }
    }
    renderChildren() { // 为children组件 传入__map__ 和__ele__两个默认属性
        return Children.map(this.props.children, (child) => {
            if (child) {
                const cType = child.type;
                /* 针对下面两种组件不注入地图相关属性
                 * 1. 明确声明不需要注入的
                 * 2. DOM 元素
                 */
                if (cType.preventAmap || (typeof cType === 'string')) {
                    return child;
                }
                return React.cloneElement(child, {
                    __map__: this.map,
                    // consider to remove __ele__, because map.getContainer can also get this
                    __ele__: this.mapWrapper
                });
            }
            return child;
        });
    }

    initMapInstance() { // 地图初始化
        if (!this.map) { // 检测map属性是否存在
            const options = this.props.options  // #接受options
           // const options = this.buildCreateOptions(); // 获取option？？
            this.map = new window.IMAP.Map(this.mapWrapper, options); // 为地图构造函数 传入 DOM 和 初始属性
            
        }
    }

    render() {
        return (
            <div style={wrapperStyle}>
                <div ref={(div) => { this.mapWrapper = div }} style={containerStyle} >
                </div>
                <div>
                    {this.state.mapLoaded ? this.renderChildren() : null}
                </div>
            </div>
        )
    }
}

export default Map;