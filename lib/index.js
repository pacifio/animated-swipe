/*
MIT License

Copyright (c) 2019 Adib Mohsin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import React, { Component } from "react";
import { View, PanResponder, Animated, Dimensions } from "react-native";
import PropTypes from "prop-types";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_SWIPE_CLOSE = SCREEN_WIDTH * 0.3;

export default class Main extends Component {
  static defaultProps = {
    onSwipeLeft: () => {},
    onSwipeRight: () => {},
    renderOnEnd: () => {},
    onEnd: () => {}
  };

  constructor(props) {
    super(props);

    this.position = new Animated.ValueXY();
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_event, gesture) => {
        this.position.setValue({
          x: gesture.dx,
          y: gesture.dy
        });
      },
      onPanResponderRelease: (_event, gesture) => {
        if (gesture.dx > SCREEN_SWIPE_CLOSE) {
          this.forceSwipe("right", () => {
            this.setState({ dataIndex: this.state.dataIndex + 1 }, () => {
              this.onSwipeComplete("right");
              this.position.setValue({ x: 0, y: 0 });
            });
          });
        } else if (gesture.dx < -SCREEN_SWIPE_CLOSE) {
          this.forceSwipe("left", () => {
            this.setState({ dataIndex: this.state.dataIndex + 1 }, () => {
              this.onSwipeComplete("left");
              this.position.setValue({ x: 0, y: 0 });
            });
          });
        } else {
          Animated.spring(this.position, {
            toValue: {
              x: 0,
              y: 0
            }
          }).start();
        }
      }
    });

    this.state = {
      dataIndex: 0
    };
  }

  onSwipeComplete = direction => {
    const item = this.props.data[this.state.dataIndex - 1];
    direction === "right"
      ? this.props.onSwipeRight({ ...item, direction })
      : this.props.onSwipeLeft({ ...item, direction });
  };

  forceSwipe = (direction, callback) => {
    const x =
      direction === "right" ? SCREEN_WIDTH + 100 : -(SCREEN_WIDTH + 100);
    Animated.timing(this.position, {
      toValue: {
        x,
        y: 0
      }
    }).start(() => callback());
  };

  renderItems = () => {
    if (this.state.dataIndex >= this.props.data.length) {
      this.props.onEnd();
      return this.props.renderOnEnd();
    }

    return this.props.data
      .map((item, i) => {
        if (i < this.state.dataIndex) {
          return null;
        } else if (i == this.state.dataIndex) {
          return (
            <Animated.View
              {...this.panResponder.panHandlers}
              key={i}
              style={[
                {
                  height: SCREEN_HEIGHT - 120,
                  width: SCREEN_WIDTH,
                  padding: 10,
                  position: "absolute",
                  transform: [
                    {
                      rotate: this.position.x.interpolate({
                        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
                        outputRange: ["-10deg", "0deg", "10deg"],
                        extrapolate: "clamp"
                      })
                    },
                    ...this.position.getTranslateTransform()
                  ]
                }
              ]}
              key={i}
            >
              {this.props.renderItem(item)}
            </Animated.View>
          );
        } else {
          return (
            <Animated.View
              key={i}
              style={[
                {
                  height: SCREEN_HEIGHT - 120,
                  width: SCREEN_WIDTH,
                  padding: 10,
                  position: "absolute",
                  opacity: this.position.x.interpolate({
                    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
                    outputRange: [1, 0, 1],
                    extrapolate: "clamp"
                  }),
                  transform: [
                    {
                      scale: this.position.x.interpolate({
                        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
                        outputRange: [1, 0.8, 1],
                        extrapolate: "clamp"
                      })
                    }
                  ]
                }
              ]}
            >
              {this.props.renderItem(item)}
            </Animated.View>
          );
        }
      })
      .reverse();
  };

  render() {
    return <View>{this.renderItems()}</View>;
  }
}

Main.propTypes = {
  data: PropTypes.array.isRequired,
  onSwipeLeft: PropTypes.func,
  onSwipeRight: PropTypes.func,
  renderOnEnd: PropTypes.func,
  renderItem: PropTypes.func.isRequired,
  onEnd: PropTypes.func
};
