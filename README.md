# Animated swipe

A react component for creating a tinder like swiping view . Created using the raw <code>Animated, PanResponder</code> module . It has been tested accros different devices .

# Example

Please take a look at this [video](https://d3a1eqpdtt5fg4.cloudfront.net/items/1Y0q100U133W2q0d2i0A/example.mov) for an example

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)

# Installation

```bash
npm install --save animated-swipe
OR
yarn add animated-swipe
```

# Usage

```javascript
import React from "react";
import { View, Text, Image } from "react-native";
import Swipe from "animated-swipe";

const Card = props => {
  return (
    <View>
      <Text>{props.title}</Text>
      <Image source={{ uri: props.image }} />
    </View>
  );
};

const data = [
  {
    id: "212dw3232dqs32",
    title: "title 1",
    image: "image1.jpg"
  },
  {
    id: "43sd3324fdsf34",
    title: "title 2",
    image: "image2.jpg"
  },
  {
    id: "1298avsdfdf193",
    title: "title 1",
    image: "image3.jpg"
  }
];

class App extends React.Component {
  render() {
    return (
      <View>
        <Swipe
          data={data}
          renderItem={item => {
            return <Card key={item.id} title={item.title} image={item.image} />;
          }}
        />
      </View>
    );
  }
}

export default App;
```

# Props

| Props        |            Type            | isRequired |                         Description                          |
| ------------ | :------------------------: | :--------: | :----------------------------------------------------------: |
| data         |           array            |    true    |                An array of data for iteration                |
| onSwipeRight |          function          |   false    |             Called when the item is swiped right             |
| onSwipeLeft  |          function          |   false    |             Called when the item is swiped left              |
| renderOnEnd  | function / react component |   false    |               Render jsx when data array ends                |
| renderItem   | function / react component |    true    | Render jsx per array item , the item is passed via parameter |
| onEnd        |          function          |   false    |                 Called when data array ends                  |

> Created by Adib Mohsin
