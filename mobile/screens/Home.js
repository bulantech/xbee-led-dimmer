import * as React from 'react';
import { Text, View, StyleSheet, Alert, AsyncStorage  } from 'react-native';
import { Button as ButtonReact } from 'react-native';
import { Constants } from 'expo';

import { Container, Header, Left, Body, Right, Button, Icon, Title, List, ListItem, Content, Item, Label, Input, Spinner } from 'native-base';
import Modal from "react-native-modal";

export default class Home extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });
  
  constructor(props) {
    super(props);
    this.state = {
      listZone: [],
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
        listZone: zone
      })
      console.log('bootstrapAsync', this.state.listZone) 
    } 
  }

  saveZone = () => {
    let zoneNameIndex = this.state.listZone.indexOf(this.state.zoneName)
    if(zoneNameIndex >= 0) {
      Alert.alert(
        'Alert!',
        'Zone name Exist',
        [                        
          {text: 'OK', },
        ],
        {cancelable: false},
      )
    } else if(this.state.zoneName == '') {
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
      this.setState({ listZone: [...this.state.listZone, this.state.zoneName] },
        async () => {
          console.log('It was saved successfully ->', this.state.listZone)
          await AsyncStorage.setItem('zone', JSON.stringify(this.state.listZone) )
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
            let array = this.state.listZone.filter((item) => {
              return item !== value
            });
            console.log('OK Pressed', value, array); 
            this.setState( {listZone: array} ,
              async () => {
                await AsyncStorage.setItem('zone', JSON.stringify(this.state.listZone) )
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
              <Icon name='add' style={{ fontSize: 40,}} onPress={ () => { 
                this.setState({ isVisible: true }) 
                this.setState({ zoneName: '' })
              }} />
            </Button>
          </Right>
        </Header>
        
        <Content >
          <List 
            dataArray={this.state.listZone}             
            renderRow={ (item) => (
              <ListItem onPress={() => this.props.navigation.navigate('Zone',{
                zoneName: item,
              })} >
                <Left>
                  <Text >{item}</Text>
                </Left>
                <Right>
                  <Icon 
                    name="md-remove-circle" 
                    style={{color: 'red', fontSize: 35,}}
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
                  <ButtonReact 
                    title="Save" 
                    onPress={this.saveZone}
                  />
                </View>
              </View>

            </View>
          </Modal>
        

        </Content>

        { !this.state.listZone.length ? 
          <Content contentContainerStyle={styles.container} >
            <Icon 
              name="md-add-circle" 
              style={{color: 'blue', fontSize: 50, marginRight: 5}}
              onPress={ () => { 
                this.setState({ isVisible: true }) 
                this.setState({ zoneName: '' })
              }}
            />
            <Text style={{fontSize: 20, fontWeight: 'bold', }}>
              Add zone 
            </Text>
          </Content> 
          : null
        }

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
    flexDirection: 'row',
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
