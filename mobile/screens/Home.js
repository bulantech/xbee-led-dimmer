import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Constants } from 'expo';

import { Container, Header, Left, Body, Right, Button, Icon, Title } from 'native-base';

export default class Home extends React.Component {
  static navigationOptions = {
    header: null,
  };
  
  constructor() {
    super();
    this.state = {
  
    };
  }

  render() {
    return (
      <Container style={styles.paddingStatusBar} >
        <Header>
          {/* <Left>
            <Button transparent>
              <Icon name='arrow-back' />
            </Button>
          </Left> */}
          <Body>
            <Title>Zone</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name='add' />
            </Button>
          </Right>
        </Header>

        <View style={styles.container}>
          <Text>
            Add zone tap + 
          </Text>
        </View>

      </Container>
 
    );
  }
}

const styles = StyleSheet.create({
  paddingStatusBar: {
    paddingTop: Constants.statusBarHeight,
  },
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
