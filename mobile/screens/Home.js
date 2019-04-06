import * as React from 'react';
import { Text, View, StyleSheet, Alert, AsyncStorage  } from 'react-native';
import { Button as ButtonReact } from 'react-native';
import { Constants } from 'expo';

import { Container, Header, Left, Body, Right, Button, Icon, Title, List, ListItem, Content, Item, Label, Input, Spinner } from 'native-base';
import Modal from "react-native-modal";

export default class Home extends React.Component {
  static navigationOptions = {
    header: null,
  };
  
  constructor(props) {
    super(props);
    this.state = {
      listArray: [],
      isVisible: false,
      zoneName: ''
    };
  }

  componentDidMount() {
    this.bootstrapAsync()
  }
  
  bootstrapAsync = async () => {
    let zoneFile = await AsyncStorage.getItem('zone')
    let zone = JSON.parse(zoneFile);
    if( zone ) {
      this.setState({
        listArray: zone
      })
      console.log('bootstrapAsync', this.state.listArray) 
    } 
  }

  saveZone = () => {
    if(this.state.zoneName == '') {
      Alert.alert(
        'Alert!',
        'Please Enter zone name',
        [                        
          {text: 'OK', },
        ],
        {cancelable: false},
      )
    } else {
      console.log(this.state.zoneName) 
      this.setState({isVisible: false}) 
      this.setState({ listArray: [...this.state.listArray, this.state.zoneName] },
        async () => {
          console.log('It was saved successfully ->', this.state.listArray)
          await AsyncStorage.setItem('zone', JSON.stringify(this.state.listArray) )
          .then( ()=>{
              console.log('It was saved successfully')
          } )
          .catch( ()=>{
              console.log('There was an error saving the product')
          } )
  
        } 
      )
      
    }    
      
  }

  render() {
    const { isFocused } = this.state;
    const { onFocus, onBlur, ...otherProps } = this.props;

    deleteList = (value) => {
      Alert.alert(
        'Delete?',
        value,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', 
          onPress: () => { 
            let array = this.state.listArray.filter((item) => {
              return item !== value
            });
            console.log('OK Pressed', value, array); 
            this.setState( {listArray: array} ,
              async () => {
                await AsyncStorage.setItem('zone', JSON.stringify(this.state.listArray) )
                .then( ()=>{
                    console.log('delete, It was saved successfully')
                } )
                .catch( ()=>{
                    console.log('delete, There was an error saving the product')
                } )
        
              } 
            ) 
          }},
        ],
        {cancelable: false},
      );
    }

    modalButtonPress = (value) => {
      console.log(value)
    }

    return (
      <Container style={styles.paddingStatusBar} >
        <Header>
          {/* <Left>
            <Button transparent>
              <Icon name='arrow-back' />
            </Button>
          </Left> */}
          <Body style={{ marginLeft: 10 }} >
            <Title>Zone</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name='add' onPress={ () => { 
                this.setState({ isVisible: true }) 
                this.setState({ zoneName: '' })
              }} />
            </Button>
          </Right>
        </Header>
        
        <Content >
          <List 
            dataArray={this.state.listArray}             
            renderRow={ (item) => (
              <ListItem>
                <Left>
                  <Text>{item}</Text>
                </Left>
                <Right>
                  <Icon 
                    name="md-remove-circle" 
                    style={{color: 'red'}}
                    onPress={ () => { deleteList(item) } }      
                  />
                </Right>
              </ListItem>
            )}
          /> 

          <Modal 
            isVisible={this.state.isVisible}
          >
            <View style={styles.modalContent} >
              <Item floatingLabel last>
                <Label>Zone name</Label>
                <Input 
                  onChangeText={(text)=>{ this.setState({zoneName: text})}}
                
                />
              </Item>
              <View style={styles.modalContentButton} >
                <View style={styles.modalContentButton}>
                  <ButtonReact title="Cancel" onPress={() => { this.setState({isVisible: false}) } } color={'gray'} />
                </View>
                <View style={styles.modalContentButton}>
                  <ButtonReact title="Save" 
                    onPress={this.saveZone}
                  
                  />
                  <Spinner />
                </View>
              </View>

            </View>
          </Modal>
        

        </Content>

        <Content contentContainerStyle={styles.container}>
          { !this.state.listArray.length ?   
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              Tap to "+" add zone 
            </Text>
            : null
          }

        </Content> 

      </Container>

    );
  }
}

const styles = StyleSheet.create({
  paddingStatusBar: {
    paddingTop: Constants.statusBarHeight,
  },
  container: {
    // flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
  },
  textInput: {
    height: 40,
    paddingLeft: 6
  },
});
