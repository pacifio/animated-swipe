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
    renderOnEnd: () => {}
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
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.onSwipeComplete("right");
              this.position.setValue({ x: 0, y: 0 });
            });
          });
        } else if (gesture.dx < -SCREEN_SWIPE_CLOSE) {
          this.forceSwipe("left", () => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
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
      currentIndex: 0
    };

    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ["-10deg", "0deg", "10deg"],
      extrapolate: "clamp"
    });

    this.transformStyles = {
      transform: [
        {
          rotate: this.rotate
        },
        ...this.position.getTranslateTransform()
      ]
    };

    this.itemOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: "clamp"
    });

    this.itemScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: "clamp"
    });
  }

  onSwipeComplete = direction => {
    const item = this.props.data[this.state.currentIndex - 1];
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
    if (this.state.currentIndex >= this.props.data.length) {
      return this.props.renderOnEnd();
    }

    return this.props.data
      .map((item, i) => {
        if (i < this.state.currentIndex) {
          return null;
        } else if (i == this.state.currentIndex) {
          return (
            <Animated.View
              {...this.panResponder.panHandlers}
              key={i}
              style={[
                this.transformStyles,
                {
                  height: SCREEN_HEIGHT - 120,
                  width: SCREEN_WIDTH,
                  padding: 10,
                  position: "absolute"
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
                  opacity: this.itemOpacity,
                  transform: [{ scale: this.itemScale }]
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
  onSwipeRight: PropTypes.func,
  onSwipeRight: PropTypes.func,
  renderOnEnd: PropTypes.func,
  renderItem: PropTypes.func.isRequired
};
